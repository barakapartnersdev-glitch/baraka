import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { oppBadge, interestBadge } from "@/lib/states";
import type { VersionData, VersionKey } from "@/lib/opportunity";
import StateActions from "./StateActions";
import VersionsEditor from "./VersionsEditor";
import MissingItems from "./MissingItems";
import InterestActions from "./InterestActions";
import FilesManager from "./FilesManager";
import { buildReport, extractAnswers } from "@/lib/opportunity-report";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function asVersion(value: unknown): VersionData | null {
  return value && typeof value === "object" ? (value as VersionData) : null;
}

export default async function OpportunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale();
  const dateLocale = locale === "ar" ? "ar" : "en";

  const opp = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      owner: true,
      missingItems: { orderBy: { createdAt: "asc" } },
      interests: { include: { investor: true }, orderBy: { createdAt: "desc" } },
      files: true,
    },
  });
  if (!opp) notFound();

  const logs = await prisma.activityLog.findMany({
    where: { entityType: "Opportunity", entityId: id },
    include: { actor: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const versions: Record<VersionKey, VersionData | null> = {
    publicVersion: asVersion(opp.publicVersion),
    investorVersion: asVersion(opp.investorVersion),
    postNcndaVersion: asVersion(opp.postNcndaVersion),
  };

  const reportSections = buildReport(extractAnswers(opp.sourceData), "full");
  const hasForm = reportSections.length > 0;
  const reportUrl = (v: "full" | "investor", format: string) =>
    `/admin/opportunities/${opp.id}/report?v=${v}&format=${format}`;

  return (
    <div>
      <Link href="/admin/opportunities" className="text-sm text-baraka hover:underline">
        {t(locale, "adminOpp.back")}
      </Link>
      <div className="flex items-start justify-between mt-2 mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">{opp.title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {opp.sector} · {opp.country} · {t(locale, "adminOpp.ownerLabel")} {opp.owner.fullName}
          </p>
        </div>
        <Badge {...oppBadge(locale, opp.state)} />
      </div>

      <section className="mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-base font-bold mb-3">{t(locale, "adminOpp.governance")}</h2>
          <StateActions id={opp.id} state={opp.state} locale={locale} />
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-bold">
            بيانات النموذج المقدّم
            <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-normal text-red-600">
              {t(locale, "adminOpp.adminOnlyTag")}
            </span>
          </h2>
          {hasForm && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-gray-400">تنزيل:</span>
              <a href={reportUrl("full", "html")} target="_blank" rel="noreferrer" className="rounded-lg bg-navy px-2.5 py-1.5 font-semibold text-white transition hover:bg-navy-600">كامل · PDF</a>
              <a href={reportUrl("full", "doc")} className="rounded-lg border border-navy/30 px-2.5 py-1.5 font-semibold text-navy transition hover:bg-baraka-light">كامل · Word</a>
              <a href={reportUrl("full", "md")} className="rounded-lg border border-navy/30 px-2.5 py-1.5 font-semibold text-navy transition hover:bg-baraka-light">Markdown (للذكاء الصناعي)</a>
              <span className="mx-1 text-gray-300">|</span>
              <a href={reportUrl("investor", "html")} target="_blank" rel="noreferrer" className="rounded-lg bg-gradient-to-br from-gold to-gold-soft px-2.5 py-1.5 font-semibold text-navy transition hover:brightness-110">مستثمر · PDF</a>
              <a href={reportUrl("investor", "doc")} className="rounded-lg border border-gold/50 px-2.5 py-1.5 font-semibold text-navy transition hover:bg-gold/10">مستثمر · Word</a>
            </div>
          )}
        </div>
        {hasForm ? (
          <div className="flex flex-col gap-4">
            {reportSections.map((s) => (
              <div key={s.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <h3 className="border-b border-gray-100 bg-navy/[0.04] px-4 py-2.5 text-sm font-bold text-navy">{s.title}</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {s.fields.map((f, i) => (
                      <tr key={i} className="border-t border-gray-100 first:border-t-0">
                        <th className="w-2/5 bg-gray-50/60 p-3 text-start align-top font-semibold text-gray-600">{f.label}</th>
                        <td className="whitespace-pre-wrap p-3 text-gray-800">{f.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
            <p className="mb-2">لم يُقدَّم نموذج تفصيلي لهذه الفرصة (بيانات مصدر قديمة):</p>
            <pre className="whitespace-pre-wrap font-sans text-xs text-gray-600">{JSON.stringify(opp.sourceData, null, 2)}</pre>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-1">{t(locale, "adminOpp.versionsTitle")}</h2>
        <p className="text-xs text-gray-500 mb-3">{t(locale, "adminOpp.versionsNote")}</p>
        <VersionsEditor id={opp.id} versions={versions} locale={locale} />
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">{t(locale, "adminOpp.filesTitle")}</h2>
        <FilesManager
          opportunityId={opp.id}
          files={opp.files.map((f) => ({
            id: f.id,
            fileName: f.fileName,
            visibility: f.visibility,
            approved: f.approved,
          }))}
          locale={locale}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">{t(locale, "adminOpp.missingTitle")}</h2>
        <MissingItems
          opportunityId={opp.id}
          items={opp.missingItems.map((m) => ({
            id: m.id,
            description: m.description,
            resolved: m.resolved,
          }))}
          locale={locale}
        />
      </section>

      <section>
        <h2 className="text-base font-bold mb-3">{t(locale, "adminOpp.interestedTitle")}</h2>
        {opp.interests.length === 0 ? (
          <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">
            {t(locale, "adminOpp.noInterests")}
          </p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-right">
                <tr>
                  <th className="p-3 font-medium">{t(locale, "col.investor")}</th>
                  <th className="p-3 font-medium">{t(locale, "col.state")}</th>
                  <th className="p-3 font-medium">{t(locale, "col.signedDate")}</th>
                  <th className="p-3 font-medium">{t(locale, "col.action")}</th>
                </tr>
              </thead>
              <tbody>
                {opp.interests.map((it) => (
                  <tr key={it.id} className="border-t border-gray-100">
                    <td className="p-3">{it.investor.fullName}</td>
                    <td className="p-3"><Badge {...interestBadge(locale, it.status)} /></td>
                    <td className="p-3 text-gray-500 text-xs">
                      {it.ncndaSignedAt ? new Date(it.ncndaSignedAt).toLocaleDateString(dateLocale) : "—"}
                    </td>
                    <td className="p-3"><InterestActions interestId={it.id} status={it.status} locale={locale} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-bold mb-3">{t(locale, "adminOpp.activityLog")}</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">
            {t(locale, "adminOpp.noActivity")}
          </p>
        ) : (
          <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {logs.map((l) => (
              <li key={l.id} className="p-3 flex items-center justify-between text-sm">
                <span className="text-gray-700">{t(locale, `audit.${l.action}`)}</span>
                <span className="text-xs text-gray-400">
                  {l.actor.fullName} · {new Date(l.createdAt).toLocaleString(dateLocale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
