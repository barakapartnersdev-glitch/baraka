import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getAccountStatus } from "@/lib/account";
import Badge from "@/components/Badge";
import { oppBadge } from "@/lib/states";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function OwnerHome() {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();
  const verified = (await getAccountStatus(session.userId)) === "ACTIVE";

  // فرص المالك الحالي فقط — لا يرى فرص غيره
  const opps = await prisma.opportunity.findMany({
    where: { ownerId: session.userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { missingItems: { where: { resolved: false } } } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t(locale, "ownerHome.title")}</h1>
          <p className="text-gray-500 text-sm">{t(locale, "ownerHome.sub")}</p>
        </div>
        {verified && (
          <Link
            href="/owner/opportunities/new"
            className="bg-baraka text-white text-sm px-4 py-2 rounded-lg hover:bg-baraka-dark transition shrink-0"
          >
            {t(locale, "ownerHome.new")}
          </Link>
        )}
      </div>

      {!verified && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
          {t(locale, "ownerHome.pendingNote")}
        </p>
      )}

      {opps.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-6 text-center">
          {verified ? t(locale, "ownerHome.emptyVerified") : t(locale, "ownerHome.empty")}
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-right">
              <tr>
                <th className="p-3 font-medium">{t(locale, "col.title")}</th>
                <th className="p-3 font-medium">{t(locale, "col.sector")}</th>
                <th className="p-3 font-medium">{t(locale, "col.state")}</th>
                <th className="p-3 font-medium">{t(locale, "col.pendingItems")}</th>
              </tr>
            </thead>
            <tbody>
              {opps.map((o) => (
                <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    <Link
                      href={`/owner/opportunities/${o.id}`}
                      className="hover:text-baraka"
                    >
                      {o.title}
                    </Link>
                  </td>
                  <td className="p-3 text-gray-600">{o.sector}</td>
                  <td className="p-3">
                    <Badge {...oppBadge(locale, o.state)} />
                  </td>
                  <td className="p-3 text-gray-600">
                    {o._count.missingItems > 0 ? (
                      <span className="text-amber-600">{o._count.missingItems}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
