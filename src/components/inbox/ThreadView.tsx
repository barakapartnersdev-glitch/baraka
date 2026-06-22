// عرض محادثة في صندوق الوارد من الإدارة (مكوّن مشترك للبوّابات). يتحقّق أن المحادثة تخصّ المستلم.
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { tm } from "@/lib/internal-msg";
import type { Locale } from "@/lib/i18n";
import InboxReplyForm from "./InboxReplyForm";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export default async function ThreadView({
  userId,
  threadId,
  basePath,
  locale,
}: {
  userId: string;
  threadId: string;
  basePath: string;
  locale: Locale;
}) {
  const thread = await prisma.internalThread.findFirst({
    where: { id: threadId, recipientUserId: userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!thread) notFound();

  // وضع علامة "مقروء" للمستلم عند الفتح
  if (thread.recipientUnread) {
    try {
      await prisma.internalThread.update({ where: { id: thread.id }, data: { recipientUnread: false } });
    } catch {}
  }

  const closed = thread.status === "CLOSED";

  return (
    <div className="max-w-2xl">
      <Link href={basePath} className="text-sm text-gray-500 hover:text-gray-700">
        {tm(locale, "portal.title")}
      </Link>
      <h1 className="text-xl font-bold mt-2 mb-4">{thread.subject}</h1>

      <div className="flex flex-col gap-3 mb-6">
        {thread.messages.map((m) => {
          const fromAdmin = m.senderRole === "admin";
          return (
            <div
              key={m.id}
              className={`rounded-xl border p-3 text-sm ${fromAdmin ? "bg-baraka-light/50 border-baraka/20" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1 text-xs text-gray-400">
                <span className="font-medium text-gray-600">{fromAdmin ? tm(locale, "portal.admin") : tm(locale, "portal.you")}</span>
                <span dir="ltr">{fmt(m.createdAt)}</span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{m.body}</p>
            </div>
          );
        })}
      </div>

      {closed ? (
        <p className="text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-xl p-3">{tm(locale, "portal.closedNotice")}</p>
      ) : (
        <InboxReplyForm threadId={thread.id} locale={locale} />
      )}
    </div>
  );
}
