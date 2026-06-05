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
import { labelOf, type Ans } from "@/lib/opportunity-form";
import { isFormComplete, buildPublicVersionDraft, buildInvestorVersionDraft } from "@/lib/opportunity-card";
import { extractAnswers } from "@/lib/opportunity-report";
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

export interface DraftResult {
  ok: boolean;
  id?: string;
  error?: string;
}

// حفظ مسودة معالج الفرصة (ينشئها إن لم تكن موجودة) واشتقاق أعمدة الفرصة من الإجابات.
export async function saveOpportunityDraft(
  opportunityId: string | null,
  answers: Ans
): Promise<DraftResult> {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();
  if (!(await isActiveOwner(session.userId))) {
    return { ok: false, error: t(locale, "err.ownerPendingCreate") };
  }

  const str = (id: string) =>
    typeof answers[id] === "string" ? (answers[id] as string).trim() : "";
  const labels = (id: string) =>
    Array.isArray(answers[id])
      ? (answers[id] as string[]).map((v) => labelOf(id, v)).join("، ")
      : "";

  const title = str("projectName") || "مسودة فرصة";
  const sector = str("opportunityNature")
    ? labelOf("opportunityNature", str("opportunityNature"))
    : "—";
  const country = str("projectCountry") || "—";

  let min: bigint | null = null;
  let max: bigint | null = null;
  if (answers["amountMode"] === "fixed") {
    min = parseAmount(str("amountFixed"));
    max = min;
  } else if (answers["amountMode"] === "range") {
    min = parseAmount(str("amountMin"));
    max = parseAmount(str("amountMax"));
  }

  // اشتقاق ملخّص للإدارة (بجانب الإجابات الكاملة)
  const legacy = {
    summary: [title, str("opportunityNature") && labelOf("opportunityNature", str("opportunityNature"))]
      .filter(Boolean)
      .join(" — "),
    useOfFunds: labels("useOfCapital"),
    financials: [
      str("financialData") && labelOf("financialData", str("financialData")),
      str("annualRevenue") && `إيرادات سنوية ~ ${str("annualRevenue")}`,
    ]
      .filter(Boolean)
      .join(" · "),
    ownerContact: [str("fullName"), str("phone"), str("email")].filter(Boolean).join(" · "),
    exactLocation: [str("projectCity"), str("projectArea"), str("coords")].filter(Boolean).join(" · "),
  };
  const sourceData = { ...legacy, answers } as Prisma.InputJsonValue;

  if (opportunityId) {
    const opp = await loadOwned(opportunityId, session.userId);
    if (!opp) return { ok: false, error: t(locale, "err.notAuthorizedOpp") };
    if (!ownerCanEdit(opp.state)) {
      return { ok: false, error: t(locale, "err.cannotEditAfterSubmit") };
    }
    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: { title, sector, country, investmentMin: min, investmentMax: max, sourceData },
    });
    revalidatePath(`/owner/opportunities/${opportunityId}`);
    revalidatePath("/owner");
    return { ok: true, id: opportunityId };
  }

  const opp = await prisma.opportunity.create({
    data: {
      title,
      sector,
      country,
      ownerId: session.userId,
      state: "DRAFT_SOURCE",
      investmentMin: min,
      investmentMax: max,
      sourceData,
    },
  });
  await logActivity({
    actorId: session.userId,
    action: "OPP_CREATED",
    entityType: "Opportunity",
    entityId: opp.id,
  });
  revalidatePath("/owner");
  return { ok: true, id: opp.id };
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

  // إعداد بطاقة العرض تلقائياً من إجابات النموذج إن اكتملت ولم تُصَغ بعد.
  const full = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { sourceData: true, publicVersion: true },
  });
  const answers = extractAnswers(full?.sourceData);
  const cardData: {
    state: "SUBMITTED";
    publicVersion?: Prisma.InputJsonValue;
    investorVersion?: Prisma.InputJsonValue;
  } = { state: "SUBMITTED" };
  const noPublicYet = !full?.publicVersion || Object.keys(full.publicVersion as object).length === 0;
  if (noPublicYet && isFormComplete(answers)) {
    cardData.publicVersion = buildPublicVersionDraft(answers) as Prisma.InputJsonValue;
    cardData.investorVersion = buildInvestorVersionDraft(answers) as Prisma.InputJsonValue;
  }

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: cardData,
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
): Promise<ActionResult & { fileId?: string; fileName?: string }> {
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
  return { ok: true, fileId: res.fileId, fileName: file.name };
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
