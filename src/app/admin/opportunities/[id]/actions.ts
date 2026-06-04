"use server";
// إجراءات الإدارة على الفرصة — جميعها محمية بـ requireRole("ADMIN")
// ومسجَّلة في سجل التدقيق، وتُشعِر الطرف المعني عند الحاجة.
import { revalidatePath } from "next/cache";
import {
  Prisma,
  type OpportunityState,
  type FileVisibility,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/audit";
import { notify } from "@/lib/notify";
import { OPP_STATES } from "@/lib/states";
import { storeFile, removeFile } from "@/lib/files";
import {
  canTransition,
  toVersion,
  type VersionData,
  type VersionKey,
  VERSION_KEYS,
} from "@/lib/opportunity";
import { buildNcndaHtml } from "@/lib/ncnda";
import { randomUUID } from "crypto";
import { putObject } from "@/lib/storage";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function changeOpportunityState(
  opportunityId: string,
  nextState: OpportunityState
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const locale = await getLocale();

  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { id: true, state: true, publicVersion: true, ownerId: true },
  });
  if (!opp) return { ok: false, error: t(locale, "err.oppNotFound") };

  // فرض قواعد الانتقال على الخادم
  if (!canTransition(opp.state, nextState)) {
    return { ok: false, error: t(locale, "err.transitionNotAllowed") };
  }

  // لا يمكن النشر قبل إعداد النسخة العامة على الأقل
  if (nextState === "PUBLISHED" && !opp.publicVersion) {
    return { ok: false, error: t(locale, "err.publicVersionRequired") };
  }

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      state: nextState,
      reviewerId: session.userId,
      publishedAt: nextState === "PUBLISHED" ? new Date() : undefined,
    },
  });

  await logActivity({
    actorId: session.userId,
    action: "OPP_STATE_CHANGE",
    entityType: "Opportunity",
    entityId: opportunityId,
    details: { from: opp.state, to: nextState },
  });

  // إشعار صاحب المشروع بتغيّر حالة فرصته
  await notify({
    userId: opp.ownerId,
    type: nextState === "PUBLISHED" ? "OPPORTUNITY_PUBLISHED" : "OPPORTUNITY_STATE_CHANGED",
    message:
      nextState === "PUBLISHED"
        ? "تم نشر فرصتك على المنصة."
        : `تم تحديث حالة فرصتك إلى: ${OPP_STATES[nextState]?.label ?? nextState}`,
    link: `/owner/opportunities/${opportunityId}`,
  });

  revalidatePath(`/admin/opportunities/${opportunityId}`);
  revalidatePath("/admin/opportunities");
  revalidatePath("/admin");
  return { ok: true };
}

// ===== صياغة النسخ الثلاث =====
function cleanVersion(data: VersionData): VersionData | null {
  const cleaned: VersionData = {};
  for (const [k, v] of Object.entries(data)) {
    const trimmed = String(v ?? "").trim();
    if (trimmed) cleaned[k as keyof VersionData] = trimmed;
  }
  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

export async function saveVersion(
  opportunityId: string,
  versionKey: VersionKey,
  data: VersionData
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const locale = await getLocale();

  if (!VERSION_KEYS.includes(versionKey)) {
    return { ok: false, error: t(locale, "err.unknownVersion") };
  }

  const value = cleanVersion(data);
  // إفراغ النسخة يخزّن NULL في العمود (Prisma.DbNull) بدل كائن فارغ
  const fieldValue: Prisma.InputJsonValue | typeof Prisma.DbNull =
    value === null ? Prisma.DbNull : (value as Prisma.InputJsonValue);

  const updateData: Prisma.OpportunityUpdateInput =
    versionKey === "publicVersion"
      ? { publicVersion: fieldValue }
      : versionKey === "investorVersion"
        ? { investorVersion: fieldValue }
        : { postNcndaVersion: fieldValue };

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: updateData,
  });

  await logActivity({
    actorId: session.userId,
    action: "VERSION_SAVED",
    entityType: "Opportunity",
    entityId: opportunityId,
    details: { version: versionKey, cleared: value === null },
  });

  revalidatePath(`/admin/opportunities/${opportunityId}`);
  return { ok: true };
}

// ===== إدارة النواقص =====
export async function addMissingItem(
  opportunityId: string,
  description: string
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const locale = await getLocale();
  const text = description.trim();
  if (!text) return { ok: false, error: t(locale, "err.missingItemDesc") };

  const item = await prisma.missingItem.create({
    data: { opportunityId, description: text },
  });

  await logActivity({
    actorId: session.userId,
    action: "MISSING_ITEM_ADDED",
    entityType: "MissingItem",
    entityId: item.id,
    details: { opportunityId, description: text },
  });

  // إشعار صاحب المشروع بطلب النواقص
  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { ownerId: true },
  });
  if (opp) {
    await notify({
      userId: opp.ownerId,
      type: "MISSING_INFO_REQUESTED",
      message: "طلبت الإدارة استكمال نواقص على فرصتك.",
      link: `/owner/opportunities/${opportunityId}`,
    });
  }

  revalidatePath(`/admin/opportunities/${opportunityId}`);
  revalidatePath("/admin");
  return { ok: true };
}

export async function toggleMissingItem(
  itemId: string,
  resolved: boolean
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");

  const item = await prisma.missingItem.update({
    where: { id: itemId },
    data: { resolved },
  });

  await logActivity({
    actorId: session.userId,
    action: "MISSING_ITEM_RESOLVED",
    entityType: "MissingItem",
    entityId: itemId,
    details: { opportunityId: item.opportunityId, resolved },
  });

  revalidatePath(`/admin/opportunities/${item.opportunityId}`);
  revalidatePath("/admin");
  return { ok: true };
}

// ===== اعتماد طلبات الاهتمام و NCNDA =====
export async function approveInterest(interestId: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const locale = await getLocale();

  const interest = await prisma.interest.findUnique({
    where: { id: interestId },
    select: { id: true, status: true, opportunityId: true, investorId: true },
  });
  if (!interest) return { ok: false, error: t(locale, "err.requestNotFound") };
  if (interest.status !== "REQUESTED") {
    return { ok: false, error: t(locale, "err.cannotApproveState") };
  }

  await prisma.interest.update({
    where: { id: interestId },
    data: { status: "ADMIN_APPROVED" },
  });

  await logActivity({
    actorId: session.userId,
    action: "INTEREST_APPROVED",
    entityType: "Interest",
    entityId: interestId,
    details: { opportunityId: interest.opportunityId },
  });

  // إشعار المستثمر باعتماد طلبه
  await notify({
    userId: interest.investorId,
    type: "INTEREST_APPROVED",
    message: "اعتمدت الإدارة طلب اهتمامك. يمكنك الآن توقيع اتفاقية NCNDA.",
    link: `/investor/opportunities/${interest.opportunityId}`,
  });

  revalidatePath(`/admin/opportunities/${interest.opportunityId}`);
  revalidatePath("/admin/interests");
  revalidatePath("/admin");
  return { ok: true };
}

export async function declineInterest(interestId: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const locale = await getLocale();

  const interest = await prisma.interest.findUnique({
    where: { id: interestId },
    select: { id: true, status: true, opportunityId: true, investorId: true },
  });
  if (!interest) return { ok: false, error: t(locale, "err.requestNotFound") };
  if (interest.status === "NCNDA_SIGNED" || interest.status === "DECLINED") {
    return { ok: false, error: t(locale, "err.cannotDeclineState") };
  }

  await prisma.interest.update({
    where: { id: interestId },
    data: { status: "DECLINED" },
  });

  await logActivity({
    actorId: session.userId,
    action: "INTEREST_DECLINED",
    entityType: "Interest",
    entityId: interestId,
    details: { opportunityId: interest.opportunityId },
  });

  // إشعار المستثمر برفض طلبه
  await notify({
    userId: interest.investorId,
    type: "INTEREST_DECLINED",
    message: "لم يُعتمد طلب اهتمامك بهذه الفرصة.",
    link: `/investor/opportunities/${interest.opportunityId}`,
  });

  revalidatePath(`/admin/opportunities/${interest.opportunityId}`);
  revalidatePath("/admin/interests");
  revalidatePath("/admin");
  return { ok: true };
}

// ===== ملفات الفرصة (الإدارة) =====
export async function uploadFile(
  opportunityId: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const locale = await getLocale();
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

  revalidatePath(`/admin/opportunities/${opportunityId}`);
  return { ok: true };
}

export async function approveFile(
  fileId: string,
  approved: boolean
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const file = await prisma.opportunityFile.update({
    where: { id: fileId },
    data: { approved },
  });
  await logActivity({
    actorId: session.userId,
    action: "FILE_APPROVED",
    entityType: "Opportunity",
    entityId: file.opportunityId,
    details: { fileId, approved },
  });
  revalidatePath(`/admin/opportunities/${file.opportunityId}`);
  return { ok: true };
}

export async function setFileVisibility(
  fileId: string,
  visibility: FileVisibility
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const file = await prisma.opportunityFile.update({
    where: { id: fileId },
    data: { visibility },
  });
  await logActivity({
    actorId: session.userId,
    action: "FILE_VISIBILITY_CHANGED",
    entityType: "Opportunity",
    entityId: file.opportunityId,
    details: { fileId, visibility },
  });
  revalidatePath(`/admin/opportunities/${file.opportunityId}`);
  return { ok: true };
}

export async function deleteFile(fileId: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const locale = await getLocale();
  const file = await prisma.opportunityFile.findUnique({
    where: { id: fileId },
    select: { id: true, storageKey: true, opportunityId: true, fileName: true },
  });
  if (!file) return { ok: false, error: t(locale, "err.fileNotFound") };

  await removeFile(file.storageKey, file.id);
  await logActivity({
    actorId: session.userId,
    action: "FILE_DELETED",
    entityType: "Opportunity",
    entityId: file.opportunityId,
    details: { fileName: file.fileName },
  });
  revalidatePath(`/admin/opportunities/${file.opportunityId}`);
  return { ok: true };
}

export async function recordNcnda(interestId: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const locale = await getLocale();

  const interest = await prisma.interest.findUnique({
    where: { id: interestId },
    select: {
      id: true,
      status: true,
      opportunityId: true,
      investorId: true,
      investor: { select: { fullName: true } },
      opportunity: {
        select: { sector: true, investorVersion: true, publicVersion: true },
      },
    },
  });
  if (!interest) return { ok: false, error: t(locale, "err.requestNotFound") };
  if (interest.status !== "ADMIN_APPROVED") {
    return { ok: false, error: t(locale, "err.ncndaOnlyAfterApproval") };
  }

  // توليد نسخة الاتفاقية باسم المستثمر (توقيع مُسجَّل من الإدارة)
  const v =
    toVersion(interest.opportunity.investorVersion) ??
    toVersion(interest.opportunity.publicVersion);
  const ref = v?.displayTitle || `فرصة في قطاع ${interest.opportunity.sector}`;
  const signedAt = new Date();
  const signerName = interest.investor.fullName;
  const html = buildNcndaHtml({ signerName, opportunityRef: ref, signedAt });
  const docKey = `ncnda/${interestId}/${randomUUID()}.html`;
  await putObject(docKey, Buffer.from(html, "utf-8"), "text/html");

  await prisma.interest.update({
    where: { id: interestId },
    data: {
      status: "NCNDA_SIGNED",
      ncndaSignedAt: signedAt,
      ncndaSignerName: signerName,
      ncndaDocKey: docKey,
    },
  });

  await logActivity({
    actorId: session.userId,
    action: "NCNDA_RECORDED",
    entityType: "Interest",
    entityId: interestId,
    details: { opportunityId: interest.opportunityId },
  });

  // إشعار المستثمر بفتح التفاصيل الكاملة بعد تسجيل التوقيع
  await notify({
    userId: interest.investorId,
    type: "NCNDA_SIGNED",
    message: "تم تسجيل توقيعك على NCNDA. التفاصيل الكاملة متاحة الآن.",
    link: `/investor/opportunities/${interest.opportunityId}`,
  });

  revalidatePath(`/admin/opportunities/${interest.opportunityId}`);
  revalidatePath("/admin/interests");
  revalidatePath("/admin");
  return { ok: true };
}
