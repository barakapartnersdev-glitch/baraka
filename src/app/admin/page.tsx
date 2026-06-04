import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { oppBadge } from "@/lib/states";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const locale = await getLocale();

  const [underReview, newInterests, pendingMissing, pendingAccounts, recentOpps] =
    await Promise.all([
      prisma.opportunity.count({ where: { state: "UNDER_REVIEW" } }),
      prisma.interest.count({ where: { status: "REQUESTED" } }),
      prisma.missingItem.count({ where: { resolved: false } }),
      prisma.user.count({ where: { accountStatus: "PENDING_REVIEW" } }),
      prisma.opportunity.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { interests: true } } },
      }),
    ]);

  const cards = [
    { label: t(locale, "adminHome.cardUnderReview"), value: underReview, href: "/admin/opportunities", accent: "text-blue-600" },
    { label: t(locale, "adminHome.cardNewInterests"), value: newInterests, href: "/admin/interests", accent: "text-baraka" },
    { label: t(locale, "adminHome.cardPendingMissing"), value: pendingMissing, href: "/admin/opportunities", accent: "text-amber-600" },
    { label: t(locale, "adminHome.cardPendingAccounts"), value: pendingAccounts, href: "/admin/investors", accent: "text-gray-800" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{t(locale, "adminHome.title")}</h1>
      <p className="text-gray-500 text-sm mb-6">{t(locale, "adminHome.sub")}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-baraka transition">
            <p className="text-xs text-gray-500 mb-2">{c.label}</p>
            <p className={`text-2xl font-bold ${c.accent}`}>{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">{t(locale, "adminHome.recent")}</h2>
        <Link href="/admin/opportunities" className="text-sm text-baraka hover:underline">
          {t(locale, "adminHome.viewAll")}
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-right">
            <tr>
              <th className="p-3 font-medium">{t(locale, "col.opportunity")}</th>
              <th className="p-3 font-medium">{t(locale, "col.sector")}</th>
              <th className="p-3 font-medium">{t(locale, "col.state")}</th>
              <th className="p-3 font-medium">{t(locale, "col.interested")}</th>
            </tr>
          </thead>
          <tbody>
            {recentOpps.map((o) => (
              <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-medium">
                  <Link href={`/admin/opportunities/${o.id}`} className="hover:text-baraka">{o.title}</Link>
                </td>
                <td className="p-3 text-gray-600">{o.sector}</td>
                <td className="p-3"><Badge {...oppBadge(locale, o.state)} /></td>
                <td className="p-3 text-gray-600">{o._count.interests || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
