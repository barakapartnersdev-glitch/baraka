import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/PublicHeader";
import VersionView from "@/components/VersionView";
import OpportunityGallery from "@/components/OpportunityGallery";
import { toVersion } from "@/lib/opportunity";
import { getLocale } from "@/lib/i18n-server";
import { t, localeHref, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { localizeOppVersion, localizeOppSector, localizeOppCountry, localizeOppCity, parseOppTranslations } from "@/lib/opp-i18n";
import { pageMetadata, clampDescription, opportunityLd, organizationLd, breadcrumbLd, absUrl } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import InterestLeadForm from "./InterestLeadForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: raw, id } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const opp = await prisma.opportunity.findFirst({
    where: { id, state: "PUBLISHED" },
    select: { sector: true, country: true, publicVersion: true, translations: true },
  });
  if (!opp) {
    return { title: "Baraka Partners", robots: { index: false, follow: false } };
  }
  const tr = parseOppTranslations(opp.translations);
  const pv = localizeOppVersion(toVersion(opp.publicVersion), tr, locale);
  const sector = localizeOppSector(opp.sector, tr, locale);
  const country = localizeOppCountry(opp.country, tr, locale);
  const title = pv?.displayTitle || `${t(locale, "opp.inSector")} ${sector}`;
  const description = clampDescription(
    pv?.summary || `${title} — ${sector} · ${country}`
  );
  return pageMetadata({
    locale,
    path: `/opportunities/${id}`,
    title: `${title} | Baraka Partners`,
    description,
    image: pv?.imageUrl || null,
  });
}

export default async function PublicOpportunityDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();

  // النسخة العامة فقط — لا بيانات مصدر ولا هوية ولا نسخ أخرى
  const opp = await prisma.opportunity.findFirst({
    where: { id, state: "PUBLISHED" },
    select: {
      id: true,
      sector: true,
      country: true,
      city: true,
      currency: true,
      investmentMin: true,
      investmentMax: true,
      publicVersion: true,
      translations: true,
      publishedAt: true,
    },
  });
  if (!opp) notFound();

  // النسخة العامة مترجمة حسب لغة الزائر (العنوان/الملخّص/النقاط/التفاصيل)
  const tr = parseOppTranslations(opp.translations);
  const pv = localizeOppVersion(toVersion(opp.publicVersion), tr, locale);
  const localSector = localizeOppSector(opp.sector, tr, locale);
  const localCountry = localizeOppCountry(opp.country, tr, locale);
  const title = pv?.displayTitle || `${t(locale, "opp.inSector")} ${localSector}`;
  const range =
    opp.investmentMin || opp.investmentMax
      ? `${opp.investmentMin ? Number(opp.investmentMin).toLocaleString("en-US") : "?"} – ${
          opp.investmentMax ? Number(opp.investmentMax).toLocaleString("en-US") : "?"
        } ${opp.currency}`
      : null;

  const url = absUrl(`/${locale}/opportunities/${opp.id}`);
  const lpv = pv; // النسخة المترجمة نفسها (محسوبة أعلاه)
  const jsonLd = [
    organizationLd(),
    breadcrumbLd([
      { name: t(locale, "brand"), url: absUrl(`/${locale}`) },
      { name: t(locale, "nav.opportunities"), url: absUrl(`/${locale}/opportunities`) },
      { name: lpv?.displayTitle || title, url },
    ]),
    opportunityLd({
      title: lpv?.displayTitle || title,
      description: lpv?.summary,
      url,
      sector: localSector,
      country: localCountry,
      image: lpv?.imageUrl ?? null,
      priceMin: opp.investmentMin ? Number(opp.investmentMin) : null,
      priceMax: opp.investmentMax ? Number(opp.investmentMax) : null,
      currency: opp.currency,
      datePublished: opp.publishedAt,
    }),
  ];

  return (
    <div className="min-h-screen">
      <JsonLd data={jsonLd} />
      <PublicHeader />
      <main className="max-w-3xl mx-auto p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <Link href={localeHref(locale, "/opportunities")} className="text-sm text-baraka hover:underline">
            {t(locale, "opp.back")}
          </Link>
          <ShareButton url={url} title={title} locale={locale} />
        </div>
        <h1 className="text-2xl font-bold mt-2 mb-2">{title}</h1>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <span className="bg-gray-100 px-2 py-0.5 rounded">{localSector}</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded">{localCountry}</span>
          {opp.city && (
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              {localizeOppCity(opp.city, tr, locale)}
            </span>
          )}
          {range && (
            <span className="bg-baraka-light text-baraka-dark px-2 py-0.5 rounded">
              {range}
            </span>
          )}
        </div>

        {/* معرض صور معبّر (إن وُجد) — صور إقليمية حرّة الاستخدام، محايدة لغوياً */}
        {pv?.gallery && pv.gallery.length > 0 && (
          <OpportunityGallery images={pv.gallery} alt={lpv?.displayTitle || title} />
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <VersionView data={pv} locale={locale} />
        </div>

        {/* نموذج طلب الاهتمام العام (CRM) — يلتقط المهتمين كـ leads في لوحة الإدارة */}
        <InterestLeadForm opportunityId={opp.id} locale={locale} />

        {/* تلميح للمستثمر المسجّل */}
        <p className="mt-4 text-center text-xs text-gray-400">
          {t(locale, "opp.loginPrompt")}{" "}
          <Link href="/login" className="text-baraka hover:underline">
            {t(locale, "home.login")}
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
