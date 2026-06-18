import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { tc } from "@/lib/crm-i18n";
import {
  crmStatusBadge,
  crmPriorityBadge,
  statusesForType,
  leadTypeLabel,
  whatsappLink,
} from "@/lib/crm";
import LeadManage from "./LeadManage";
import AddNote from "./AddNote";
import LeadReadOnMount from "./LeadReadOnMount";
import ScheduleFollowup from "./ScheduleFollowup";
import MarkDoneButton from "../MarkDoneButton";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export default async function CrmLeadDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const locale = await getLocale();
  const { id } = await params;

  const lead = await prisma.crmLead.findUnique({
    where: { id },
    include: {
      relatedOpportunity: { select: { id: true, title: true, sector: true, country: true, state: true } },
      assignedTo: { select: { fullName: true } },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { fullName: true } } } },
      activityLogs: { orderBy: { createdAt: "desc" }, include: { actor: { select: { fullName: true } } } },
      followups: { orderBy: { followupAt: "asc" }, include: { assignedTo: { select: { fullName: true } } } },
    },
  });
  if (!lead) notFound();

  const now = Date.now();

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, fullName: true },
    orderBy: { fullName: "asc" },
  });

  const waNumber = lead.whatsapp || lead.phone;
  const roleLabel = lead.senderRole ? tc(locale, `senderRole.${lead.senderRole}`) : null;
  const prefLabel = lead.preferredContact ? tc(locale, `prefContact.${lead.preferredContact}`) : null;

  // صفّ بيانات: تسمية + قيمة (يُتخطّى الفارغ)
  const rows: { label: string; value: string | null; ltr?: boolean }[] = [
    { label: tc(locale, "field.email"), value: lead.email, ltr: true },
    { label: tc(locale, "field.phone"), value: lead.phone, ltr: true },
    { label: tc(locale, "field.whatsapp"), value: lead.whatsapp, ltr: true },
    { label: tc(locale, "field.country"), value: lead.country },
    { label: tc(locale, "field.city"), value: lead.city },
    { label: tc(locale, "field.company"), value: lead.companyName },
    { label: tc(locale, "field.senderRole"), value: roleLabel },
    { label: tc(locale, "field.budget"), value: lead.investmentBudget, ltr: true },
    { label: tc(locale, "field.prefContact"), value: prefLabel },
  ];

  return (
    <div>
      <LeadReadOnMount leadId={lead.id} alreadyRead={lead.isRead} />

      <Link href="/admin/crm" className="text-sm text-baraka hover:underline">
        {tc(locale, "detail.back")}
      </Link>

      {/* الرأس */}
      <div className="mb-6 mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-navy">{lead.fullName}</h1>
            {lead.isSpam && (
              <span className="text-xs bg-red-50 text-red-700 border border-red-200 rounded px-2 py-0.5">
                {tc(locale, "detail.spamBadge")}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500" dir="ltr">
            {lead.email}
            {lead.phone ? ` · ${lead.phone}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Badge {...crmStatusBadge(locale, lead.status)} />
          <Badge {...crmPriorityBadge(locale, lead.priority)} />
          <span className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1">
            {tc(locale, "detail.score")}: <span className="font-bold">{lead.leadScore}</span>
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-1 uppercase">{lead.languageCode}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الأساسي */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* أزرار التواصل السريع */}
          <div className="flex flex-wrap gap-2">
            {waNumber && (
              <a
                href={whatsappLink(waNumber)}
                target="_blank"
                rel="noreferrer"
                className="text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-2 hover:bg-green-100 transition"
              >
                {tc(locale, "detail.openWhatsapp")}
              </a>
            )}
            <a
              href={`mailto:${lead.email}`}
              className="text-sm bg-baraka-light text-baraka-dark border border-baraka/20 rounded-lg px-4 py-2 hover:bg-baraka-light/70 transition"
            >
              {tc(locale, "detail.sendEmail")}
            </a>
          </div>

          {/* معلومات التواصل */}
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <h2 className="border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-bold text-navy">
              {tc(locale, "detail.contactInfo")}
            </h2>
            <table className="w-full text-sm">
              <tbody>
                {rows.filter((r) => r.value).map((r, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <th className="w-2/5 bg-gray-50/50 px-4 py-2.5 text-start font-medium text-gray-600 align-top">{r.label}</th>
                    <td className="px-4 py-2.5 text-gray-800" dir={r.ltr ? "ltr" : undefined}>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* الفرصة المرتبطة */}
          {lead.relatedOpportunity && (
            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <h2 className="text-sm font-bold text-navy mb-2">{tc(locale, "detail.relatedOpp")}</h2>
              <p className="text-gray-800 font-medium">{lead.relatedOpportunity.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {lead.relatedOpportunity.sector} · {lead.relatedOpportunity.country}
              </p>
              <Link
                href={`/admin/opportunities/${lead.relatedOpportunity.id}`}
                className="inline-block mt-3 text-sm text-baraka hover:underline"
              >
                {tc(locale, "detail.viewOpp")} →
              </Link>
            </section>
          )}

          {/* الرسالة */}
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy mb-2">{tc(locale, "detail.message")}</h2>
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {lead.message || <span className="text-gray-400">{tc(locale, "detail.noMessage")}</span>}
            </p>
          </section>

          {/* الملاحظات والمتابعة */}
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy mb-3">{tc(locale, "detail.notes")}</h2>
            <AddNote leadId={lead.id} locale={locale} />
            <div className="mt-4 flex flex-col gap-3">
              {lead.notes.length === 0 ? (
                <p className="text-sm text-gray-400">{tc(locale, "detail.noNotes")}</p>
              ) : (
                lead.notes.map((n) => (
                  <div key={n.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-baraka-dark">{tc(locale, `noteType.${n.noteType}`)}</span>
                      <span className="text-xs text-gray-400" dir="ltr">{fmt(n.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{n.note}</p>
                    <p className="text-xs text-gray-400 mt-1">— {n.author.fullName}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* المتابعات */}
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy mb-3">{tc(locale, "followups.section")}</h2>
            <div className="flex flex-col gap-2">
              {lead.followups.length === 0 ? (
                <p className="text-sm text-gray-400">{tc(locale, "followups.noneOnLead")}</p>
              ) : (
                lead.followups.map((f) => {
                  const overdue = f.status === "pending" && f.followupAt.getTime() < now;
                  return (
                    <div key={f.id} className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg p-2.5 bg-gray-50/50">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-800">{tc(locale, `followupType.${f.followupType}`)}</span>
                          <span className="text-xs text-gray-400" dir="ltr">{fmt(f.followupAt)}</span>
                          {f.status === "done" ? (
                            <span className="text-xs text-green-700">{tc(locale, "followups.done")}</span>
                          ) : overdue ? (
                            <span className="text-xs text-red-600">{tc(locale, "followups.overdue")}</span>
                          ) : (
                            <span className="text-xs text-blue-600">{tc(locale, "followups.upcoming")}</span>
                          )}
                        </div>
                        {f.notes && <p className="text-xs text-gray-500 mt-0.5 truncate">{f.notes}</p>}
                      </div>
                      {f.status === "pending" && <MarkDoneButton followupId={f.id} locale={locale} />}
                    </div>
                  );
                })
              )}
            </div>
            <ScheduleFollowup leadId={lead.id} locale={locale} />
          </section>

          {/* سجل النشاط */}
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy mb-3">{tc(locale, "detail.activity")}</h2>
            {lead.activityLogs.length === 0 ? (
              <p className="text-sm text-gray-400">{tc(locale, "detail.noActivity")}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {lead.activityLogs.map((a) => (
                  <li key={a.id} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-baraka/60 shrink-0" />
                    <div>
                      <span className="text-gray-800">{tc(locale, `act.${a.actionType}`)}</span>
                      {a.actionType === "status_change" && a.newValue && (
                        <span className="text-gray-500">
                          {" "}
                          ({a.oldValue ? tc(locale, `crmStatus.${a.oldValue}`) : "—"} → {tc(locale, `crmStatus.${a.newValue}`)})
                        </span>
                      )}
                      {a.actionType === "priority_change" && a.newValue && (
                        <span className="text-gray-500">
                          {" "}
                          ({a.oldValue ? tc(locale, `crmPriority.${a.oldValue}`) : "—"} → {tc(locale, `crmPriority.${a.newValue}`)})
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {" · "}
                        {a.actor?.fullName ?? "—"}
                        {" · "}
                        <span dir="ltr">{fmt(a.createdAt)}</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* العمود الجانبي: التحكّم + البيانات التقنية */}
        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <LeadManage
              leadId={lead.id}
              locale={locale}
              statuses={statusesForType(lead.leadType)}
              status={lead.status}
              priority={lead.priority}
              assigneeId={lead.assignedToId}
              department={lead.department}
              isRead={lead.isRead}
              isSpam={lead.isSpam}
              admins={admins}
            />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
            <h2 className="text-sm font-bold text-navy mb-3">{tc(locale, "detail.meta")}</h2>
            <dl className="flex flex-col gap-2 text-gray-600">
              <div className="flex justify-between gap-2">
                <dt className="text-gray-400">{leadTypeLabel(locale, lead.leadType)}</dt>
                <dd>{lead.source}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-400">{tc(locale, "detail.createdAt")}</dt>
                <dd dir="ltr">{fmt(lead.createdAt)}</dd>
              </div>
              {lead.ipAddress && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-400">{tc(locale, "detail.ip")}</dt>
                  <dd dir="ltr">{lead.ipAddress}</dd>
                </div>
              )}
            </dl>
            {lead.userAgent && (
              <p className="mt-2 text-xs text-gray-400 break-all" dir="ltr">{lead.userAgent}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
