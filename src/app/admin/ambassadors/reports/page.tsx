// لوحة الإدارة: تقارير أداء السفراء (نظرة مجمّعة).
import Link from "next/link";
import { requirePageCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import type { ReferralStatus } from "@prisma/client";
import { AMB_STATUS_TONE, REF_STATUS_TONE } from "@/lib/ambassador-form";

export const dynamic = "force-dynamic";

const QUALIFIED: ReferralStatus[] = ["PRE_QUALIFIED", "INVESTOR_CONTACTED", "MEETING_SCHEDULED", "NEGOTIATING"];

function fmtDate(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "—";
}

export default async function AmbassadorReportsPage() {
  await requirePageCapability("reports");
  const locale = await getLocale();
  const t = (k: string) => ta(locale, k);

  const [appByStatus, activeAccounts, refTotal, refWonTotal, refByStatus, accounts, refAll, refWon, refQual] =
    await Promise.all([
      prisma.ambassadorApplication.groupBy({ by: ["status"], _count: true }),
      prisma.ambassadorAccount.count({ where: { status: "active" } }),
      prisma.ambassadorReferral.count(),
      prisma.ambassadorReferral.count({ where: { status: "CLOSED_WON" } }),
      prisma.ambassadorReferral.groupBy({ by: ["status"], _count: true }),
      prisma.ambassadorAccount.findMany({
        include: { user: { select: { id: true, fullName: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.ambassadorReferral.groupBy({ by: ["ambassadorUserId"], _count: true, _max: { updatedAt: true } }),
      prisma.ambassadorReferral.groupBy({ by: ["ambassadorUserId"], where: { status: "CLOSED_WON" }, _count: true }),
      prisma.ambassadorReferral.groupBy({ by: ["ambassadorUserId"], where: { status: { in: QUALIFIED } }, _count: true }),
    ]);

  const appsTotal = appByStatus.reduce((s, r) => s + r._count, 0);
  const conversion = refTotal > 0 ? Math.round((refWonTotal / refTotal) * 100) : 0;

  const allMap = new Map(refAll.map((r) => [r.ambassadorUserId, r]));
  const wonMap = new Map(refWon.map((r) => [r.ambassadorUserId, r._count]));
  const qualMap = new Map(refQual.map((r) => [r.ambassadorUserId, r._count]));

  const Stat = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-2xl font-bold text-navy">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t("reports.title")}</h1>
          <p className="text-gray-500 text-sm">{t("reports.subtitle")}</p>
        </div>
        <Link href="/admin/ambassadors" className="text-sm text-gray-500 hover:text-gray-700">
          {t("nav.ambassadors")}
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label={t("reports.applications")} value={appsTotal} />
        <Stat label={t("reports.accounts")} value={activeAccounts} />
        <Stat label={t("reports.referralsTotal")} value={refTotal} />
        <Stat label={t("reports.conversion")} value={`${conversion}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-bold text-baraka-dark mb-3">{t("reports.byStatus")}</h2>
          <div className="flex flex-wrap gap-2">
            {appByStatus.length === 0 && <p className="text-sm text-gray-400">{t("reports.none")}</p>}
            {appByStatus.map((r) => (
              <span key={r.status} className="flex items-center gap-1.5 text-sm">
                <Badge label={t(`status.${r.status}`)} tone={AMB_STATUS_TONE[r.status] ?? "gray"} />
                <span className="font-bold text-gray-700">{r._count}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-bold text-baraka-dark mb-3">{t("reports.refByStatus")}</h2>
          <div className="flex flex-wrap gap-2">
            {refByStatus.length === 0 && <p className="text-sm text-gray-400">{t("reports.none")}</p>}
            {refByStatus.map((r) => (
              <span key={r.status} className="flex items-center gap-1.5 text-sm">
                <Badge label={t(`refStatus.${r.status}`)} tone={REF_STATUS_TONE[r.status] ?? "gray"} />
                <span className="font-bold text-gray-700">{r._count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto">
        <h2 className="font-bold text-baraka-dark p-4 pb-0">{t("reports.perAmbassador")}</h2>
        {accounts.length === 0 ? (
          <p className="text-sm text-gray-400 p-4">{t("reports.none")}</p>
        ) : (
          <table className="w-full text-sm whitespace-nowrap mt-2">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-medium text-start">{t("reports.col.ambassador")}</th>
                <th className="p-3 font-medium text-start">{t("reports.col.referrals")}</th>
                <th className="p-3 font-medium text-start">{t("reports.col.qualified")}</th>
                <th className="p-3 font-medium text-start">{t("reports.col.closedWon")}</th>
                <th className="p-3 font-medium text-start">{t("reports.col.lastActivity")}</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => {
                const uid = a.user.id;
                const agg = allMap.get(uid);
                return (
                  <tr key={a.id} className="border-t border-gray-100">
                    <td className="p-3 font-medium text-gray-800">{a.user.fullName}</td>
                    <td className="p-3 text-gray-700">{agg?._count ?? 0}</td>
                    <td className="p-3 text-gray-700">{qualMap.get(uid) ?? 0}</td>
                    <td className="p-3 text-gray-700">{wonMap.get(uid) ?? 0}</td>
                    <td className="p-3 text-gray-500" dir="ltr">{fmtDate(agg?._max.updatedAt ?? null)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
