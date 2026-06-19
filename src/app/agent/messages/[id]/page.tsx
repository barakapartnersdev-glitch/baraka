// بوّابة الوكيل: عرض محادثة + الرد.
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";
import { labelFor, AGENT_MESSAGE_TYPES } from "@/lib/agent";
import ReplyForm from "../ReplyForm";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export default async function AgentThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const { id } = await params;
  const t = (k: string) => tg(locale, k);

  const msg = await prisma.assetAgentMessage.findFirst({
    where: { id, agentUserId: session.userId },
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });
  if (!msg) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/agent/messages" className="text-sm text-gray-500 hover:text-gray-700">{t("msg.title")}</Link>
      <h1 className="text-xl font-bold mt-2 mb-1">{msg.subject}</h1>
      <p className="text-xs text-gray-400 mb-5">{labelFor(AGENT_MESSAGE_TYPES, msg.messageType, locale)}</p>

      <div className="flex flex-col gap-3 mb-6">
        {msg.replies.map((r) => {
          const mine = r.senderRole === "agent";
          return (
            <div key={r.id} className={`rounded-xl border p-3 text-sm ${mine ? "bg-baraka-light/50 border-baraka/20" : "bg-white border-gray-200"}`}>
              <div className="flex items-center justify-between gap-2 mb-1 text-xs text-gray-400">
                <span className="font-medium text-gray-600">{mine ? t("msg.you") : t("msg.admin")}</span>
                <span dir="ltr">{fmt(r.createdAt)}</span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{r.body}</p>
            </div>
          );
        })}
      </div>

      <ReplyForm messageId={msg.id} locale={locale} />
    </div>
  );
}
