import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { oppBadge } from "@/lib/states";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function fmt(min: bigint | null, max: bigint | null, cur: string) {
  if (!min && !max) return "—";
  const f = (n: bigint) => Number(n).toLocaleString("en-US");
  return `${min ? f(min) : "?"} – ${max ? f(max) : "?"} ${cur}`;
}

export default async function OpportunitiesPage() {
  const locale = await getLocale();

  const opps = await prisma.opportunity.findMany({
    orderBy: { updatedAt: "desc" },
    include: { owner: true, _count: { select: { interests: true, missingItems: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{t(locale, "oppsList.title")}</h1>
      <p className="text-gray-500 text-sm mb-6">{t(locale, "oppsList.sub")}</p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-right">
            <tr>
              <th className="p-3 font-medium">{t(locale, "col.opportunity")}</th>
              <th className="p-3 font-medium">{t(locale, "col.sector")}</th>
              <th className="p-3 font-medium">{t(locale, "col.country")}</th>
              <th className="p-3 font-medium">{t(locale, "col.range")}</th>
              <th className="p-3 font-medium">{t(locale, "col.state")}</th>
              <th className="p-3 font-medium">{t(locale, "col.interested")}</th>
            </tr>
          </thead>
          <tbody>
            {opps.map((o) => (
              <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-medium">
                  <Link href={`/admin/opportunities/${o.id}`} className="hover:text-baraka">{o.title}</Link>
                  {o._count.missingItems > 0 && (
                    <span className="mr-2 text-xs text-amber-600">
                      ({o._count.missingItems} {t(locale, "items.missingShort")})
                    </span>
                  )}
                </td>
                <td className="p-3 text-gray-600">{o.sector}</td>
                <td className="p-3 text-gray-600">{o.country}</td>
                <td className="p-3 text-gray-600 text-xs">{fmt(o.investmentMin, o.investmentMax, o.currency)}</td>
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
