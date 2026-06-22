import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/PublicHeader";
import OpportunityShowcase, { type ShowcaseData } from "@/components/OpportunityShowcase";
import { toVersion } from "@/lib/opportunity";
import { getLocale } from "@/lib/i18n-server";
import { t, localeHref, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { localizeOppVersion, localizeOppSector, localizeOppCountry, localizeOppCity, parseOppTranslations } from "@/lib/opp-i18n";
import { illustrativeImages } from "@/lib/sector-image";
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

  // معرض الصور: صور الفرصة إن وُجدت، وإلا صور تعبيرية للقطاع (قسم خفيف دائم الظهور)
  const hasGallery = !!(pv?.gallery && pv.gallery.length > 0);
  const galleryImages = hasGallery ? pv!.gallery! : illustrativeImages(opp.sector);

  const showcaseData: ShowcaseData = {
    title,
    summary: pv?.summary,
    details: pv?.details,
    highlights: pv?.highlights,
    imageUrl: pv?.imageUrl ?? null,
    gallery: galleryImages,
    galleryIllustrative: !hasGallery,
    sector: localSector,
    country: localCountry,
    city: opp.city ? localizeOppCity(opp.city, tr, locale) : null,
    range,
    annualReturn: pv?.annualReturn,
    paybackPeriod: pv?.paybackPeriod,
  };

  return (
    <div className="min-h-screen">
      <JsonLd data={jsonLd} />
      <PublicHeader />
      <OpportunityShowcase
        locale={locale}
        data={showcaseData}
        backHref={localeHref(locale, "/opportunities")}
        shareSlot={<ShareButton url={url} title={title} locale={locale} />}
        leadSlot={<InterestLeadForm opportunityId={opp.id} locale={locale} />}
      />
      <Footer />
    </div>
  );
}
