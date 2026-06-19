// لوحة الإدارة: كل الأصول المقدّمة من الوكلاء.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";
import { labelFor, submissionStatusBadge, ASSET_TYPES } from "@/lib/agent";

export const dynamic = "force-dynamic";

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function AdminAssetsPage() {
  await requireRole("ADMIN");
  const locale = await getLocale();
  const t = (k: string) => tg(locale, k);

  const assets = await prisma.assetAgentSubmittedAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { agentUser: { select: { fullName: true } } },
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t("admin.assets.title")}</h1>
        <Link href="/admin/asset-agents" className="text-sm text-gray-500 hover:text-gray-700">{agentNav(locale)}</Link>
      </div>

      {assets.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">{t("admin.assets.empty")}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-medium text-start">{t("assets.col.title")}</th>
                <th className="p-3 font-medium text-start">{t("admin.assets.byAgent")}</th>
                <th className="p-3 font-medium text-start">{t("assets.col.type")}</th>
                <th className="p-3 font-medium text-start">{t("assets.col.country")}</th>
                <th className="p-3 font-medium text-start">{t("assets.col.date")}</th>
                <th className="p-3 font-medium text-start">{t("assets.col.status")}</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <Link href={`/admin/asset-agents/assets/${a.id}`} className="font-medium text-navy hover:text-baraka">{a.title}</Link>
                  </td>
                  <td className="p-3 text-gray-600">{a.agentUser?.fullName ?? "—"}</td>
                  <td className="p-3 text-gray-600">{labelFor(ASSET_TYPES, a.assetType, locale)}</td>
                  <td className="p-3 text-gray-600">{a.country ?? "—"}</td>
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

function agentNav(locale: import("@/lib/i18n").Locale): string {
  return locale === "ar" ? "وكلاء أصحاب الأصول" : locale === "tr" ? "Varlık Sahibi Temsilcileri" : "Asset Owner Agents";
}
