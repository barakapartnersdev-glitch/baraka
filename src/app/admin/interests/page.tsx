import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Badge from "@/components/Badge";
import { interestBadge } from "@/lib/states";
import InterestActions from "../opportunities/[id]/InterestActions";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function InterestsPage() {
  const locale = await getLocale();

  const interests = await prisma.interest.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { investor: true, opportunity: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{t(locale, "intList.title")}</h1>
      <p className="text-gray-500 text-sm mb-6">{t(locale, "intList.sub")}</p>

      {interests.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">
          {t(locale, "intList.empty")}
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-right">
              <tr>
                <th className="p-3 font-medium">{t(locale, "col.investor")}</th>
                <th className="p-3 font-medium">{t(locale, "col.opportunity")}</th>
                <th className="p-3 font-medium">{t(locale, "col.state")}</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {interests.map((it) => (
                <tr key={it.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">{it.investor.fullName}</td>
                  <td className="p-3">
                    <Link href={`/admin/opportunities/${it.opportunityId}`} className="text-gray-700 hover:text-baraka">
                      {it.opportunity.title}
                    </Link>
                  </td>
                  <td className="p-3"><Badge {...interestBadge(locale, it.status)} /></td>
                  <td className="p-3 text-left">
                    <InterestActions interestId={it.id} status={it.status} locale={locale} />
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
