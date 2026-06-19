// بوّابة الوكيل: قائمة المحادثات الداخلية.
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

export default async function AgentMessagesPage() {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const t = (k: string) => tg(locale, k);

  const msgs = await prisma.assetAgentMessage.findMany({ where: { agentUserId: session.userId }, orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t("msg.title")}</h1>
          <p className="text-gray-500 text-sm">{t("msg.subtitle")}</p>
        </div>
        <Link href="/agent/messages/new" className="rounded-lg bg-baraka text-white px-5 py-2.5 text-sm font-medium hover:bg-baraka-dark transition">{t("msg.new")}</Link>
      </div>

      {msgs.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">{t("msg.empty")}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {msgs.map((m) => (
            <Link key={m.id} href={`/agent/messages/${m.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-gray-50">
              <div className="min-w-0">
                <div className="font-medium text-gray-800 truncate">{m.subject}</div>
                <div className="text-xs text-gray-400">{labelFor(AGENT_MESSAGE_TYPES, m.messageType, locale)} · <span dir="ltr">{fmt(m.updatedAt)}</span></div>
              </div>
              <Badge {...agentMessageStatusBadge(locale, m.status)} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
