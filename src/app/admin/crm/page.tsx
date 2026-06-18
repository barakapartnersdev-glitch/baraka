import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { LOCALES, type Locale } from "@/lib/i18n";
import { tc } from "@/lib/crm-i18n";
import {
  ALL_STATUSES,
  LEAD_TYPES,
  crmStatusBadge,
  crmPriorityBadge,
  leadTypeLabel,
} from "@/lib/crm";

export const dynamic = "force-dynamic";

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

const selCls =
  "border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-baraka";

export default async function CrmListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole("ADMIN");
  const locale = await getLocale();
  const sp = await searchParams;

  const fType = one(sp.type);
  const fStatus = one(sp.status);
  const fLang = one(sp.lang);
  const fUnread = one(sp.unread) === "1";
  const fSpam = one(sp.spam) === "1";
  const q = one(sp.q).trim();

  const where: Prisma.CrmLeadWhereInput = {};
  if (LEAD_TYPES.includes(fType as never)) where.leadType = fType as never;
  if (ALL_STATUSES.includes(fStatus)) where.status = fStatus;
  if (LOCALES.includes(fLang as Locale)) where.languageCode = fLang;
  if (fUnread) where.isRead = false;
  where.isSpam = fSpam ? true : false;
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { whatsapp: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
    ];
  }

  const [leads, total, unreadCount] = await Promise.all([
    prisma.crmLead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        relatedOpportunity: { select: { id: true, title: true } },
        assignedTo: { select: { fullName: true } },
      },
    }),
    prisma.crmLead.count({ where: { isSpam: false } }),
    prisma.crmLead.count({ where: { isSpam: false, isRead: false } }),
  ]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{tc(locale, "admin.title")}</h1>
          <p className="text-gray-500 text-sm">{tc(locale, "admin.sub")}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <Link href="/admin/crm/followups" className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
              {tc(locale, "followups.nav")}
            </Link>
            <Link href="/admin/crm/reports" className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
              {tc(locale, "reports.nav")}
            </Link>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-600">
              {tc(locale, "admin.total")}: <span className="font-bold text-navy">{total}</span>
            </span>
            <span className="text-gray-600">
              {tc(locale, "admin.unreadOnly")}: <span className="font-bold text-baraka">{unreadCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* الفلاتر والبحث (GET) */}
      <form method="get" className="mb-5 flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-xl p-3">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder={tc(locale, "admin.searchPh")}
          className={`${selCls} flex-1 min-w-[220px] text-start`}
        />
        <select name="type" defaultValue={fType} className={selCls}>
          <option value="">{tc(locale, "admin.filterType")}</option>
          {LEAD_TYPES.map((tp) => (
            <option key={tp} value={tp}>
              {leadTypeLabel(locale, tp)}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={fStatus} className={selCls}>
          <option value="">{tc(locale, "admin.filterStatus")}</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {tc(locale, `crmStatus.${s}`)}
            </option>
          ))}
        </select>
        <select name="lang" defaultValue={fLang} className={selCls}>
          <option value="">{tc(locale, "admin.filterLang")}</option>
          {LOCALES.map((l) => (
            <option key={l} value={l}>
              {tc(locale, `lang.${l}`)}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-gray-700 px-2">
          <input type="checkbox" name="unread" value="1" defaultChecked={fUnread} />
          {tc(locale, "admin.unreadOnly")}
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-700 px-2">
          <input type="checkbox" name="spam" value="1" defaultChecked={fSpam} />
          {tc(locale, "crmStatus.SPAM")}
        </label>
        <button type="submit" className="bg-baraka text-white px-4 py-2 rounded-lg text-sm hover:bg-baraka-dark transition">
          {tc(locale, "admin.apply")}
        </button>
        <Link href="/admin/crm" className="text-sm text-gray-500 hover:text-gray-700 px-2">
          {tc(locale, "admin.clear")}
        </Link>
      </form>

      {leads.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">
          {tc(locale, "admin.empty")}
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-start">
              <tr className="text-start">
                <th className="p-3 font-medium text-start">{tc(locale, "admin.col.date")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "admin.col.name")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "admin.col.type")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "admin.col.country")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "admin.col.opp")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "admin.col.status")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "admin.col.priority")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "admin.col.assigned")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "admin.col.lang")}</th>
                <th className="p-3 font-medium text-start">{tc(locale, "admin.col.score")}</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className={`border-t border-gray-100 hover:bg-gray-50 ${l.isRead ? "" : "bg-baraka-light/40"}`}>
                  <td className="p-3 text-gray-500" dir="ltr">
                    <Link href={`/admin/crm/${l.id}`} className="flex items-center gap-2">
                      {!l.isRead && <span className="inline-block h-2 w-2 rounded-full bg-baraka shrink-0" />}
                      {fmtDate(l.createdAt)}
                    </Link>
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/crm/${l.id}`} className={`hover:text-baraka ${l.isRead ? "text-gray-800" : "font-semibold text-navy"}`}>
                      {l.fullName}
                    </Link>
                    <div className="text-xs text-gray-400" dir="ltr">{l.email}</div>
                  </td>
                  <td className="p-3 text-gray-600">{leadTypeLabel(locale, l.leadType)}</td>
                  <td className="p-3 text-gray-600">{l.country ?? "—"}</td>
                  <td className="p-3 text-gray-600 max-w-[160px] truncate">
                    {l.relatedOpportunity ? l.relatedOpportunity.title : "—"}
                  </td>
                  <td className="p-3"><Badge {...crmStatusBadge(locale, l.status)} /></td>
                  <td className="p-3"><Badge {...crmPriorityBadge(locale, l.priority)} /></td>
                  <td className="p-3 text-gray-600">{l.assignedTo?.fullName ?? <span className="text-amber-600">{tc(locale, "admin.unassigned")}</span>}</td>
                  <td className="p-3 text-gray-500 uppercase">{l.languageCode}</td>
                  <td className="p-3 text-gray-700 font-medium">{l.leadScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
