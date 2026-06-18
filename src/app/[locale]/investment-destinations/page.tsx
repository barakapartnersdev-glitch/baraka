import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { destUi } from "@/lib/dest-i18n";
import {
  getDestinationCards,
  destPath,
  hubPath,
  absUrl,
  hubLanguageAlternates,
  breadcrumbLd,
  organizationLd,
  jsonLdScript,
} from "@/lib/destinations";

export const dynamic = "force-dynamic";

type Params = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = destUi(locale);
  const url = absUrl(hubPath(locale));
  return {
    title: `${ui.hub} | Baraka Partners`,
    description: ui.hubMetaDesc,
    alternates: { canonical: url, languages: hubLanguageAlternates() },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${ui.hub} | Baraka Partners`,
      description: ui.hubMetaDesc,
      url,
      siteName: "Baraka Partners",
      locale,
      type: "website",
    },
  };
}

export default async function DestinationsHub({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const ui = destUi(locale);
  const cards = await getDestinationCards(locale);

  const homeUrl = absUrl(`/${locale}`);
  const hubUrl = absUrl(hubPath(locale));
  const ld = [
    breadcrumbLd([
      { name: ui.breadcrumbHome, url: homeUrl },
      { name: ui.hub, url: hubUrl },
    ]),
    organizationLd(),
  ];

  const gradients = [
    "from-emerald-500 to-teal-600",
    "from-sky-500 to-indigo-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-violet-500 to-purple-600",
    "from-cyan-500 to-blue-700",
  ];

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
        <section className="border-b border-gold/15 bg-navy py-14 text-white">
          <div className="mx-auto max-w-5xl px-6">
            <nav className="mb-4 text-xs text-[#9fb0c9]" aria-label="breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href={localeHref(locale, "/")} className="hover:text-gold">{ui.breadcrumbHome}</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-white">{ui.hub}</li>
              </ol>
            </nav>
            <h1 className="mb-3 text-3xl font-black sm:text-4xl">{ui.hub}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-[#d3dcea]">{ui.hubLead}</p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-6 py-12">
          {cards.length === 0 ? (
            <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
              {ui.hubEmpty}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ dest, tr }, i) => (
                <Link
                  key={dest.id}
                  href={destPath(locale, tr.slug)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-baraka hover:shadow-md"
                >
                  <div
                    className={`relative h-32 ${dest.featuredImage ? "bg-gray-200" : `bg-gradient-to-br ${gradients[i % gradients.length]}`}`}
                    style={
                      dest.featuredImage
                        ? { backgroundImage: `url(${dest.featuredImage})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : undefined
                    }
                  >
                    {dest.featuredImage && <div className="absolute inset-0 bg-black/30" />}
                    <div className="absolute inset-0 flex items-end justify-between p-4">
                      <span className="text-lg font-bold text-white drop-shadow">{tr.countryName || tr.h1Title}</span>
                      {dest.flagEmoji && <span className="text-3xl drop-shadow">{dest.flagEmoji}</span>}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="mb-1.5 font-bold leading-snug text-baraka-dark group-hover:text-baraka">{tr.h1Title}</h2>
                    <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                      {tr.introText || tr.metaDescription || ""}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-baraka group-hover:underline">
                      {ui.explore} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
