// لوحة الإدارة — قائمة طلبات «وكلاء أصحاب الأصول».
// ⚠️ يعتمد على نموذج AssetAgentApplication (انظر ASSET_OWNER_AGENTS_INTEGRATION.md).
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { agentUi } from "@/lib/agent-i18n";
import { tg } from "@/lib/agent-portal-i18n";
import { agentStatusBadge, labelFor, labelsFor, PROFESSIONAL_TYPES, ASSET_TYPES } from "@/lib/agent";

export const dynamic = "force-dynamic";

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function AssetAgentsPage() {
  const locale = await getLocale();
  const ui = agentUi(locale);

  const apps = await prisma.assetAgentApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { fullName: true } } },
  });

  const pendingCount = apps.filter((x) => x.status === "NEW").length;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">{ui.listTitle}</h1>
      <p className="mb-6 text-sm text-gray-500">
        {ui.listSub}
        {pendingCount > 0 && (
          <span className="text-amber-700"> — {pendingCount} {ui.pendingSuffix}</span>
        )}
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        <Link href="/admin/asset-agents/assets" className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
          {tg(locale, "admin.assets.title")}
        </Link>
        <Link href="/admin/asset-agents/messages" className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
          {tg(locale, "admin.messages.title")}
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-start">
            <tr>
              <th className="p-3 text-start font-medium">{ui.colName}</th>
              <th className="p-3 text-start font-medium">{ui.colCountry}</th>
              <th className="p-3 text-start font-medium">{ui.colProfType}</th>
              <th className="p-3 text-start font-medium">{ui.colAssetTypes}</th>
              <th className="p-3 text-start font-medium">{ui.colStatus}</th>
              <th className="p-3 text-start font-medium">{ui.colAssigned}</th>
              <th className="p-3 text-start font-medium">{ui.colDate}</th>
              <th className="p-3 text-start font-medium">{ui.colActions}</th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400">{ui.empty}</td>
              </tr>
            )}
            {apps.map((x) => (
              <tr key={x.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-medium">
                  <Link href={`/admin/asset-agents/${x.id}`} className="text-navy hover:text-gold hover:underline">
                    {x.fullName}
                  </Link>
                  <div className="text-xs text-gray-400" dir="ltr">{x.email}</div>
                </td>
                <td className="p-3 text-gray-600">{x.country ?? ui.none}{x.city ? ` — ${x.city}` : ""}</td>
                <td className="p-3 text-gray-600">{labelFor(PROFESSIONAL_TYPES, x.professionalType, locale)}</td>
                <td className="max-w-[180px] truncate p-3 text-gray-500" title={labelsFor(ASSET_TYPES, x.coveredAssetTypes, locale).join("، ")}>
                  {labelsFor(ASSET_TYPES, x.coveredAssetTypes, locale).join("، ") || ui.none}
                </td>
                <td className="p-3"><Badge {...agentStatusBadge(locale, x.status)} /></td>
                <td className="p-3 text-gray-500">{x.assignedTo?.fullName ?? ui.unassigned}</td>
                <td className="p-3 text-xs text-gray-400" dir="ltr">{fmtDate(x.createdAt)}</td>
                <td className="p-3">
                  <Link href={`/admin/asset-agents/${x.id}`} className="text-xs font-semibold text-baraka hover:underline">
                    {ui.view}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
