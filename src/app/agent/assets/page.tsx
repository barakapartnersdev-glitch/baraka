// بوّابة الوكيل: قائمة أصولي.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";
import { labelFor, submissionStatusBadge, ASSET_TYPES, OFFER_TYPES } from "@/lib/agent";

export const dynamic = "force-dynamic";

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function AgentAssetsPage() {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const t = (k: string) => tg(locale, k);

  const assets = await prisma.assetAgentSubmittedAsset.findMany({
    where: { agentUserId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t("assets.title")}</h1>
          <p className="text-gray-500 text-sm">{t("assets.subtitle")}</p>
        </div>
        <Link href="/agent/assets/new" className="rounded-lg bg-baraka text-white px-5 py-2.5 text-sm font-medium hover:bg-baraka-dark transition">
          {t("assets.new")}
        </Link>
      </div>

      {assets.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">{t("assets.empty")}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-medium text-start">{t("assets.col.title")}</th>
                <th className="p-3 font-medium text-start">{t("assets.col.type")}</th>
                <th className="p-3 font-medium text-start">{t("assets.col.country")}</th>
                <th className="p-3 font-medium text-start">{t("assets.col.offer")}</th>
                <th className="p-3 font-medium text-start">{t("assets.col.date")}</th>
                <th className="p-3 font-medium text-start">{t("assets.col.status")}</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <Link href={`/agent/assets/${a.id}`} className="font-medium text-navy hover:text-baraka">{a.title}</Link>
                  </td>
                  <td className="p-3 text-gray-600">{labelFor(ASSET_TYPES, a.assetType, locale)}</td>
                  <td className="p-3 text-gray-600">{a.country ?? "—"}</td>
                  <td className="p-3 text-gray-600">{labelFor(OFFER_TYPES, a.offerType, locale)}</td>
                  <td className="p-3 text-gray-500" dir="ltr">{fmtDate(a.createdAt)}</td>
                  <td className="p-3"><Badge {...submissionStatusBadge(locale, a.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
