import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { tc } from "@/lib/crm-i18n";

export const dynamic = "force-dynamic";

type Row = { label: string; count: number };

function DistroCard({ title, rows, max, empty }: { title: string; rows: Row[]; max: number; empty: string }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-bold text-navy mb-3">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <li key={i} className="text-sm">
              <div className="flex justify-between gap-2 mb-0.5">
                <span className="text-gray-700 truncate">{r.label}</span>
                <span className="text-gray-500 font-medium shrink-0">{r.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-baraka rounded-full" style={{ width: `${max ? (r.count / max) * 100 : 0}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function CrmReportsPage() {
  await requireRole("ADMIN");
  const locale = await getLocale();
  const notSpam = { isSpam: false } as const;

  const [
    total,
    investors,
    owners,
    newCount,
    qualified,
    closedWon,
    unassigned,
    spam,
    overdue,
    byStatusRaw,
    byCountryRaw,
    bySectorRaw,
    byLangRaw,
    byAssigneeRaw,
    topOppsRaw,
  ] = await Promise.all([
    prisma.crmLead.count({ where: notSpam }),
    prisma.crmLead.count({ where: { ...notSpam, leadType: "INVESTOR_INTEREST" } }),
    prisma.crmLead.count({ where: { ...notSpam, leadType: "OPPORTUNITY_SUBMISSION" } }),
    prisma.crmLead.count({ where: { ...notSpam, status: "NEW" } }),
    prisma.crmLead.count({ where: { ...notSpam, status: "QUALIFIED" } }),
    prisma.crmLead.count({ where: { ...notSpam, status: "CLOSED_WON" } }),
    prisma.crmLead.count({ where: { ...notSpam, assignedToId: null } }),
    prisma.crmLead.count({ where: { isSpam: true } }),
    prisma.crmFollowup.count({ where: { status: "pending", followupAt: { lt: new Date() } } }),
    prisma.crmLead.groupBy({ by: ["status"], where: notSpam, _count: { _all: true } }),
    prisma.crmLead.groupBy({ by: ["country"], where: { ...notSpam, country: { not: null } }, _count: { _all: true } }),
    prisma.crmLead.groupBy({ by: ["sectorInterest"], where: { ...notSpam, sectorInterest: { not: null } }, _count: { _all: true } }),
    prisma.crmLead.groupBy({ by: ["languageCode"], where: notSpam, _count: { _all: true } }),
    prisma.crmLead.groupBy({ by: ["assignedToId"], where: { ...notSpam, assignedToId: { not: null } }, _count: { _all: true } }),
    prisma.crmLead.groupBy({ by: ["relatedOpportunityId"], where: { ...notSpam, relatedOpportunityId: { not: null } }, _count: { _all: true } }),
  ]);

  // أسماء الموظفين وعناوين الفرص للتجميعات
  const assigneeIds = byAssigneeRaw.map((r) => r.assignedToId!).filter(Boolean);
  const oppIds = topOppsRaw.map((r) => r.relatedOpportunityId!).filter(Boolean);
  const [assignees, opps] = await Promise.all([
    assigneeIds.length
      ? prisma.user.findMany({ where: { id: { in: assigneeIds } }, select: { id: true, fullName: true } })
      : Promise.resolve([]),
    oppIds.length
      ? prisma.opportunity.findMany({ where: { id: { in: oppIds } }, select: { id: true, title: true } })
      : Promise.resolve([]),
  ]);
  const nameOf = new Map(assignees.map((u) => [u.id, u.fullName]));
  const titleOf = new Map(opps.map((o) => [o.id, o.title]));

  const sortTop = (rows: Row[], n = 8) => rows.sort((a, b) => b.count - a.count).slice(0, n);

  const byStatus = sortTop(byStatusRaw.map((r) => ({ label: tc(locale, `crmStatus.${r.status}`), count: r._count._all })), 12);
  const byCountry = sortTop(byCountryRaw.map((r) => ({ label: r.country ?? "—", count: r._count._all })));
  const bySector = sortTop(bySectorRaw.map((r) => ({ label: r.sectorInterest ?? "—", count: r._count._all })));
  const byLang = sortTop(byLangRaw.map((r) => ({ label: tc(locale, `lang.${r.languageCode}`), count: r._count._all })));
  const byAssignee = sortTop(byAssigneeRaw.map((r) => ({ label: nameOf.get(r.assignedToId!) ?? "—", count: r._count._all })));
  const topOpps = sortTop(topOppsRaw.map((r) => ({ label: titleOf.get(r.relatedOpportunityId!) ?? "—", count: r._count._all })));

  const maxOf = (rows: Row[]) => rows.reduce((m, r) => Math.max(m, r.count), 0);

  const stats: { label: string; value: number; tone: string }[] = [
    { label: tc(locale, "reports.total"), value: total, tone: "text-navy" },
    { label: tc(locale, "reports.investors"), value: investors, tone: "text-baraka" },
    { label: tc(locale, "reports.owners"), value: owners, tone: "text-baraka" },
    { label: tc(locale, "reports.new"), value: newCount, tone: "text-blue-600" },
    { label: tc(locale, "reports.qualified"), value: qualified, tone: "text-green-600" },
    { label: tc(locale, "reports.closedWon"), value: closedWon, tone: "text-green-700" },
    { label: tc(locale, "reports.unassigned"), value: unassigned, tone: "text-amber-600" },
    { label: tc(locale, "reports.overdue"), value: overdue, tone: "text-red-600" },
    { label: tc(locale, "reports.spam"), value: spam, tone: "text-gray-500" },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{tc(locale, "reports.title")}</h1>
          <p className="text-gray-500 text-sm">{tc(locale, "reports.sub")}</p>
        </div>
        <Link href="/admin/crm" className="text-sm text-baraka hover:underline">
          {tc(locale, "reports.backToList")}
        </Link>
      </div>

      {/* بطاقات الأرقام */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className={`text-2xl font-extrabold ${s.tone}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* التوزيعات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DistroCard title={tc(locale, "reports.topOpps")} rows={topOpps} max={maxOf(topOpps)} empty={tc(locale, "reports.none")} />
        <DistroCard title={tc(locale, "reports.byStatus")} rows={byStatus} max={maxOf(byStatus)} empty={tc(locale, "reports.none")} />
        <DistroCard title={tc(locale, "reports.byCountry")} rows={byCountry} max={maxOf(byCountry)} empty={tc(locale, "reports.none")} />
        <DistroCard title={tc(locale, "reports.bySector")} rows={bySector} max={maxOf(bySector)} empty={tc(locale, "reports.none")} />
        <DistroCard title={tc(locale, "reports.byAssignee")} rows={byAssignee} max={maxOf(byAssignee)} empty={tc(locale, "reports.none")} />
        <DistroCard title={tc(locale, "reports.byLang")} rows={byLang} max={maxOf(byLang)} empty={tc(locale, "reports.none")} />
      </div>
    </div>
  );
}
