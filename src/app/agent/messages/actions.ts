"use server";
// رسائل الوكيل الداخلية — إنشاء محادثة والرد (جانب الوكيل).
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notify";
import { getAgentAccount } from "@/lib/agent-account";
import { AGENT_MESSAGE_TYPES } from "@/lib/agent";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";

export interface MsgState {
  ok?: boolean;
  error?: string;
}

export async function createMessage(_prev: MsgState, formData: FormData): Promise<MsgState> {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const account = await getAgentAccount(session.userId);
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const typeRaw = String(formData.get("messageType") ?? "");
  const type = AGENT_MESSAGE_TYPES.some((t) => t.code === typeRaw) ? typeRaw : "general";
  if (subject.length < 2 || body.length < 2) return { error: tg(locale, "msg.errSubject") };

  const msg = await prisma.assetAgentMessage.create({
    data: {
      applicationId: account?.applicationId ?? null,
      agentUserId: session.userId,
      subject,
      messageType: type,
      status: "NEW",
      createdById: session.userId,
      replies: { create: { senderUserId: session.userId, senderRole: "agent", body } },
    },
    select: { id: true },
  });
  await notifyAdmins({
    type: "ASSET_AGENT_NEW_MESSAGE",
    message: `رسالة جديدة من الوكيل ${session.fullName}: ${subject}`,
    link: `/admin/asset-agents/messages/${msg.id}`,
  });
  return { ok: true };
}

export async function replyMessage(_prev: MsgState, formData: FormData): Promise<MsgState> {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const messageId = String(formData.get("messageId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return { error: tg(locale, "msg.errBody") };

  const msg = await prisma.assetAgentMessage.findFirst({ where: { id: messageId, agentUserId: session.userId }, select: { id: true } });
  if (!msg) return { error: tg(locale, "common.actionFailed") };

  await prisma.assetAgentMessageReply.create({ data: { messageId, senderUserId: session.userId, senderRole: "agent", body } });
  await prisma.assetAgentMessage.update({ where: { id: messageId }, data: { status: "IN_PROGRESS" } });
  await notifyAdmins({ type: "ASSET_AGENT_NEW_MESSAGE", message: `رد جديد من الوكيل ${session.fullName}`, link: `/admin/asset-agents/messages/${messageId}` });
  revalidatePath(`/agent/messages/${messageId}`);
  return { ok: true };
}
