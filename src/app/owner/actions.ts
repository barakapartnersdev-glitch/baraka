"use server";
// إجراءات صاحب المشروع — محمية بـ requireRole("PROJECT_OWNER")
// مع تحقق ملكية الفرصة وحالتها على الخادم. المالك يلمس بيانات المصدر فقط.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/audit";
import {
  ownerCanEdit,
  ownerCanSubmit,
  type SourceData,
} from "@/lib/opportunity";
import { storeFile, removeFile } from "@/lib/files";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

// الحساب يجب أن يكون معتمَداً (ACTIVE) قبل إنشاء/إرسال الفرص.
async function isActiveOwner(userId: string): Promise<boolean> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { accountStatus: true },
  });
  return u?.accountStatus === "ACTIVE";
}

function cleanSource(data: SourceData): SourceData {
  const cleaned: SourceData = {};
  for (const [k, v] of Object.entries(data)) {
    const trimmed = String(v ?? "").trim();
    if (trimmed) cleaned[k as keyof SourceData] = trimmed;
  }
  return cleaned;
}

function parseAmount(raw: FormDataEntryValue | null): bigint | null {
  const s = String(raw ?? "").replace(/[^\d]/g, "");
  return s ? BigInt(s) : null;
}

export interface CreateState {
  error?: string;
}

export async function createOpportunity(
  _prev: CreateState,
  formData: FormData
): Promise<CreateState> {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();

  // حظر الإنشاء قبل اعتماد الإدارة للحساب
  if (!(await isActiveOwner(session.userId))) {
    return { error: t(locale, "err.ownerPendingCreate") };
  }

  const title = String(formData.get("title") ?? "").trim();
  const sector = String(formData.get("sector") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  if (!title || !sector || !country) {
    return { error: t(locale, "err.requiredFields") };
  }

  const source = cleanSource({
    summary: String(formData.get("summary") ?? ""),
    useOfFunds: String(formData.get("useOfFunds") ?? ""),
    financials: String(formData.get("financials") ?? ""),
    ownerContact: String(formData.get("ownerContact") ?? ""),
    exactLocation: String(formData.get("exactLocation") ?? ""),
  });

  const opp = await prisma.opportunity.create({
    data: {
      title,
      sector,
      country,
      ownerId: session.userId,
      state: "DRAFT_SOURCE",
      investmentMin: parseAmount(formData.get("investmentMin")),
      investmentMax: parseAmount(formData.get("investmentMax")),
      sourceData: source as Prisma.InputJsonValue,
    },
  });

  await logActivity({
    actorId: session.userId,
    action: "OPP_CREATED",
    entityType: "Opportunity",
    entityId: opp.id,
  });

  redirect(`/owner/opportunities/${opp.id}`);
}

// تحميل فرصة بعد التأكد أنها تخصّ المالك الحالي
async function loadOwned(opportunityId: string, ownerId: string) {
  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { id: true, ownerId: true, state: true },
  });
  if (!opp || opp.ownerId !== ownerId) return null;
  return opp;
}

export async function saveSourceData(
  opportunityId: string,
  columns: {
    title: string;
    sector: string;
    country: string;
    investmentMin: string;
    investmentMax: string;
  },
  source: SourceData
): Promise<ActionResult> {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();

  const opp = await loadOwned(opportunityId, session.userId);
  if (!opp) return { ok: false, error: t(locale, "err.notAuthorizedOpp") };
  if (!ownerCanEdit(opp.state)) {
    return { ok: false, error: t(locale, "err.cannotEditAfterSubmit") };
  }

  const title = columns.title.trim();
  const sector = columns.sector.trim();
  const country = columns.country.trim();
  if (!title || !sector || !country) {
    return { ok: false, error: t(locale, "err.requiredFields") };
  }

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      title,
      sector,
      country,
      investmentMin: parseAmount(columns.investmentMin),
      investmentMax: parseAmount(columns.investmentMax),
      sourceData: cleanSource(source) as Prisma.InputJsonValue,
    },
  });

  await logActivity({
    actorId: session.userId,
    action: "SOURCE_SAVED",
    entityType: "Opportunity",
    entityId: opportunityId,
  });

  revalidatePath(`/owner/opportunities/${opportunityId}`);
  revalidatePath("/owner");
  return { ok: true };
}

export async function submitForReview(
  opportunityId: string
): Promise<ActionResult> {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();

  // حظر الإرسال قبل اعتماد الإدارة للحساب
  if (!(await isActiveOwner(session.userId))) {
    return { ok: false, error: t(locale, "err.ownerPendingSubmit") };
  }

  const opp = await loadOwned(opportunityId, session.userId);
  if (!opp) return { ok: false, error: t(locale, "err.notAuthorizedOpp") };
  if (!ownerCanSubmit(opp.state)) {
    return { ok: false, error: t(locale, "err.cannotSubmitState") };
  }

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: { state: "SUBMITTED" },
  });

  await logActivity({
    actorId: session.userId,
    action: "OPP_SUBMITTED",
    entityType: "Opportunity",
    entityId: opportunityId,
    details: { from: opp.state },
  });

  revalidatePath(`/owner/opportunities/${opportunityId}`);
  revalidatePath("/owner");
  revalidatePath("/admin");
  return { ok: true };
}

// رفع وثيقة لفرصة المالك (وهي تبقى ADMIN_ONLY حتى تقرّر الإدارة إتاحتها)
export async function uploadOwnerFile(
  opportunityId: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();

  const opp = await loadOwned(opportunityId, session.userId);
  if (!opp) return { ok: false, error: t(locale, "err.notAuthorizedOpp") };
  if (!ownerCanEdit(opp.state)) {
    return { ok: false, error: t(locale, "err.cannotUploadAfterSubmit") };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: t(locale, "err.noFile") };

  const res = await storeFile(opportunityId, file, locale);
  if (!res.ok) return { ok: false, error: res.error };

  await logActivity({
    actorId: session.userId,
    action: "FILE_UPLOADED",
    entityType: "Opportunity",
    entityId: opportunityId,
    details: { fileId: res.fileId, fileName: file.name },
  });

  revalidatePath(`/owner/opportunities/${opportunityId}`);
  return { ok: true };
}

// حذف ملف رفعه المالك بنفسه على فرصته (وما زالت قابلة للتحرير)
export async function deleteOwnerFile(fileId: string): Promise<ActionResult> {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();

  const file = await prisma.opportunityFile.findUnique({
    where: { id: fileId },
    select: {
      id: true,
      storageKey: true,
      opportunityId: true,
      opportunity: { select: { ownerId: true, state: true } },
    },
  });
  if (!file || file.opportunity.ownerId !== session.userId) {
    return { ok: false, error: t(locale, "err.notAuthorized") };
  }
  if (!ownerCanEdit(file.opportunity.state)) {
    return { ok: false, error: t(locale, "err.cannotDeleteAfterSubmit") };
  }

  await removeFile(file.storageKey, file.id);
  await logActivity({
    actorId: session.userId,
    action: "FILE_DELETED",
    entityType: "Opportunity",
    entityId: file.opportunityId,
  });

  revalidatePath(`/owner/opportunities/${file.opportunityId}`);
  return { ok: true };
}
