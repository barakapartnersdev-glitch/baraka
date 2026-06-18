import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import OpportunityCard, { type OpportunityCardData } from "@/components/OpportunityCard";
import DestinationLeadForm from "./DestinationLeadForm";
import { toVersion } from "@/lib/opportunity";
import { localizeVersion, localizeTerm, SECTOR_I18N, COUNTRY_I18N } from "@/lib/opp-i18n";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { destUi } from "@/lib/dest-i18n";
import {
  getDestinationBySlug,
  getDestinationOpportunities,
  destPath,
  hubPath,
  absUrl,
  strArr,
  faqArr,
  buildLanguageAlternates,
  breadcrumbLd,
  webPageLd,
  faqPageLd,
  organizationLd,
  jsonLdScript,
} from "@/lib/destinations";

export const dynamic = "force-dynamic";

type Params = { locale: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const tr = await getDestinationBySlug(locale, slug);
  if (!tr) return {};

  const url = absUrl(destPath(locale, slug));
  const title = tr.seoTitle || tr.pageTitle || tr.h1Title;
  const description = tr.metaDescription || tr.introText || undefined;
  const keywords = [tr.focusKeyword, ...strArr(tr.secondaryKeywords)]
    .filter(Boolean)
    .join(", ");
  const images = tr.ogImage
    ? [tr.ogImage]
    : tr.destination.featuredImage
      ? [tr.destination.featuredImage]
      : undefined;

  return {
    title,
    description,
    keywords: keywords || undefined,
    alternates: {
      canonical: tr.canonicalUrl || url,
      languages: buildLanguageAlternates(tr.destination.translations),
    },
    robots: { index: tr.robotsIndex, follow: tr.robotsFollow },
    openGraph: {
      title: tr.ogTitle || title,
      description: tr.ogDescription || description,
      url,
      siteName: "Baraka Partners",
      locale,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: tr.twitterTitle || tr.ogTitle || title,
      description: tr.twitterDescription || tr.ogDescription || description,
      images: tr.twitterImage ? [tr.twitterImage] : images,
    },
  };
}

function fmtRange(min: bigint | null, max: bigint | null, cur: string) {
  if (!min && !max) return null;
  const f = (n: bigint) => Number(n).toLocaleString("en-US");
  return `${min ? f(min) : "?"} – ${max ? f(max) : "?"} ${cur}`;
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const tr = await getDestinationBySlug(locale, slug);
  if (!tr) notFound();

  const ui = destUi(locale);
  const dest = tr.destination;
  const country = tr.countryName || tr.h1Title;

  const whyPoints = strArr(tr.whyInvestPoints);
  const sectors = strArr(tr.keySectorsList);
  const oppTypes = strArr(tr.opportunityTypesList);
  const notes = strArr(tr.investorNotesPoints);
  const faqs = faqArr(tr.faq);
  const opps = await getDestinationOpportunities(dest.id);

  const url = absUrl(destPath(locale, slug));
  const hubUrl = absUrl(hubPath(locale));
  const homeUrl = absUrl(`/${locale}`);

  // ---- Schema.org (JSON-LD) ----
  const ld: unknown[] = [
    webPageLd({ name: tr.h1Title, description: tr.metaDescription || tr.introText, url, locale }),
    breadcrumbLd([
      { name: ui.breadcrumbHome, url: homeUrl },
      { name: ui.hub, url: hubUrl },
      { name: country, url },
    ]),
    organizationLd(),
  ];
  if (faqs.length) ld.push(faqPageLd(faqs));

  const sectionTitle =
    "mb-5 text-2xl font-bold text-baraka-dark";
  const chip =
    "rounded-full border border-baraka/15 bg-baraka-light/60 px-4 py-2 text-sm text-baraka-dark";

  return (
    <div className="flex min-h-screen flex-col">
      {ld.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(obj) }}
        />
      ))}

      <PublicHeader />

      <main className="flex-1">
        {/* مسار التنقّل */}
        <nav className="mx-auto max-w-5xl px-6 pt-6 text-xs text-gray-500" aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href={localeHref(locale, "/")} className="hover:text-baraka">{ui.breadcrumbHome}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={hubPath(locale)} className="hover:text-baraka">{ui.hub}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-gray-700">{country}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="bg-navy"
            style={
              dest.featuredImage
                ? {
                    backgroundImage: `linear-gradient(to top, rgba(10,31,60,0.92), rgba(10,31,60,0.7)), url(${dest.featuredImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div className="mx-auto max-w-5xl px-6 py-16 text-white">
              {dest.flagEmoji && <div className="mb-3 text-4xl">{dest.flagEmoji}</div>}
              <h1 className="mb-4 text-3xl font-black leading-tight sm:text-4xl">{tr.h1Title}</h1>
              {tr.introText && (
                <p className="max-w-2xl text-base leading-relaxed text-[#d3dcea]">{tr.introText}</p>
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#opportunities"
                  className="rounded-[10px] bg-gradient-to-br from-gold to-gold-soft px-6 py-3 text-sm font-bold text-navy transition hover:brightness-110"
                >
                  {ui.explore}
                </a>
                <a
                  href="#contact"
                  className="rounded-[10px] border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:border-gold hover:text-gold"
                >
                  {ui.contactCta}
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-14 px-6 py-14">
          {/* لماذا الاستثمار */}
          {whyPoints.length > 0 && (
            <section>
              <h2 className={sectionTitle}>{tr.whyInvestTitle || ui.whyInvest}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {whyPoints.map((p, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700">
                    <span className="mt-0.5 shrink-0 text-gold">◆</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* القطاعات الواعدة */}
          {sectors.length > 0 && (
            <section>
              <h2 className={sectionTitle}>{tr.keySectorsTitle || ui.keySectors}</h2>
              <div className="flex flex-wrap gap-2.5">
                {sectors.map((s, i) => (
                  <span key={i} className={chip}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* الفرص المرتبطة بالدولة */}
          <section id="opportunities" className="scroll-mt-24">
            <h2 className={sectionTitle}>
              {ui.oppsTitlePrefix} {country}
            </h2>
            {opps.length === 0 ? (
              <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                {ui.oppsEmpty}
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {opps.map((o) => {
                  const pv = localizeVersion(toVersion(o.publicVersion), locale);
                  const localSector = localizeTerm(SECTOR_I18N, o.sector, locale);
                  const data: OpportunityCardData = {
                    id: o.id,
                    href: localeHref(locale, `/opportunities/${o.id}`),
                    title: pv?.displayTitle || `${localSector}`,
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
          </section>

          {/* أنواع الفرص المتاحة */}
          {oppTypes.length > 0 && (
            <section>
              <h2 className={sectionTitle}>{tr.opportunityTypesTitle || ui.opportunityTypes}</h2>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {oppTypes.map((p, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-gray-700">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-baraka" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* معلومات أولية للمستثمر */}
          {notes.length > 0 && (
            <section>
              <h2 className={sectionTitle}>{tr.investorNotesTitle || ui.investorNotes}</h2>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {notes.map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-gray-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* الأسئلة الشائعة */}
          {faqs.length > 0 && (
            <section>
              <h2 className={sectionTitle}>{ui.faqTitle}</h2>
              <Faq items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
            </section>
          )}

          {/* نموذج التواصل */}
          <section id="contact" className="scroll-mt-24">
            <h2 className={sectionTitle}>{tr.ctaTitle || ui.formTitle}</h2>
            {tr.ctaDescription && (
              <p className="mb-5 max-w-2xl text-sm leading-relaxed text-gray-600">{tr.ctaDescription}</p>
            )}
            <DestinationLeadForm
              locale={locale}
              destinationId={dest.id}
              countryKey={dest.countryKey}
              sectors={sectors}
            />
          </section>

          {/* التنبيه القانوني */}
          <section>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-xs leading-relaxed text-gray-500">
              <strong className="font-semibold text-gray-600">{ui.disclaimerTitle}: </strong>
              {tr.disclaimerText || ui.disclaimerDefault}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
