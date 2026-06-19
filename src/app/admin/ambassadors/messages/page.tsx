// لوحة الإدارة: كل رسائل السفراء.
import Link from "next/link";
import { requirePageCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { MSG_STATUS_TONE } from "@/lib/ambassador-form";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export default async function AdminMessagesPage() {
  await requirePageCapability("messages");
  const locale = await getLocale();
  const t = (k: string) => ta(locale, k);

  const msgs = await prisma.ambassadorMessage.findMany({
    orderBy: { updatedAt: "desc" },
    take: 300,
    include: { ambassadorUser: { select: { fullName: true } } },
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t("admin.messages.title")}</h1>
        <Link href="/admin/ambassadors" className="text-sm text-gray-500 hover:text-gray-700">
          {t("nav.ambassadors")}
        </Link>
      </div>

      {msgs.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">{t("admin.messages.empty")}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {msgs.map((m) => (
            <Link
              key={m.id}
              href={`/admin/ambassadors/messages/${m.id}`}
              className="flex items-center justify-between gap-3 p-4 hover:bg-gray-50"
            >
              <div className="min-w-0">
                <div className="font-medium text-gray-800 truncate">{m.subject}</div>
                <div className="text-xs text-gray-400">
                  {m.ambassadorUser?.fullName ?? "—"} · {t(`msg.type.${m.messageType}`)} · <span dir="ltr">{fmt(m.updatedAt)}</span>
                </div>
              </div>
              <Badge label={t(`msgStatus.${m.status}`)} tone={MSG_STATUS_TONE[m.status] ?? "gray"} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
