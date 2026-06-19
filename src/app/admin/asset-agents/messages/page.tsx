// لوحة الإدارة: كل رسائل الوكلاء.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";
import { agentMessageStatusBadge, labelFor, AGENT_MESSAGE_TYPES } from "@/lib/agent";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export default async function AdminAgentMessagesPage() {
  await requireRole("ADMIN");
  const locale = await getLocale();
  const t = (k: string) => tg(locale, k);

  const msgs = await prisma.assetAgentMessage.findMany({
    orderBy: { updatedAt: "desc" },
    take: 300,
    include: { agentUser: { select: { fullName: true } } },
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t("admin.messages.title")}</h1>
        <Link href="/admin/asset-agents" className="text-sm text-gray-500 hover:text-gray-700">{t("admin.back")}</Link>
      </div>

      {msgs.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">{t("dash.noMessages")}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {msgs.map((m) => (
            <Link key={m.id} href={`/admin/asset-agents/messages/${m.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-gray-50">
              <div className="min-w-0">
                <div className="font-medium text-gray-800 truncate">{m.subject}</div>
                <div className="text-xs text-gray-400">{m.agentUser?.fullName ?? "—"} · {labelFor(AGENT_MESSAGE_TYPES, m.messageType, locale)} · <span dir="ltr">{fmt(m.updatedAt)}</span></div>
              </div>
              <Badge {...agentMessageStatusBadge(locale, m.status)} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
