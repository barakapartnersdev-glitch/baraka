"use server";
// إنشاء فرصة استثمارية ونشرها مباشرة من لوحة الإدارة، مع ترجمتها للغات الأربع
// بالذكاء الاصطناعي. محمي بـ requireRole("ADMIN") ومسجَّل في سجل التدقيق.
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/audit";
import type { VersionData } from "@/lib/opportunity";
import { translateOpportunity, type OppFields } from "@/lib/ai-translate";
import {
  analyzeProjectDocument,
  MAX_DOC_BYTES,
  UnsupportedFileError,
  type OppDraft,
} from "@/lib/ai-extract";

export interface CreateResult {
  ok: boolean;
  id?: string;
  error?: string;
  warning?: string; // نُشرت لكن تعذّرت الترجمة الآلية
}

export interface ExtractResult {
  ok: boolean;
  draft?: OppDraft;
  error?: string;
}

// تحليل ملف مشروع مرفوع بالذكاء الاصطناعي وإرجاع مسوّدة لتعبئة النموذج.
export async function extractOpportunityFromFile(
  fd: FormData
): Promise<ExtractResult> {
  await requireRole("ADMIN");
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "لم يتم اختيار ملف." };
  }
  if (file.size > MAX_DOC_BYTES) {
    return { ok: false, error: "حجم الملف يتجاوز 20 ميجابايت." };
  }

  try {
    const draft = await analyzeProjectDocument(file);
    if (!draft.displayTitle && !draft.summary) {
      return { ok: false, error: "تعذّر استخراج معلومات كافية من الملف. جرّب ملفاً أوضح." };
    }
    return { ok: true, draft };
  } catch (e) {
    console.error("[extractOpportunity] failed:", e);
    if (e instanceof UnsupportedFileError) {
      return { ok: false, error: "نوع الملف غير مدعوم. المدعوم: PDF أو صورة أو ملف نصّي." };
    }
    return { ok: false, error: "تعذّر تحليل الملف. تأكّد أنه ملف واضح وحاول مجدداً." };
  }
}

function str(fd: FormData, k: string): string {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
}

function bigOrNull(fd: FormData, k: string): bigint | null {
  const raw = str(fd, k).replace(/[,\s]/g, "");
  if (!raw) return null;
  try {
    const n = BigInt(raw);
    return n >= BigInt(0) ? n : null;
  } catch {
    return null;
  }
}

export async function createAndPublishOpportunity(
  fd: FormData
): Promise<CreateResult> {
  const session = await requireRole("ADMIN");

  // ---- قراءة الحقول (المصدر بالعربية) ----
  const displayTitle = str(fd, "displayTitle");
  const summary = str(fd, "summary");
  const highlights = str(fd, "highlights");
  const details = str(fd, "details");
  const sector = str(fd, "sector");
  const country = str(fd, "country");
  const city = str(fd, "city");
  const imageUrl = str(fd, "coverImageUrl");
  const destinationId = str(fd, "destinationId") || null;
  const currency = str(fd, "currency") || "USD";
  const investmentMin = bigOrNull(fd, "investmentMin");
  const investmentMax = bigOrNull(fd, "investmentMax");

  // ---- تحقّق ----
  if (!displayTitle || !summary || !sector || !country || !city) {
    return {
      ok: false,
      error: "العنوان والمقدمة والقطاع والدولة والمدينة حقول مطلوبة.",
    };
  }
  if (!imageUrl) {
    return { ok: false, error: "صورة الفرصة مطلوبة." };
  }

  // التأكد من صلاحية الوجهة (إن اختيرت)
  let destId: string | null = null;
  if (destinationId) {
    const dest = await prisma.destination.findUnique({
      where: { id: destinationId },
      select: { id: true },
    });
    destId = dest?.id ?? null;
  }

  // ---- النسخة العامة (عربية) ----
  const publicVersion: VersionData = {
    displayTitle,
    summary,
    ...(highlights ? { highlights } : {}),
    ...(details ? { details } : {}),
    imageUrl,
  };

  // ---- الترجمة بالذكاء الاصطناعي (لا تُفشِل النشر) ----
  const fields: OppFields = {
    displayTitle,
    summary,
    ...(highlights ? { highlights } : {}),
    ...(details ? { details } : {}),
    sector,
    country,
    city,
  };
  let translations: Prisma.InputJsonValue | typeof Prisma.DbNull = Prisma.DbNull;
  let warning: string | undefined;
  try {
    const result = await translateOpportunity(fields);
    translations = result as unknown as Prisma.InputJsonValue;
  } catch (e) {
    console.error("[createOpportunity] translation failed:", e);
    warning =
      "نُشرت الفرصة بالعربية، لكن تعذّرت الترجمة الآلية. يمكنك إعادة توليد الترجمة لاحقاً من صفحة الفرصة.";
  }

  // ---- الإنشاء والنشر ----
  const opp = await prisma.opportunity.create({
    data: {
      title: displayTitle,
      sector,
      country,
      city,
      state: "PUBLISHED",
      publishedAt: new Date(),
      ownerId: session.userId,
      reviewerId: session.userId,
      createdByAdmin: true,
      currency,
      investmentMin,
      investmentMax,
      destinationId: destId,
      publicVersion: publicVersion as unknown as Prisma.InputJsonValue,
      translations,
    },
    select: { id: true },
  });

  await logActivity({
    actorId: session.userId,
    action: "OPP_CREATED",
    entityType: "Opportunity",
    entityId: opp.id,
    details: { source: "admin", published: true, translated: !warning, destinationId: destId },
  });

  // إبطال المخابئ — لوحة الإدارة والصفحات العامة وصفحة الدولة
  revalidatePath("/admin/opportunities");
  revalidatePath("/admin");
  revalidatePath("/[locale]/opportunities", "page");
  revalidatePath("/[locale]/opportunities/[id]", "page");
  revalidatePath("/[locale]", "page");
  if (destId) revalidatePath("/[locale]/investment-destinations/[slug]", "page");

  return { ok: true, id: opp.id, warning };
}
