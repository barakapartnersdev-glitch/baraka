"use server";
// إجراءات إدارة طلبات سفراء الاستثمار — الحالة، التقييم، الإسناد، الملاحظات الداخلية.
// محميّة بدور ADMIN وتُسجَّل في AmbassadorActivityLog.
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import type { AmbassadorAppStatus, ReferralStatus, AmbassadorContractStatus, AdminRole } from "@prisma/client";
import { ADMIN_ROLES } from "@/lib/admin-roles";
import { prisma } from "@/lib/prisma";
import { requireActionCapability } from "@/lib/admin-guard";
import { notify } from "@/lib/notify";
import { ALL_AMB_STATUSES, ALL_REFERRAL_STATUSES, ALL_CONTRACT_STATUSES, asStringArray } from "@/lib/ambassador-form";
import { computeAmbassadorScore } from "@/lib/ambassador-score";
import { storeAmbassadorUpload } from "@/lib/ambassador-files";
import { sendAmbassadorTemplateEmail } from "@/lib/ambassador-email";
import { getEsignAdapter } from "@/lib/esign";
import { LOCALES, type Locale } from "@/lib/i18n";

// خريطة حالة الطلب → مفتاح قالب البريد المرسَل للمتقدّم
const STATUS_EMAIL: Record<string, string> = {
  NEEDS_INFO: "amb_needs_info",
  INTERVIEW: "amb_interview",
  PRE_ACCEPTED: "amb_pre_accepted",
  REJECTED: "amb_rejected",
  NOT_QUALIFIED: "amb_rejected",
};

function appBaseUrl(): string {
  return (process.env.APP_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}

async function logAmb(
  applicationId: string,
  actorId: string,
  actionType: string,
  extra?: { oldValue?: string | null; newValue?: string | null; description?: string }
): Promise<void> {
  try {
    await prisma.ambassadorActivityLog.create({
      data: {
        relatedEntityType: "Application",
        relatedEntityId: applicationId,
        actionType,
        oldValue: extra?.oldValue ?? null,
        newValue: extra?.newValue ?? null,
        description: extra?.description ?? null,
        createdById: actorId,
      },
    });
  } catch (e) {
    console.error("[ambassadors] تعذّر تسجيل النشاط:", e);
  }
}

function refresh(id: string) {
  revalidatePath("/admin/ambassadors");
  revalidatePath(`/admin/ambassadors/${id}`);
}

export async function setAmbassadorStatus(id: string, status: string): Promise<ActionResult> {
  const guard = await requireActionCapability("review");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  if (!ALL_AMB_STATUSES.includes(status as AmbassadorAppStatus)) {
    return { ok: false, error: "حالة غير صالحة." };
  }
  const app = await prisma.ambassadorApplication.findUnique({
    where: { id },
    select: { status: true, email: true, fullName: true, languageCode: true },
  });
  if (!app) return { ok: false, error: "الطلب غير موجود." };
  if (app.status === status) return { ok: true };

  await prisma.ambassadorApplication.update({
    where: { id },
    data: { status: status as AmbassadorAppStatus },
  });
  await logAmb(id, session.userId, "status_change", { oldValue: app.status, newValue: status });

  // بريد للمتقدّم بلغته عند الحالات التي تستدعي تواصلاً
  const tplKey = STATUS_EMAIL[status];
  if (tplKey) {
    await sendAmbassadorTemplateEmail({
      templateKey: tplKey,
      locale: app.languageCode as Locale,
      to: app.email,
      vars: { fullName: app.fullName },
    });
  }
  refresh(id);
  return { ok: true };
}

export async function setAmbassadorScore(id: string, score: number): Promise<ActionResult> {
  const guard = await requireActionCapability("review");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  const clamped = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const app = await prisma.ambassadorApplication.findUnique({
    where: { id },
    select: { score: true },
  });
  if (!app) return { ok: false, error: "الطلب غير موجود." };
  if (app.score === clamped) return { ok: true };

  await prisma.ambassadorApplication.update({ where: { id }, data: { score: clamped } });
  await logAmb(id, session.userId, "score_change", {
    oldValue: String(app.score),
    newValue: String(clamped),
  });
  refresh(id);
  return { ok: true };
}

// حساب التقييم تلقائياً وفق المعايير (قابل للتعديل اليدوي بعده)
export async function recomputeAmbassadorScore(id: string): Promise<ActionResult> {
  const guard = await requireActionCapability("review");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  const app = await prisma.ambassadorApplication.findUnique({
    where: { id },
    select: {
      yearsOfExperience: true,
      experienceSummary: true,
      linkedinUrl: true,
      relationshipType: true,
      coveredCountries: true,
      coveredSectors: true,
      investorTypes: true,
      investmentRange: true,
      motivation: true,
      addedValue: true,
      score: true,
    },
  });
  if (!app) return { ok: false, error: "الطلب غير موجود." };

  const hasProfile =
    (await prisma.ambassadorFile.count({
      where: { applicationId: id, fileCategory: { in: ["cv", "personal_profile", "company_profile"] } },
    })) > 0;

  const newScore = computeAmbassadorScore(app, hasProfile);
  await prisma.ambassadorApplication.update({ where: { id }, data: { score: newScore } });
  await logAmb(id, session.userId, "score_auto", {
    oldValue: String(app.score),
    newValue: String(newScore),
  });
  refresh(id);
  return { ok: true };
}

export async function assignAmbassador(id: string, assigneeId: string | null): Promise<ActionResult> {
  const guard = await requireActionCapability("review");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  const app = await prisma.ambassadorApplication.findUnique({
    where: { id },
    select: { assignedToId: true },
  });
  if (!app) return { ok: false, error: "الطلب غير موجود." };

  let valid: string | null = null;
  if (assigneeId) {
    const u = await prisma.user.findFirst({
      where: { id: assigneeId, role: "ADMIN" },
      select: { id: true },
    });
    if (!u) return { ok: false, error: "الموظف غير موجود." };
    valid = u.id;
  }

  await prisma.ambassadorApplication.update({ where: { id }, data: { assignedToId: valid } });
  await logAmb(id, session.userId, valid ? "assigned" : "unassigned", { newValue: valid });

  if (valid && valid !== app.assignedToId && valid !== session.userId) {
    await notify({
      userId: valid,
      type: "CRM_LEAD_ASSIGNED",
      message: "أُسند إليك طلب سفير استثمار للمراجعة.",
      link: `/admin/ambassadors/${id}`,
    });
  }
  refresh(id);
  return { ok: true };
}

export async function addAmbassadorNote(id: string, note: string): Promise<ActionResult> {
  const guard = await requireActionCapability("review");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  const text = note.trim();
  if (text.length < 2) return { ok: false, error: "اكتب نص الملاحظة." };

  const app = await prisma.ambassadorApplication.findUnique({ where: { id }, select: { id: true } });
  if (!app) return { ok: false, error: "الطلب غير موجود." };

  await logAmb(id, session.userId, "note", { description: text });
  refresh(id);
  return { ok: true };
}

export interface CreateAccountResult {
  ok: boolean;
  error?: string;
  tempPassword?: string;
  email?: string;
}

// كلمة مرور مؤقتة سهلة النقل (12 محرفاً)
function tempPassword(): string {
  return randomBytes(9).toString("base64").replace(/[+/=]/g, "").slice(0, 12) + "9a";
}

// فتح حساب سفير بعد القبول/توقيع العقد: مستخدم AMBASSADOR + AmbassadorAccount.
export async function createAmbassadorAccount(applicationId: string): Promise<CreateAccountResult> {
  const guard = await requireActionCapability("account");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  const app = await prisma.ambassadorApplication.findUnique({
    where: { id: applicationId },
    include: { account: true },
  });
  if (!app) return { ok: false, error: "الطلب غير موجود." };
  if (app.account) return { ok: false, error: "تم فتح حساب لهذا السفير مسبقاً." };

  const existing = await prisma.user.findUnique({ where: { email: app.email }, select: { id: true } });
  if (existing) return { ok: false, error: "البريد مستخدم بحساب آخر على المنصة." };

  const password = tempPassword();
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: app.email,
      fullName: app.fullName,
      phone: app.phone,
      role: "AMBASSADOR",
      accountStatus: "ACTIVE",
      passwordHash,
    },
    select: { id: true },
  });

  await prisma.ambassadorAccount.create({
    data: {
      userId: user.id,
      applicationId: app.id,
      status: "active",
      startDate: new Date(),
      allowedCountries: asStringArray(app.coveredCountries),
      allowedSectors: asStringArray(app.coveredSectors),
      assignedManagerId: app.assignedToId,
    },
  });

  await prisma.ambassadorApplication.update({
    where: { id: applicationId },
    data: { status: "ACCOUNT_CREATED" },
  });
  await logAmb(applicationId, session.userId, "account_created", { description: user.id });

  await notify({
    userId: user.id,
    type: "AMBASSADOR_ACCOUNT_CREATED",
    message: "تم فتح حساب سفير الاستثمار الخاص بك. يمكنك تسجيل الدخول الآن.",
    link: "/ambassador",
  });
  await sendAmbassadorTemplateEmail({
    templateKey: "amb_account_opened",
    locale: app.languageCode as Locale,
    to: app.email,
    vars: { fullName: app.fullName, loginUrl: `${appBaseUrl()}/login` },
  });

  refresh(applicationId);
  return { ok: true, tempPassword: password, email: app.email };
}

// تغيير حالة ترشيح مستثمر (الإدارة) + إشعار السفير
export async function setReferralStatus(referralId: string, status: string): Promise<ActionResult> {
  const guard = await requireActionCapability("referrals");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  if (!ALL_REFERRAL_STATUSES.includes(status as ReferralStatus)) {
    return { ok: false, error: "حالة غير صالحة." };
  }
  const ref = await prisma.ambassadorReferral.findUnique({
    where: { id: referralId },
    select: { status: true, ambassadorUserId: true },
  });
  if (!ref) return { ok: false, error: "الترشيح غير موجود." };
  if (ref.status === status) return { ok: true };

  await prisma.ambassadorReferral.update({
    where: { id: referralId },
    data: { status: status as ReferralStatus },
  });
  try {
    await prisma.ambassadorActivityLog.create({
      data: {
        ambassadorUserId: ref.ambassadorUserId,
        relatedEntityType: "Referral",
        relatedEntityId: referralId,
        actionType: "status_change",
        oldValue: ref.status,
        newValue: status,
        createdById: session.userId,
      },
    });
  } catch {}
  await notify({
    userId: ref.ambassadorUserId,
    type: "AMBASSADOR_REFERRAL_STATUS_CHANGED",
    message: "تم تحديث حالة أحد ترشيحاتك.",
    link: "/ambassador/referrals",
  });
  revalidatePath("/admin/ambassadors/referrals");
  return { ok: true };
}

// إحالة ترشيح جاد إلى مسار علاقات المستثمرين في الـ CRM
export async function promoteReferralToCrm(referralId: string): Promise<ActionResult> {
  const guard = await requireActionCapability("referrals");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  const ref = await prisma.ambassadorReferral.findUnique({
    where: { id: referralId },
    select: { crmLeadId: true, ambassadorUserId: true, status: true },
  });
  if (!ref) return { ok: false, error: "الترشيح غير موجود." };
  if (!ref.crmLeadId) return { ok: false, error: "لا يوجد سجل CRM مرتبط (يلزم بريد المستثمر)." };

  await prisma.crmLead.update({
    where: { id: ref.crmLeadId },
    data: { department: "investor_relations", priority: "HIGH", status: "QUALIFIED" },
  });
  if (["NEW", "UNDER_REVIEW", "NEEDS_INFO"].includes(ref.status)) {
    await prisma.ambassadorReferral.update({ where: { id: referralId }, data: { status: "PRE_QUALIFIED" } });
  }
  await prisma.ambassadorActivityLog.create({
    data: {
      ambassadorUserId: ref.ambassadorUserId,
      relatedEntityType: "Referral",
      relatedEntityId: referralId,
      actionType: "promoted_to_crm",
      createdById: session.userId,
    },
  });
  revalidatePath("/admin/ambassadors/referrals");
  return { ok: true };
}

// حفظ/تحرير قالب بريد سفير (يتجاوز القالب المدمج)
export async function saveAmbassadorTemplate(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const guard = await requireActionCapability("templates");
  if (!guard.ok) return { ok: false, error: guard.error };
  const templateKey = String(formData.get("templateKey") ?? "");
  const lang = String(formData.get("lang") ?? "");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!templateKey || !LOCALES.includes(lang as Locale)) return { ok: false, error: "بيانات غير صالحة." };
  if (subject.length < 2 || body.length < 2) return { ok: false, error: "أكمل الموضوع والنص." };

  await prisma.crmEmailTemplate.upsert({
    where: { templateKey_languageCode: { templateKey, languageCode: lang } },
    update: { subject, body, isActive: true },
    create: { templateKey, templateType: "ambassador", languageCode: lang, subject, body, isActive: true },
  });
  revalidatePath("/admin/ambassadors/templates");
  return { ok: true };
}

// تعيين الدور الفرعي لموظف إدارة (SUPER_ADMIN فقط)
export async function setAdminRole(userId: string, role: string): Promise<ActionResult> {
  const guard = await requireActionCapability("staff");
  if (!guard.ok) return { ok: false, error: guard.error };
  if (!ADMIN_ROLES.includes(role as AdminRole)) return { ok: false, error: "دور غير صالح." };
  // منع المستخدم من سحب صلاحياته العليا عن نفسه (تفادي قفل الإدارة)
  if (userId === guard.session!.userId && role !== "SUPER_ADMIN") {
    return { ok: false, error: "لا يمكنك تغيير دورك العالي بنفسك." };
  }
  const u = await prisma.user.findFirst({ where: { id: userId, role: "ADMIN" }, select: { id: true } });
  if (!u) return { ok: false, error: "المستخدم غير موجود." };

  await prisma.user.update({ where: { id: userId }, data: { adminRole: role as AdminRole } });
  revalidatePath("/admin/ambassadors/staff");
  return { ok: true };
}

export interface MsgActionState {
  ok?: boolean;
  error?: string;
}

// رد الإدارة على رسالة سفير + إشعار السفير
export async function adminReplyMessage(_prev: MsgActionState, formData: FormData): Promise<MsgActionState> {
  const guard = await requireActionCapability("messages");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  const messageId = String(formData.get("messageId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return { error: "اكتب نص الرد." };

  const msg = await prisma.ambassadorMessage.findUnique({
    where: { id: messageId },
    select: { id: true, ambassadorUserId: true },
  });
  if (!msg) return { error: "الرسالة غير موجودة." };

  await prisma.ambassadorMessageReply.create({
    data: { messageId, senderUserId: session.userId, senderRole: "admin", body },
  });
  await prisma.ambassadorMessage.update({ where: { id: messageId }, data: { status: "REPLIED" } });
  await notify({
    userId: msg.ambassadorUserId,
    type: "AMBASSADOR_NEW_MESSAGE",
    message: "رد جديد من الإدارة على رسالتك.",
    link: `/ambassador/messages/${messageId}`,
  });
  revalidatePath(`/admin/ambassadors/messages/${messageId}`);
  return { ok: true };
}

// ===== العقود =====

async function latestContract(applicationId: string) {
  return prisma.ambassadorContract.findFirst({
    where: { applicationId },
    orderBy: { createdAt: "desc" },
  });
}

// تسجيل إرسال العقد (يُرسل خارج النظام في المرحلة الحالية)
export async function markContractSent(applicationId: string): Promise<ActionResult> {
  const guard = await requireActionCapability("contract");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  const app = await prisma.ambassadorApplication.findUnique({
    where: { id: applicationId },
    select: { email: true, fullName: true, languageCode: true },
  });
  if (!app) return { ok: false, error: "الطلب غير موجود." };

  const c = await latestContract(applicationId);
  if (c) {
    await prisma.ambassadorContract.update({
      where: { id: c.id },
      data: { status: "SENT", sentAt: c.sentAt ?? new Date() },
    });
  } else {
    await prisma.ambassadorContract.create({ data: { applicationId, status: "SENT", sentAt: new Date() } });
  }
  await logAmb(applicationId, session.userId, "contract_sent");
  await sendAmbassadorTemplateEmail({
    templateKey: "amb_contract_sent",
    locale: app.languageCode as Locale,
    to: app.email,
    vars: { fullName: app.fullName },
  });
  refresh(applicationId);
  return { ok: true };
}

// تغيير حالة العقد يدوياً
export async function setContractStatus(applicationId: string, status: string): Promise<ActionResult> {
  const guard = await requireActionCapability("contract");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  if (!ALL_CONTRACT_STATUSES.includes(status as AmbassadorContractStatus)) {
    return { ok: false, error: "حالة غير صالحة." };
  }
  const c = await latestContract(applicationId);
  if (!c) {
    await prisma.ambassadorContract.create({ data: { applicationId, status: status as AmbassadorContractStatus } });
  } else {
    await prisma.ambassadorContract.update({
      where: { id: c.id },
      data: {
        status: status as AmbassadorContractStatus,
        signedAt: status === "SIGNED" ? c.signedAt ?? new Date() : c.signedAt,
      },
    });
  }
  await logAmb(applicationId, session.userId, "contract_status", { newValue: status });
  refresh(applicationId);
  return { ok: true };
}

// رفع نسخة العقد الموقّعة → الحالة SIGNED + حالة الطلب CONTRACT_SIGNED
export async function uploadSignedContract(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const guard = await requireActionCapability("contract");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  const applicationId = String(formData.get("applicationId") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "اختر ملفاً." };

  const app = await prisma.ambassadorApplication.findUnique({ where: { id: applicationId }, select: { id: true } });
  if (!app) return { ok: false, error: "الطلب غير موجود." };

  const res = await storeAmbassadorUpload(file, {
    applicationId,
    category: "contract_signed",
    uploadedById: session.userId,
  });
  if (!res.ok) return { ok: false, error: "تعذّر رفع الملف." };

  const c = await latestContract(applicationId);
  if (c) {
    await prisma.ambassadorContract.update({
      where: { id: c.id },
      data: { status: "SIGNED", signedAt: new Date(), signedPdfKey: res.storageKey },
    });
  } else {
    await prisma.ambassadorContract.create({
      data: { applicationId, status: "SIGNED", signedAt: new Date(), signedPdfKey: res.storageKey },
    });
  }
  await prisma.ambassadorApplication.update({ where: { id: applicationId }, data: { status: "CONTRACT_SIGNED" } });
  await logAmb(applicationId, session.userId, "contract_signed_uploaded");
  refresh(applicationId);
  return { ok: true };
}

// إرسال العقد للتوقيع الإلكتروني عبر طبقة esign (الوضع اليدوي يضبط الحالة AWAITING_SIGNATURE فقط)
export async function sendContractForSignature(applicationId: string): Promise<ActionResult> {
  const guard = await requireActionCapability("contract");
  if (!guard.ok) return { ok: false, error: guard.error };
  const session = guard.session!;
  const app = await prisma.ambassadorApplication.findUnique({
    where: { id: applicationId },
    select: { email: true, fullName: true, languageCode: true },
  });
  if (!app) return { ok: false, error: "الطلب غير موجود." };

  let c = await latestContract(applicationId);
  if (!c) c = await prisma.ambassadorContract.create({ data: { applicationId, status: "NOT_SENT" } });

  const adapter = getEsignAdapter();
  const res = await adapter.send({
    contractId: c.id,
    signerName: app.fullName,
    signerEmail: app.email,
    documentName: "Ambassador Cooperation Contract",
  });
  if (!res.ok) return { ok: false, error: res.error ?? "تعذّر الإرسال للتوقيع." };

  await prisma.ambassadorContract.update({
    where: { id: c.id },
    data: {
      status: "AWAITING_SIGNATURE",
      sentAt: c.sentAt ?? new Date(),
      signingProvider: adapter.provider,
      externalSignatureId: res.externalId,
    },
  });
  await logAmb(applicationId, session.userId, "contract_esign_sent", { newValue: adapter.provider });
  await sendAmbassadorTemplateEmail({
    templateKey: "amb_contract_sent",
    locale: app.languageCode as Locale,
    to: app.email,
    vars: { fullName: app.fullName },
  });
  refresh(applicationId);
  return { ok: true };
}
