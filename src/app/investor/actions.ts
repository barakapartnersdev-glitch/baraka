"use server";
// إجراءات المستثمر — محمية بـ requireRole("INVESTOR") مع تحقق الحالة والملكية.
// لا تكشف هذه الإجراءات أي بيانات مصدر أو هوية.
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/audit";
import { notifyAdmins } from "@/lib/notify";
import { putObject } from "@/lib/storage";
import { buildNcndaHtml } from "@/lib/ncnda";
import { toVersion } from "@/lib/opportunity";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function requestInterest(
  opportunityId: string
): Promise<ActionResult> {
  const session = await requireRole("INVESTOR");
  const locale = await getLocale();

  // يجب أن يكون الحساب مفعّلاً (موثّقاً) لطلب الاهتمام
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { accountStatus: true },
  });
  if (!user || user.accountStatus !== "ACTIVE") {
    return { ok: false, error: t(locale, "err.accountPendingInterest") };
  }

  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { id: true, state: true },
  });
  if (!opp || opp.state !== "PUBLISHED") {
    return { ok: false, error: t(locale, "err.oppNotAvailable") };
  }

  const existing = await prisma.interest.findUnique({
    where: {
      opportunityId_investorId: {
        opportunityId,
        investorId: session.userId,
      },
    },
  });
  if (existing) {
    return { ok: false, error: t(locale, "err.interestExists") };
  }

  await prisma.interest.create({
    data: {
      opportunityId,
      investorId: session.userId,
      status: "REQUESTED",
    },
  });

  await logActivity({
    actorId: session.userId,
    action: "INTEREST_REQUESTED",
    entityType: "Opportunity",
    entityId: opportunityId,
  });

  // إشعار الإدارة بطلب جديد بانتظار الاعتماد
  await notifyAdmins({
    type: "INTEREST_REQUESTED",
    message: `طلب اهتمام جديد من ${session.fullName} بانتظار اعتمادك.`,
    link: "/admin/interests",
  });

  revalidatePath(`/investor/opportunities/${opportunityId}`);
  revalidatePath("/investor");
  revalidatePath("/admin/interests");
  revalidatePath("/admin");
  return { ok: true };
}

export async function signNcnda(
  interestId: string,
  signerName: string
): Promise<ActionResult> {
  const session = await requireRole("INVESTOR");
  const locale = await getLocale();

  const name = signerName.trim();
  if (name.length < 3) {
    return { ok: false, error: t(locale, "err.signNameRequired") };
  }

  const interest = await prisma.interest.findUnique({
    where: { id: interestId },
    select: {
      id: true,
      investorId: true,
      status: true,
      opportunityId: true,
      opportunity: {
        select: { sector: true, investorVersion: true, publicVersion: true },
      },
    },
  });
  // حارس الملكية: المستثمر يوقّع طلبه هو فقط
  if (!interest || interest.investorId !== session.userId) {
    return { ok: false, error: t(locale, "err.notAuthorized") };
  }
  if (interest.status !== "ADMIN_APPROVED") {
    return { ok: false, error: t(locale, "err.signBeforeApproval") };
  }

  // توليد نسخة الاتفاقية الموقّعة وتخزينها كأثر دائم
  const v =
    toVersion(interest.opportunity.investorVersion) ??
    toVersion(interest.opportunity.publicVersion);
  const ref = v?.displayTitle || `فرصة في قطاع ${interest.opportunity.sector}`;
  const signedAt = new Date();
  const html = buildNcndaHtml({ signerName: name, opportunityRef: ref, signedAt });
  const docKey = `ncnda/${interestId}/${randomUUID()}.html`;
  await putObject(docKey, Buffer.from(html, "utf-8"), "text/html");

  await prisma.interest.update({
    where: { id: interestId },
    data: {
      status: "NCNDA_SIGNED",
      ncndaSignedAt: signedAt,
      ncndaSignerName: name,
      ncndaDocKey: docKey,
    },
  });

  await logActivity({
    actorId: session.userId,
    action: "NCNDA_RECORDED",
    entityType: "Interest",
    entityId: interestId,
    details: { opportunityId: interest.opportunityId, by: "investor" },
  });

  // إشعار الإدارة بتوقيع NCNDA
  await notifyAdmins({
    type: "NCNDA_SIGNED",
    message: `وقّع ${session.fullName} اتفاقية NCNDA.`,
    link: "/admin/interests",
  });

  revalidatePath(`/investor/opportunities/${interest.opportunityId}`);
  revalidatePath("/investor");
  revalidatePath("/admin/interests");
  return { ok: true };
}
