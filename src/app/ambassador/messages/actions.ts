"use server";
// رسائل السفير الداخلية — إنشاء محادثة والرد عليها (جانب السفير).
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notify";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { MESSAGE_TYPES, normalizeOption } from "@/lib/ambassador-form";

export interface MsgState {
  ok?: boolean;
  error?: string;
}

export async function createMessage(_prev: MsgState, formData: FormData): Promise<MsgState> {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const type = normalizeOption(MESSAGE_TYPES, String(formData.get("messageType") ?? "")) ?? "general";
  if (subject.length < 2 || body.length < 2) return { error: ta(locale, "msg.errSubject") };

  const msg = await prisma.ambassadorMessage.create({
    data: {
      ambassadorUserId: session.userId,
      subject,
      messageType: type,
      status: "NEW",
      createdById: session.userId,
      replies: { create: { senderUserId: session.userId, senderRole: "ambassador", body } },
    },
    select: { id: true },
  });

  await notifyAdmins({
    type: "AMBASSADOR_NEW_MESSAGE",
    message: `رسالة جديدة من السفير ${session.fullName}: ${subject}`,
    link: `/admin/ambassadors/messages/${msg.id}`,
  });
  return { ok: true };
}

export async function replyMessage(_prev: MsgState, formData: FormData): Promise<MsgState> {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const messageId = String(formData.get("messageId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return { error: ta(locale, "msg.errBody") };

  const msg = await prisma.ambassadorMessage.findFirst({
    where: { id: messageId, ambassadorUserId: session.userId },
    select: { id: true },
  });
  if (!msg) return { error: ta(locale, "common.actionFailed") };

  await prisma.ambassadorMessageReply.create({
    data: { messageId, senderUserId: session.userId, senderRole: "ambassador", body },
  });
  await prisma.ambassadorMessage.update({ where: { id: messageId }, data: { status: "IN_PROGRESS" } });

  await notifyAdmins({
    type: "AMBASSADOR_NEW_MESSAGE",
    message: `رد جديد من السفير ${session.fullName}`,
    link: `/admin/ambassadors/messages/${messageId}`,
  });
  revalidatePath(`/ambassador/messages/${messageId}`);
  return { ok: true };
}
