// قائمة صندوق الوارد من الإدارة (مكوّن مشترك لكل البوّابات الأربع).
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { tm, STATUS_TONE } from "@/lib/internal-msg";
import type { Locale } from "@/lib/i18n";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export default async function InboxList({
  userId,
  basePath,
  locale,
}: {
  userId: string;
  basePath: string;
  locale: Locale;
}) {
  const threads = await prisma.internalThread.findMany({
    where: { recipientUserId: userId },
    orderBy: { lastMessageAt: "desc" },
  });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-1">{tm(locale, "portal.title")}</h1>
        <p className="text-gray-500 text-sm">{tm(locale, "portal.subtitle")}</p>
      </div>

      {threads.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">{tm(locale, "portal.empty")}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {threads.map((th) => (
            <Link key={th.id} href={`${basePath}/${th.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-gray-50">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {th.recipientUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-baraka" aria-hidden="true" />}
                  <span className={`truncate ${th.recipientUnread ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>{th.subject}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {tm(locale, `cat.${th.category}`)} · <span dir="ltr">{fmt(th.lastMessageAt)}</span>
                </div>
              </div>
              <Badge label={tm(locale, `status.${th.status}`)} tone={STATUS_TONE[th.status] ?? "gray"} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
