"use server";
// إجراءات مركز المراسلة الداخلي (الإدارة) — إنشاء محادثة، الرد، تغيير الحالة، حفظ القوالب.
// محميّة بقدرتي messages/templates عبر requireActionCapability.
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { InternalThreadStatus } from "@prisma/client";
import { requireActionCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { LOCALES, type Locale } from "@/lib/i18n";
import { normalizeCategory, isRecipientRole } from "@/lib/internal-msg";
import { deliverToRecipient } from "@/lib/internal-msg-server";

export interface ActionState {
  ok?: boolean;
  error?: string;
}

function truthy(v: FormDataEntryValue | null): boolean {
  return ["on", "1", "true", "yes"].includes(String(v ?? ""));
}

// إنشاء محادثة جديدة من الإدارة إلى مستلم (أيّ من الأدوار الأربعة) + تسليم.
export async function createThread(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const guard = await requireActionCapability("messages");
  if (!guard.ok) return { error: guard.error };
  const session = guard.session!;

  const recipientUserId = String(formData.get("recipientUserId") ?? "");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const category = normalizeCategory(String(formData.get("category") ?? "general"));
  const langRaw = String(formData.get("languageCode") ?? "ar");
  const languageCode: Locale = LOCALES.includes(langRaw as Locale) ? (langRaw as Locale) : "ar";
  const emailCopy = truthy(formData.get("emailCopy"));

  if (!recipientUserId || subject.length < 2 || body.length < 2) {
    return { error: "اختر المستلم وأكمل الموضوع والنص." };
  }

  const recipient = await prisma.user.findUnique({ where: { id: recipientUserId }, select: { id: true, role: true } });
  if (!recipient || !isRecipientRole(recipient.role)) return { error: "المستلم غير صالح." };

  const thread = await prisma.internalThread.create({
    data: {
      recipientUserId: recipient.id,
      recipientRole: recipient.role,
      subject,
      category,
      languageCode,
      status: "OPEN",
      createdById: session.userId,
      lastMessageAt: new Date(),
      recipientUnread: true,
      adminUnread: false,
      messages: { create: { senderUserId: session.userId, senderRole: "admin", body } },
    },
    select: { id: true, messages: { select: { id: true } } },
  });

  const { emailed } = await deliverToRecipient({
    recipientUserId: recipient.id,
    recipientRole: recipient.role,
    threadId: thread.id,
    locale: languageCode,
    subject,
    body,
    emailCopy,
  });
  if (emailed) {
    await prisma.internalThread.update({ where: { id: thread.id }, data: { emailCopySent: true } });
    const msgId = thread.messages[0]?.id;
    if (msgId) await prisma.internalMessage.update({ where: { id: msgId }, data: { emailedAt: new Date() } });
  }

  redirect(`/admin/messages/${thread.id}`);
}

// رد الإدارة ضمن محادثة + تسليم للمستلم.
export async function adminReply(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const guard = await requireActionCapability("messages");
  if (!guard.ok) return { error: guard.error };
  const session = guard.session!;

  const threadId = String(formData.get("threadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const emailCopy = truthy(formData.get("emailCopy"));
  if (body.length < 1) return { error: "اكتب نص الرد." };

  const thread = await prisma.internalThread.findUnique({
    where: { id: threadId },
    select: { id: true, recipientUserId: true, recipientRole: true, subject: true, languageCode: true },
  });
  if (!thread) return { error: "المحادثة غير موجودة." };

  const msg = await prisma.internalMessage.create({
    data: { threadId, senderUserId: session.userId, senderRole: "admin", body },
    select: { id: true },
  });
  await prisma.internalThread.update({
    where: { id: threadId },
    data: { status: "OPEN", recipientUnread: true, adminUnread: false, lastMessageAt: new Date() },
  });

  const { emailed } = await deliverToRecipient({
    recipientUserId: thread.recipientUserId,
    recipientRole: thread.recipientRole,
    threadId,
    locale: thread.languageCode as Locale,
    subject: thread.subject,
    body,
    emailCopy,
  });
  if (emailed) {
    await prisma.internalThread.update({ where: { id: threadId }, data: { emailCopySent: true } });
    await prisma.internalMessage.update({ where: { id: msg.id }, data: { emailedAt: new Date() } });
  }

  revalidatePath(`/admin/messages/${threadId}`);
  return { ok: true };
}

// إغلاق/إعادة فتح محادثة.
export async function setThreadStatus(threadId: string, status: string): Promise<ActionState> {
  const guard = await requireActionCapability("messages");
  if (!guard.ok) return { error: guard.error };
  if (!["OPEN", "CLOSED"].includes(status)) return { error: "حالة غير صالحة." };

  const t = await prisma.internalThread.findUnique({ where: { id: threadId }, select: { id: true } });
  if (!t) return { error: "المحادثة غير موجودة." };

  await prisma.internalThread.update({ where: { id: threadId }, data: { status: status as InternalThreadStatus } });
  revalidatePath(`/admin/messages/${threadId}`);
  revalidatePath("/admin/messages");
  return { ok: true };
}

// حفظ/تحرير قالب مراسلة (يتجاوز المدمج).
export async function saveTemplate(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const guard = await requireActionCapability("templates");
  if (!guard.ok) return { error: guard.error };

  const templateKey = String(formData.get("templateKey") ?? "");
  const lang = String(formData.get("lang") ?? "");
  const category = String(formData.get("category") ?? "general");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!templateKey || !LOCALES.includes(lang as Locale)) return { error: "بيانات غير صالحة." };
  if (subject.length < 2 || body.length < 2) return { error: "أكمل الموضوع والنص." };

  await prisma.internalMessageTemplate.upsert({
    where: { templateKey_languageCode: { templateKey, languageCode: lang } },
    update: { subject, body, category, isActive: true },
    create: { templateKey, languageCode: lang, category, subject, body, isActive: true },
  });
  revalidatePath("/admin/messages/templates");
  return { ok: true };
}
