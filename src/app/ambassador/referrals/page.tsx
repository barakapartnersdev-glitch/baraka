// بوّابة السفير: قائمة «ترشيحاتي».
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { REF_STATUS_TONE } from "@/lib/ambassador-form";

export const dynamic = "force-dynamic";

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function ReferralsPage() {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const t = (k: string) => ta(locale, k);

  const refs = await prisma.ambassadorReferral.findMany({
    where: { ambassadorUserId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t("ref.title")}</h1>
          <p className="text-gray-500 text-sm">{t("ref.subtitle")}</p>
        </div>
        <Link
          href="/ambassador/referrals/new"
          className="rounded-lg bg-baraka text-white px-5 py-2.5 text-sm font-medium hover:bg-baraka-dark transition"
        >
          {t("ref.new")}
        </Link>
      </div>

      {refs.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">{t("ref.empty")}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-medium text-start">{t("ref.col.investor")}</th>
                <th className="p-3 font-medium text-start">{t("ref.col.country")}</th>
                <th className="p-3 font-medium text-start">{t("ref.col.range")}</th>
                <th className="p-3 font-medium text-start">{t("ref.col.date")}</th>
                <th className="p-3 font-medium text-start">{t("ref.col.status")}</th>
              </tr>
            </thead>
            <tbody>
              {refs.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="p-3">
                    <span className="font-medium text-gray-800">{r.investorName}</span>
                    {r.investorCompany && <div className="text-xs text-gray-400">{r.investorCompany}</div>}
                  </td>
                  <td className="p-3 text-gray-600">{r.investorCountry ?? "—"}</td>
                  <td className="p-3 text-gray-600">
                    {r.investmentRange ? t(`opt.range.${r.investmentRange}`) : "—"}
                  </td>
                  <td className="p-3 text-gray-500" dir="ltr">{fmtDate(r.createdAt)}</td>
                  <td className="p-3">
                    <Badge label={t(`refStatus.${r.status}`)} tone={REF_STATUS_TONE[r.status] ?? "gray"} />
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
