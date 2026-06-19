// لوحة الإدارة: كل ترشيحات المستثمرين من السفراء + تغيير الحالة.
import Link from "next/link";
import { requirePageCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import StatusSelect from "./StatusSelect";
import PromoteButton from "./PromoteButton";

export const dynamic = "force-dynamic";

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function AdminReferralsPage() {
  await requirePageCapability("referrals");
  const locale = await getLocale();
  const t = (k: string) => ta(locale, k);

  const refs = await prisma.ambassadorReferral.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { ambassadorUser: { select: { fullName: true } } },
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t("admin.referrals.title")}</h1>
        <Link href="/admin/ambassadors" className="text-sm text-gray-500 hover:text-gray-700">
          {t("nav.ambassadors")}
        </Link>
      </div>

      {refs.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">
          {t("admin.referrals.empty")}
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-medium text-start">{t("ref.col.investor")}</th>
                <th className="p-3 font-medium text-start">{t("admin.referrals.byAmbassador")}</th>
                <th className="p-3 font-medium text-start">{t("ref.col.country")}</th>
                <th className="p-3 font-medium text-start">{t("ref.col.range")}</th>
                <th className="p-3 font-medium text-start">{t("ref.col.date")}</th>
                <th className="p-3 font-medium text-start">{t("ref.col.status")}</th>
                <th className="p-3 font-medium text-start"></th>
              </tr>
            </thead>
            <tbody>
              {refs.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="p-3">
                    <span className="font-medium text-gray-800">{r.investorName}</span>
                    {r.contactEmail && <div className="text-xs text-gray-400" dir="ltr">{r.contactEmail}</div>}
                  </td>
                  <td className="p-3 text-gray-600">{r.ambassadorUser?.fullName ?? "—"}</td>
                  <td className="p-3 text-gray-600">{r.investorCountry ?? "—"}</td>
                  <td className="p-3 text-gray-600">{r.investmentRange ? t(`opt.range.${r.investmentRange}`) : "—"}</td>
                  <td className="p-3 text-gray-500" dir="ltr">{fmtDate(r.createdAt)}</td>
                  <td className="p-3">
                    <StatusSelect id={r.id} locale={locale} status={r.status} />
                  </td>
                  <td className="p-3">
                    <PromoteButton id={r.id} locale={locale} hasLead={!!r.crmLeadId} />
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
