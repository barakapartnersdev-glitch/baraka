// لوحة وكيل صاحب الأصل — ملخّص الأصول، الرسائل، حالة الحساب، التعليمات.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAgentAccount } from "@/lib/agent-account";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";

export const dynamic = "force-dynamic";

function Stat({ label, value, href }: { label: string; value: number; href?: string }) {
  const inner = (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-2xl font-bold text-navy">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AgentDashboard() {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const uid = session.userId;
  const t = (k: string) => tg(locale, k);

  const account = await getAgentAccount(uid);
  const [total, review, approved, openMessages, latest] = await Promise.all([
    prisma.assetAgentSubmittedAsset.count({ where: { agentUserId: uid } }),
    prisma.assetAgentSubmittedAsset.count({ where: { agentUserId: uid, status: { in: ["NEW_SUBMISSION", "UNDER_REVIEW", "NEEDS_INFO"] } } }),
    prisma.assetAgentSubmittedAsset.count({ where: { agentUserId: uid, status: { in: ["APPROVED", "CONVERTED"] } } }),
    prisma.assetAgentMessage.count({ where: { agentUserId: uid, status: { not: "CLOSED" } } }),
    prisma.assetAgentMessage.findMany({ where: { agentUserId: uid }, orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, subject: true, status: true } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("dash.welcome")}، {session.fullName}</h1>
          <p className="text-sm text-gray-500">{t("portal.role")}</p>
        </div>
        <Link href="/agent/assets/new" className="rounded-lg bg-gradient-to-br from-gold to-gold-soft px-5 py-2.5 text-sm font-bold text-navy transition hover:brightness-110">
          {t("dash.quickAsset")}
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label={t("dash.assetsTotal")} value={total} href="/agent/assets" />
        <Stat label={t("dash.assetsReview")} value={review} href="/agent/assets" />
        <Stat label={t("dash.assetsApproved")} value={approved} href="/agent/assets" />
        <Stat label={t("dash.openMessages")} value={openMessages} href="/agent/messages" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-bold text-baraka-dark mb-3">{t("dash.latestMessages")}</h2>
          {latest.length === 0 ? (
            <p className="text-sm text-gray-400">{t("dash.noMessages")}</p>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-50">
              {latest.map((m) => (
                <li key={m.id}>
                  <Link href={`/agent/messages/${m.id}`} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-baraka">
                    <span className="text-gray-800 truncate">{m.subject}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-bold text-baraka-dark mb-3">{t("dash.accountStatus")}</h2>
          <span className={`inline-block rounded-md px-2.5 py-1 text-xs ${account?.status === "active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
            {t(`dash.acc.${account?.status ?? "active"}`)}
          </span>
          {account?.startDate && (
            <p className="mt-3 text-xs text-gray-500">
              {t("dash.startDate")}: <span className="text-gray-700" dir="ltr">{account.startDate.toISOString().slice(0, 10)}</span>
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="font-bold text-amber-900 mb-2">{t("dash.instructions")}</h2>
        <p className="text-sm text-amber-800 leading-relaxed">{t("dash.instructionsBody")}</p>
      </div>
    </div>
  );
}
