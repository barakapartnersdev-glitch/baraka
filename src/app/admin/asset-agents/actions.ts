"use server";
// إجراءات الإدارة على طلبات «وكلاء أصحاب الأصول» — تغيير الحالة، الإسناد، الملاحظات.
// محميّة بدور ADMIN، وتُسجَّل في ActivityLog باسم المسؤول المنفّذ.
// ⚠️ يعتمد على نموذج AssetAgentApplication (انظر ASSET_OWNER_AGENTS_INTEGRATION.md).
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import type { Prisma, AssetAgentContractStatus, AssetSubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notify, notifyAdmins } from "@/lib/notify";
import { storeAgentUpload } from "@/lib/agent-files";
import { emailConfigured, sendEmail } from "@/lib/email";
import { getLocale } from "@/lib/i18n-server";
import { resetUi } from "@/lib/reset-i18n";
import { createPasswordResetToken, passwordResetUrl, resetEmailHtml } from "@/lib/password-reset";
import { esignConfigured, getEsignAdapter, getEsignProvider } from "@/lib/esign";
import { getObjectBuffer } from "@/lib/storage";
import { AGENT_STATUSES, AGENT_CONTRACT_STATUSES, SUBMISSION_STATUSES } from "@/lib/agent";

export interface ActionState {
  ok: boolean;
  error?: string;
}

function revalidate(id: string) {
  revalidatePath("/admin/asset-agents");
  revalidatePath(`/admin/asset-agents/${id}`);
}

async function logAgent(
  actorId: string,
  entityId: string,
  action: string,
  details?: Prisma.InputJsonValue
) {
  try {
    await prisma.activityLog.create({
      data: { actorId, action, entityType: "AssetAgentApplication", entityId, details },
    });
  } catch (e) {
    console.error("[asset-agents] تعذّر تسجيل النشاط:", e);
  }
}

export async function changeAgentStatus(
  id: string,
  status: string,
  rejectionReason?: string
): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  if (!(AGENT_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: "status" };
  }
  try {
    const before = await prisma.assetAgentApplication.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!before) return { ok: false, error: "not_found" };

    await prisma.assetAgentApplication.update({
      where: { id },
      data: {
        status: status as never,
        rejectionReason: status === "REJECTED" ? (rejectionReason?.trim() || null) : undefined,
        lastContactAt: new Date(),
      },
    });
    await logAgent(session.userId, id, "AGENT_STATUS_CHANGED", { from: before.status, to: status });
    revalidate(id);
    return { ok: true };
  } catch (e) {
    console.error("[asset-agents] تعذّر تغيير الحالة:", e);
    return { ok: false, error: "failed" };
  }
}

export async function assignAgentAdmin(id: string, adminId: string | null): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  try {
    if (adminId) {
      const admin = await prisma.user.findFirst({
        where: { id: adminId, role: "ADMIN" },
        select: { id: true },
      });
      if (!admin) return { ok: false, error: "not_admin" };
    }
    await prisma.assetAgentApplication.update({
      where: { id },
      data: { assignedToId: adminId },
    });
    await logAgent(session.userId, id, "AGENT_ASSIGNED", { assignedToId: adminId });
    revalidate(id);
    return { ok: true };
  } catch (e) {
    console.error("[asset-agents] تعذّر الإسناد:", e);
    return { ok: false, error: "failed" };
  }
}

export async function saveAgentNotes(id: string, notes: string): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  try {
    await prisma.assetAgentApplication.update({
      where: { id },
      data: { adminNotes: notes.trim() || null },
    });
    await logAgent(session.userId, id, "AGENT_NOTE_SAVED");
    revalidate(id);
    return { ok: true };
  } catch (e) {
    console.error("[asset-agents] تعذّر حفظ الملاحظات:", e);
    return { ok: false, error: "failed" };
  }
}

// ============================================================
// ===== المرحلة 2: العقد / الحساب / الأصول / المراسلات =====
// ============================================================

// بريد + رابط تعيين كلمة المرور لمستخدم وكيل (مشترك بين فتح الحساب وإعادة الإرسال).
// يعيد الرابط دائماً (ليتمكّن المسؤول من نسخه عند تعطّل البريد) + هل أُرسل بريد.
async function issueAgentPasswordLink(
  userId: string,
  passwordHash: string,
  email: string,
  fullName: string
): Promise<{ resetLink: string; emailSent: boolean }> {
  const token = await createPasswordResetToken(userId, passwordHash);
  const resetLink = await passwordResetUrl(token);
  let emailSent = false;
  if (emailConfigured()) {
    try {
      const locale = await getLocale();
      const rui = resetUi(locale);
      await sendEmail({
        to: email,
        subject: rui.emailSubject,
        html: resetEmailHtml(locale, fullName, rui.emailBody, resetLink, rui.emailCta),
      });
      emailSent = true;
    } catch (e) {
      console.error("[asset-agents] تعذّر إرسال بريد تعيين كلمة المرور:", e);
    }
  }
  return { resetLink, emailSent };
}

async function latestAgentContract(applicationId: string) {
  return prisma.assetAgentContract.findFirst({ where: { applicationId }, orderBy: { createdAt: "desc" } });
}

// --- العقد ---
export async function sendAgentContract(applicationId: string): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  const app = await prisma.assetAgentApplication.findUnique({
    where: { id: applicationId },
    select: { id: true, fullName: true, email: true },
  });
  if (!app) return { ok: false, error: "not_found" };
  const c = await latestAgentContract(applicationId);

  // إرسال عبر مزوّد التوقيع الإلكتروني (Zoho Sign) إن كان مهيّأً ووُجد ملف العقد المرفوع.
  // غير ذلك يبقى المسار اليدوي كما هو (رفع نسخة موقّعة لاحقاً).
  let externalId: string | null = null;
  let signingProvider: string | null = null;
  if (esignConfigured() && c?.contractPdfKey) {
    try {
      const { buffer } = await getObjectBuffer(c.contractPdfKey);
      const r = await getEsignAdapter().send({
        contractId: c.id,
        signerName: app.fullName,
        signerEmail: app.email,
        documentName: `عقد وكالة - ${app.fullName}`,
        documentBase64: buffer.toString("base64"),
        fileName: "agency-contract.pdf",
      });
      if (r.ok && r.externalId) {
        externalId = r.externalId;
        signingProvider = getEsignProvider();
      } else {
        console.error("[asset-agents] فشل إرسال العقد عبر التوقيع الإلكتروني:", r.error);
      }
    } catch (e) {
      console.error("[asset-agents] خطأ في إرسال العقد عبر التوقيع الإلكتروني:", e);
    }
  }

  if (c) {
    await prisma.assetAgentContract.update({
      where: { id: c.id },
      data: {
        status: "SENT",
        sentAt: c.sentAt ?? new Date(),
        ...(externalId ? { externalSignatureId: externalId, signingProvider } : {}),
      },
    });
  } else {
    await prisma.assetAgentContract.create({ data: { applicationId, status: "SENT", sentAt: new Date() } });
  }
  await prisma.assetAgentApplication.update({ where: { id: applicationId }, data: { status: "AWAITING_CONTRACT", lastContactAt: new Date() } });
  await logAgent(session.userId, applicationId, "AGENT_CONTRACT_SENT", { esign: !!externalId });
  revalidate(applicationId);
  return { ok: true };
}

export async function setAgentContractStatus(applicationId: string, status: string): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  if (!(AGENT_CONTRACT_STATUSES as readonly string[]).includes(status)) return { ok: false, error: "status" };
  const c = await latestAgentContract(applicationId);
  if (!c) await prisma.assetAgentContract.create({ data: { applicationId, status: status as AssetAgentContractStatus } });
  else
    await prisma.assetAgentContract.update({
      where: { id: c.id },
      data: { status: status as AssetAgentContractStatus, signedAt: status === "SIGNED" ? c.signedAt ?? new Date() : c.signedAt },
    });
  await logAgent(session.userId, applicationId, "AGENT_CONTRACT_STATUS", { to: status });
  revalidate(applicationId);
  return { ok: true };
}

export async function uploadAgentSignedContract(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  const applicationId = String(formData.get("applicationId") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "no_file" };
  const app = await prisma.assetAgentApplication.findUnique({ where: { id: applicationId }, select: { id: true } });
  if (!app) return { ok: false, error: "not_found" };
  const res = await storeAgentUpload(file, { applicationId, category: "contract_signed" });
  if (!res.ok) return { ok: false, error: "upload" };
  const c = await latestAgentContract(applicationId);
  if (c) await prisma.assetAgentContract.update({ where: { id: c.id }, data: { status: "SIGNED", signedAt: new Date(), signedPdfKey: res.storageKey } });
  else await prisma.assetAgentContract.create({ data: { applicationId, status: "SIGNED", signedAt: new Date(), signedPdfKey: res.storageKey } });
  await prisma.assetAgentApplication.update({ where: { id: applicationId }, data: { status: "CONTRACTED" } });
  await logAgent(session.userId, applicationId, "AGENT_CONTRACT_SIGNED");
  revalidate(applicationId);
  return { ok: true };
}

// --- الحساب ---
export interface CreateAgentAccountState {
  ok: boolean;
  error?: string;
  email?: string;
  resetLink?: string;
  emailSent?: boolean;
}

export async function createAgentAccount(applicationId: string): Promise<CreateAgentAccountState> {
  const session = await requireRole("ADMIN");
  const app = await prisma.assetAgentApplication.findUnique({ where: { id: applicationId }, include: { account: true } });
  if (!app) return { ok: false, error: "not_found" };
  if (app.account || app.userId) return { ok: false, error: "exists" };
  if (app.status !== "CONTRACTED") return { ok: false, error: "need_contracted" };
  const existing = await prisma.user.findUnique({ where: { email: app.email }, select: { id: true } });
  if (existing) return { ok: false, error: "email_taken" };

  // كلمة مرور أولية عشوائية غير قابلة للتخمين — لا تُعرض؛ يعيّن الوكيل كلمته عبر الرابط.
  const passwordHash = await bcrypt.hash(randomBytes(24).toString("hex"), 10);
  const user = await prisma.user.create({
    data: { email: app.email, fullName: app.fullName, phone: app.phone, role: "ASSET_OWNER_AGENT", accountStatus: "ACTIVE", passwordHash },
    select: { id: true },
  });
  await prisma.assetAgentApplication.update({ where: { id: applicationId }, data: { userId: user.id, status: "ACTIVE" } });
  await prisma.assetAgentAccount.create({
    data: { userId: user.id, applicationId: app.id, status: "active", startDate: new Date(), assignedManagerId: app.assignedToId },
  });
  await logAgent(session.userId, applicationId, "AGENT_ACCOUNT_CREATED", { userId: user.id });

  // رابط تعيين كلمة المرور (يحلّ محلّ كلمة المرور المؤقتة)
  const { resetLink, emailSent } = await issueAgentPasswordLink(user.id, passwordHash, app.email, app.fullName);

  await notify({
    userId: user.id,
    type: "ASSET_AGENT_ACCOUNT_CREATED",
    message: "تم فتح حساب وكيل أصحاب الأصول الخاص بك. عيّن كلمة مرورك عبر الرابط المُرسَل ثم سجّل الدخول.",
    link: "/agent",
  });
  revalidate(applicationId);
  return { ok: true, email: app.email, resetLink, emailSent };
}

// إعادة إرسال رابط تعيين/إعادة كلمة المرور لحساب وكيل قائم.
export interface AgentResetLinkState {
  ok: boolean;
  error?: string;
  resetLink?: string;
  emailSent?: boolean;
}

export async function sendAgentPasswordResetLink(applicationId: string): Promise<AgentResetLinkState> {
  const session = await requireRole("ADMIN");
  const app = await prisma.assetAgentApplication.findUnique({
    where: { id: applicationId },
    select: { userId: true, email: true, fullName: true, user: { select: { passwordHash: true } } },
  });
  if (!app?.userId || !app.user) return { ok: false, error: "no_account" };
  const { resetLink, emailSent } = await issueAgentPasswordLink(app.userId, app.user.passwordHash, app.email, app.fullName);
  await logAgent(session.userId, applicationId, "AGENT_RESET_LINK_SENT", { emailSent });
  return { ok: true, resetLink, emailSent };
}

export async function suspendAgentAccount(applicationId: string, suspend: boolean): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  const app = await prisma.assetAgentApplication.findUnique({
    where: { id: applicationId },
    select: { account: { select: { id: true } } },
  });
  if (!app?.account) return { ok: false, error: "no_account" };
  await prisma.assetAgentAccount.update({ where: { id: app.account.id }, data: { status: suspend ? "suspended" : "active" } });
  await prisma.assetAgentApplication.update({ where: { id: applicationId }, data: { status: suspend ? "SUSPENDED" : "ACTIVE" } });
  await logAgent(session.userId, applicationId, suspend ? "AGENT_SUSPENDED" : "AGENT_REACTIVATED");
  revalidate(applicationId);
  return { ok: true };
}

// --- الأصول المقدّمة ---
function revalidateAssets(id: string) {
  revalidatePath("/admin/asset-agents/assets");
  revalidatePath(`/admin/asset-agents/assets/${id}`);
}

async function logAsset(actorId: string, entityId: string, action: string, details?: Prisma.InputJsonValue) {
  try {
    await prisma.activityLog.create({ data: { actorId, action, entityType: "AssetAgentSubmittedAsset", entityId, details } });
  } catch (e) {
    console.error("[asset-agents] تعذّر تسجيل نشاط الأصل:", e);
  }
}

export async function setSubmittedAssetStatus(id: string, status: string, rejectionReason?: string): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  if (!(SUBMISSION_STATUSES as readonly string[]).includes(status)) return { ok: false, error: "status" };
  const a = await prisma.assetAgentSubmittedAsset.findUnique({ where: { id }, select: { status: true, agentUserId: true } });
  if (!a) return { ok: false, error: "not_found" };
  await prisma.assetAgentSubmittedAsset.update({
    where: { id },
    data: { status: status as AssetSubmissionStatus, rejectionReason: status === "REJECTED" ? rejectionReason?.trim() || null : undefined },
  });
  await logAsset(session.userId, id, "ASSET_STATUS_CHANGED", { from: a.status, to: status });
  await notify({ userId: a.agentUserId, type: "ASSET_AGENT_ASSET_STATUS_CHANGED", message: "تم تحديث حالة أحد أصولك المقدّمة.", link: "/agent/assets" });
  revalidateAssets(id);
  return { ok: true };
}

export async function assignSubmittedAsset(id: string, adminId: string | null): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  if (adminId) {
    const u = await prisma.user.findFirst({ where: { id: adminId, role: "ADMIN" }, select: { id: true } });
    if (!u) return { ok: false, error: "not_admin" };
  }
  await prisma.assetAgentSubmittedAsset.update({ where: { id }, data: { assignedToId: adminId } });
  await logAsset(session.userId, id, "ASSET_ASSIGNED", { assignedToId: adminId });
  revalidateAssets(id);
  return { ok: true };
}

export async function saveSubmittedAssetNotes(id: string, notes: string): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  await prisma.assetAgentSubmittedAsset.update({ where: { id }, data: { adminNotes: notes.trim() || null } });
  await logAsset(session.userId, id, "ASSET_NOTE_SAVED");
  revalidateAssets(id);
  return { ok: true };
}

// تحويل أصل معتمد إلى فرصة استثمارية (مالك الفرصة = مستخدم الوكيل + sourceData)
export async function convertAssetToOpportunity(submittedAssetId: string): Promise<ActionState> {
  const session = await requireRole("ADMIN");
  const a = await prisma.assetAgentSubmittedAsset.findUnique({
    where: { id: submittedAssetId },
    include: { agentUser: { select: { id: true, fullName: true } } },
  });
  if (!a) return { ok: false, error: "not_found" };
  if (a.convertedOpportunityId) return { ok: false, error: "already" };
  if (a.status !== "APPROVED") return { ok: false, error: "need_approved" };

  const sourceData: Prisma.InputJsonValue = {
    source: "asset_owner_agent",
    agentId: a.agentUserId,
    agentName: a.agentUser?.fullName ?? null,
    submittedAssetId: a.id,
    assetStatus: a.assetStatus ?? null,
    offerType: a.offerType ?? null,
    estimatedValue: a.estimatedValue ?? null,
    requiredFinancing: a.requiredFinancing ?? null,
    relationshipToOwner: a.agentRelationshipToOwner ?? null,
    hasOwnerPermission: a.hasOwnerPermission ?? null,
    description: a.shortDescription ?? null,
    notes: a.additionalNotes ?? null,
  };

  const opp = await prisma.opportunity.create({
    data: {
      title: a.title,
      sector: a.assetType ?? "other",
      country: a.country ?? "—",
      state: "DRAFT_SOURCE",
      ownerId: a.agentUserId,
      sourceData,
    },
    select: { id: true },
  });
  await prisma.assetAgentSubmittedAsset.update({ where: { id: submittedAssetId }, data: { status: "CONVERTED", convertedOpportunityId: opp.id } });
  await logAsset(session.userId, submittedAssetId, "ASSET_CONVERTED", { opportunityId: opp.id });
  await notify({ userId: a.agentUserId, type: "ASSET_AGENT_ASSET_STATUS_CHANGED", message: "تم تحويل أحد أصولك إلى فرصة استثمارية قيد الإعداد.", link: "/agent/assets" });
  revalidateAssets(submittedAssetId);
  return { ok: true };
}

// --- المراسلات (رد الإدارة) ---
export interface AgentMsgState {
  ok?: boolean;
  error?: string;
}

export async function adminReplyAgentMessage(_prev: AgentMsgState, formData: FormData): Promise<AgentMsgState> {
  const session = await requireRole("ADMIN");
  const messageId = String(formData.get("messageId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return { error: "empty" };
  const msg = await prisma.assetAgentMessage.findUnique({ where: { id: messageId }, select: { id: true, agentUserId: true } });
  if (!msg) return { error: "not_found" };
  await prisma.assetAgentMessageReply.create({ data: { messageId, senderUserId: session.userId, senderRole: "admin", body } });
  await prisma.assetAgentMessage.update({ where: { id: messageId }, data: { status: "REPLIED" } });
  if (msg.agentUserId)
    await notify({ userId: msg.agentUserId, type: "ASSET_AGENT_NEW_MESSAGE", message: "رد جديد من الإدارة على رسالتك.", link: `/agent/messages/${messageId}` });
  revalidatePath(`/admin/asset-agents/messages/${messageId}`);
  return { ok: true };
}
