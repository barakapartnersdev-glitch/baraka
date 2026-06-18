// لوحة الإدارة: قائمة طلبات سفراء الاستثمار — فلترة بالحالة والبحث، وأعمدة حسب المواصفات.
import Link from "next/link";
import type { Prisma, AmbassadorAppStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { ALL_AMB_STATUSES, AMB_STATUS_TONE } from "@/lib/ambassador-form";

export const dynamic = "force-dynamic";

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

const selCls =
  "border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-baraka";

export default async function AmbassadorsListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole("ADMIN");
  const locale = await getLocale();
  const sp = await searchParams;

  const fStatus = one(sp.status);
  const q = one(sp.q).trim();

  const where: Prisma.AmbassadorApplicationWhereInput = {};
  if (ALL_AMB_STATUSES.includes(fStatus as AmbassadorAppStatus)) {
    where.status = fStatus as AmbassadorAppStatus;
  }
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { residenceCountry: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
    ];
  }

  const [apps, total] = await Promise.all([
    prisma.ambassadorApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { assignedTo: { select: { fullName: true } } },
    }),
    prisma.ambassadorApplication.count(),
  ]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{ta(locale, "admin.title")}</h1>
          <p className="text-gray-500 text-sm">{ta(locale, "admin.subtitle")}</p>
        </div>
        <span className="text-sm text-gray-600">
          {ta(locale, "admin.title")}: <span className="font-bold text-navy">{total}</span>
        </span>
      </div>

      {/* الفلاتر (GET) */}
      <form method="get" className="mb-5 flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-xl p-3">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder={ta(locale, "admin.filter.search")}
          className={`${selCls} flex-1 min-w-[220px] text-start`}
        />
        <select name="status" defaultValue={fStatus} className={selCls}>
          <option value="">{ta(locale, "admin.filter.all")}</option>
          {ALL_AMB_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ta(locale, `status.${s}`)}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-baraka text-white px-4 py-2 rounded-lg text-sm hover:bg-baraka-dark transition">
          {ta(locale, "admin.action.save")}
        </button>
        <Link href="/admin/ambassadors" className="text-sm text-gray-500 hover:text-gray-700 px-2">
          {ta(locale, "admin.filter.all")}
        </Link>
      </form>

      {apps.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">
          {ta(locale, "admin.empty")}
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-medium text-start">{ta(locale, "admin.col.date")}</th>
                <th className="p-3 font-medium text-start">{ta(locale, "admin.col.name")}</th>
                <th className="p-3 font-medium text-start">{ta(locale, "admin.col.country")}</th>
                <th className="p-3 font-medium text-start">{ta(locale, "admin.col.range")}</th>
                <th className="p-3 font-medium text-start">{ta(locale, "admin.col.status")}</th>
                <th className="p-3 font-medium text-start">{ta(locale, "admin.col.score")}</th>
                <th className="p-3 font-medium text-start">{ta(locale, "admin.col.assignee")}</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-gray-500" dir="ltr">
                    <Link href={`/admin/ambassadors/${a.id}`}>{fmtDate(a.createdAt)}</Link>
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/ambassadors/${a.id}`} className="font-semibold text-navy hover:text-baraka">
                      {a.fullName}
                    </Link>
                    <div className="text-xs text-gray-400" dir="ltr">{a.email}</div>
                  </td>
                  <td className="p-3 text-gray-600">{a.residenceCountry ?? "—"}</td>
                  <td className="p-3 text-gray-600">
                    {a.investmentRange ? ta(locale, `opt.range.${a.investmentRange}`) : "—"}
                  </td>
                  <td className="p-3">
                    <Badge label={ta(locale, `status.${a.status}`)} tone={AMB_STATUS_TONE[a.status] ?? "gray"} />
                  </td>
                  <td className="p-3 font-medium text-gray-700">{a.score}</td>
                  <td className="p-3 text-gray-600">
                    {a.assignedTo?.fullName ?? <span className="text-amber-600">—</span>}
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
