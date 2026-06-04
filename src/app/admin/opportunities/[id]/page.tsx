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
        <h2 className="text-base font-bold mb-2 flex items-center gap-2">
          {t(locale, "ownerEditor.sourceTitle")}
          <span className="text-xs font-normal text-red-600 bg-red-50 px-2 py-0.5 rounded">
            {t(locale, "adminOpp.adminOnlyTag")}
          </span>
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
          <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(opp.sourceData, null, 2)}</pre>
        </div>
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
