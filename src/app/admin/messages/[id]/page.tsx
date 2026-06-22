// لوحة الإدارة: عرض محادثة داخلية كاملة + الرد + الإغلاق/إعادة الفتح.
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePageCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { tm, STATUS_TONE } from "@/lib/internal-msg";
import { setThreadStatus } from "../actions";
import AdminReplyForm from "./AdminReplyForm";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export default async function AdminThreadPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePageCapability("messages");
  const locale = await getLocale();
  const { id } = await params;

  const thread = await prisma.internalThread.findUnique({
    where: { id },
    include: {
      recipientUser: { select: { fullName: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!thread) notFound();

  // وضع علامة "مقروء" للإدارة عند الفتح
  if (thread.adminUnread) {
    try {
      await prisma.internalThread.update({ where: { id }, data: { adminUnread: false } });
    } catch {}
  }

  const closed = thread.status === "CLOSED";

  return (
    <div className="max-w-2xl">
      <Link href="/admin/messages" className="text-sm text-gray-500 hover:text-gray-700">
        {tm(locale, "admin.title")}
      </Link>
      <div className="mt-2 mb-1 flex items-start justify-between gap-3">
        <h1 className="text-xl font-bold">{thread.subject}</h1>
        <Badge label={tm(locale, `status.${thread.status}`)} tone={STATUS_TONE[thread.status] ?? "gray"} />
      </div>
      <p className="text-xs text-gray-400 mb-1">
        {thread.recipientUser?.fullName} ({thread.recipientUser?.email}) · {tm(locale, `role.${thread.recipientRole}`)} · {tm(locale, `cat.${thread.category}`)}
      </p>
      {thread.emailCopySent && <p className="text-[11px] text-teal-700 mb-4">✓ {tm(locale, "thread.emailSent")}</p>}

      <div className="flex flex-col gap-3 my-5">
        {thread.messages.map((m) => {
          const fromAdmin = m.senderRole === "admin";
          return (
            <div
              key={m.id}
              className={`rounded-xl border p-3 text-sm ${fromAdmin ? "bg-baraka-light/50 border-baraka/20" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1 text-xs text-gray-400">
                <span className="font-medium text-gray-600">{fromAdmin ? tm(locale, "thread.fromAdmin") : tm(locale, "thread.fromRecipient")}</span>
                <span className="flex items-center gap-2">
                  {m.emailedAt && <span className="text-teal-600" title={tm(locale, "thread.emailSent")}>✉</span>}
                  <span dir="ltr">{fmt(m.createdAt)}</span>
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{m.body}</p>
            </div>
          );
        })}
      </div>

      {!closed ? (
        <AdminReplyForm threadId={thread.id} locale={locale} />
      ) : (
        <p className="text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3">{tm(locale, "status.CLOSED")}</p>
      )}

      <div className="mt-4">
        {closed ? (
          <form
            action={async () => {
              "use server";
              await setThreadStatus(thread.id, "OPEN");
            }}
          >
            <button className="text-sm text-baraka hover:underline">{tm(locale, "thread.reopen")}</button>
          </form>
        ) : (
          <form
            action={async () => {
              "use server";
              await setThreadStatus(thread.id, "CLOSED");
            }}
          >
            <button className="text-sm text-gray-500 hover:text-red-700">{tm(locale, "thread.close")}</button>
          </form>
        )}
      </div>
    </div>
  );
}
