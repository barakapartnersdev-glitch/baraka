import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import OpportunityCard, { type OpportunityCardData } from "@/components/OpportunityCard";
import { toVersion } from "@/lib/opportunity";
import { localizeVersion, localizeTerm, SECTOR_I18N, COUNTRY_I18N } from "@/lib/opp-i18n";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function fmtRange(min: bigint | null, max: bigint | null, cur: string) {
  if (!min && !max) return null;
  const f = (n: bigint) => Number(n).toLocaleString("en-US");
  return `${min ? f(min) : "?"} – ${max ? f(max) : "?"} ${cur}`;
}

export default async function PublicOpportunities() {
  const locale = await getLocale();

  // الفرص المنشورة فقط — النسخة العامة فقط
  const opps = await prisma.opportunity.findMany({
    where: { state: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      sector: true,
      country: true,
      currency: true,
      investmentMin: true,
      investmentMax: true,
      publicVersion: true,
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-5xl mx-auto p-6 md:p-8 w-full">
        <h1 className="text-2xl font-bold mb-1">{t(locale, "opps.title")}</h1>
        <p className="text-gray-500 text-sm mb-6">{t(locale, "opps.sub")}</p>

        {opps.length === 0 ? (
          <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-6 text-center">
            {t(locale, "opps.empty")}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {opps.map((o) => {
              const pv = localizeVersion(toVersion(o.publicVersion), locale);
              const localSector = localizeTerm(SECTOR_I18N, o.sector, locale);
              const data: OpportunityCardData = {
                id: o.id,
                href: `/opportunities/${o.id}`,
                title: pv?.displayTitle || `${t(locale, "opp.inSector")} ${localSector}`,
                summary: pv?.summary,
                sector: localSector,
                country: localizeTerm(COUNTRY_I18N, o.country, locale),
                range: fmtRange(o.investmentMin, o.investmentMax, o.currency),
                imageUrl: pv?.imageUrl ?? null,
              };
              return <OpportunityCard key={o.id} data={data} locale={locale} />;
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
