import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { tc } from "@/lib/crm-i18n";
import MarkDoneButton from "../MarkDoneButton";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export default async function FollowupsPage() {
  await requireRole("ADMIN");
  const locale = await getLocale();
  const now = Date.now();

  const followups = await prisma.crmFollowup.findMany({
    where: { status: "pending" },
    orderBy: { followupAt: "asc" },
    take: 200,
    include: {
      lead: { select: { id: true, fullName: true } },
      assignedTo: { select: { fullName: true } },
    },
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{tc(locale, "followups.title")}</h1>
          <p className="text-gray-500 text-sm">{tc(locale, "followups.sub")}</p>
        </div>
        <Link href="/admin/crm" className="text-sm text-baraka hover:underline">
          {tc(locale, "reports.backToList")}
        </Link>
      </div>

      {followups.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">
          {tc(locale, "followups.empty")}
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-medium text-start">{tc(locale, "followups.when")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "followups.type")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "followups.lead")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "followups.assignee")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "followups.status")}</th>
                <th className="p-3 font-medium text-start"></th>
              </tr>
            </thead>
            <tbody>
              {followups.map((f) => {
                const overdue = f.followupAt.getTime() < now;
                return (
                  <tr key={f.id} className={`border-t border-gray-100 hover:bg-gray-50 ${overdue ? "bg-red-50/40" : ""}`}>
                    <td className="p-3 text-gray-600" dir="ltr">{fmt(f.followupAt)}</td>
                    <td className="p-3 text-gray-700">{tc(locale, `followupType.${f.followupType}`)}</td>
                    <td className="p-3">
                      <Link href={`/admin/crm/${f.lead.id}`} className="text-gray-800 hover:text-baraka">
                        {f.lead.fullName}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-600">{f.assignedTo?.fullName ?? "—"}</td>
                    <td className="p-3">
                      {overdue ? (
                        <span className="text-xs text-red-600">{tc(locale, "followups.overdue")}</span>
                      ) : (
                        <span className="text-xs text-blue-600">{tc(locale, "followups.upcoming")}</span>
                      )}
                    </td>
                    <td className="p-3 text-end">
                      <MarkDoneButton followupId={f.id} locale={locale} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
