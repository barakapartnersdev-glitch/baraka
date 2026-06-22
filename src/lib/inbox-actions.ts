"use server";
// إجراء مشترك لصناديق الوارد في البوّابات الأربع — رد المستلم على مراسلة الإدارة.
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyAdminOfReply } from "@/lib/internal-msg-server";
import { inboxBasePath } from "@/lib/internal-msg";

export interface InboxActionState {
  ok?: boolean;
  error?: string;
}

export async function replyToThread(_prev: InboxActionState, formData: FormData): Promise<InboxActionState> {
  const session = await requireRole("AMBASSADOR", "ASSET_OWNER_AGENT", "PROJECT_OWNER", "INVESTOR");
  const threadId = String(formData.get("threadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return { error: "اكتب نص الرد." };

  // التحقّق أن المحادثة تخصّ صاحب الجلسة
  const thread = await prisma.internalThread.findFirst({
    where: { id: threadId, recipientUserId: session.userId },
    select: { id: true, createdById: true, status: true },
  });
  if (!thread) return { error: "المحادثة غير موجودة." };
  if (thread.status === "CLOSED") return { error: "هذه المحادثة مغلقة." };

  await prisma.internalMessage.create({
    data: { threadId, senderUserId: session.userId, senderRole: "recipient", body },
  });
  await prisma.internalThread.update({
    where: { id: threadId },
    data: { status: "REPLIED", adminUnread: true, recipientUnread: false, lastMessageAt: new Date() },
  });
  await notifyAdminOfReply({ threadId, createdById: thread.createdById, recipientName: session.fullName });

  revalidatePath(`${inboxBasePath(session.role)}/${threadId}`);
  revalidatePath(inboxBasePath(session.role));
  return { ok: true };
}
