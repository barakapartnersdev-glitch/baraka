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
  flagSrc,
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

// خلفية الواجهة — أفق مدينة (نمط مُعتمد في الموقع لصور Unsplash)
const HERO_SKYLINE =
  "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1920&q=70";

// صورة معلَم مشهور لكل دولة (نفس صور صفحة الدولة) — تُستخدَم إن لم تُحدّد صورة من الإدارة
const LANDMARK_BY_COUNTRY: Record<string, string> = {
  turkey: "/destinations/turkey.jpg",
  syria: "/destinations/syria.jpg",
  "european-union": "/destinations/european-union.jpg",
  cyprus: "/destinations/cyprus.jpg",
  egypt: "/destinations/egypt.jpg",
  jordan: "/destinations/jordan.jpg",
};

// تدرّجات احتياطية للبطاقات بلا صورة (مكتوبة حرفيّاً ليتعرّف عليها Tailwind)
const CARD_GRADIENTS = [
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-indigo-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-700",
];

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

  return (
    <div className="flex min-h-screen flex-col bg-[#eef1f6] text-[#1a2433]">
      {ld.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(obj) }}
        />
      ))}

      <PublicHeader />

      <main className="flex-1">
        {/* ===== الواجهة — أفق مدينة + تعتيم كحلي وعنوان متمركز ===== */}
        <section className="relative isolate overflow-hidden border-b border-gold/15">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_SKYLINE})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,31,60,.85), rgba(10,31,60,.93))",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-12 text-center text-white sm:pb-28 sm:pt-16">
            <nav className="mb-6 text-xs text-[#cdd6e4]" aria-label="breadcrumb">
              <ol className="flex flex-wrap items-center justify-center gap-1.5">
                <li>
                  <Link href={localeHref(locale, "/")} className="transition hover:text-gold">
                    {ui.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/40">/</li>
                <li className="font-medium text-white">{ui.hub}</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-black leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] sm:text-5xl">
              {ui.hub}
            </h1>
            <span
              className="mx-auto mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-gold to-gold-soft"
              aria-hidden="true"
            />
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#d3dcea] sm:text-lg">
              {ui.hubLead}
            </p>
          </div>
        </section>

        {/* ===== شبكة الوجهات — بطاقات معالم + علم + زر ذهبي ===== */}
        <div className="mx-auto -mt-12 max-w-6xl px-4 pb-20 sm:px-6">
          {cards.length === 0 ? (
            <p className="rounded-2xl border border-[#e3e8f0] bg-white p-10 text-center text-sm text-[#5c6b80] shadow-[0_10px_40px_rgba(10,31,60,.05)]">
              {ui.hubEmpty}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ dest, tr }, i) => {
                const image =
                  dest.featuredImage || LANDMARK_BY_COUNTRY[dest.countryKey] || null;
                const flag = flagSrc(dest.countryKey);
                const name = tr.countryName || tr.h1Title;
                const desc = tr.introText || tr.metaDescription || "";

                return (
                  <Link
                    key={dest.id}
                    href={destPath(locale, tr.slug)}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-[#e9edf3] bg-white shadow-[0_10px_40px_rgba(10,31,60,.05)] transition-all duration-200 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_18px_44px_rgba(10,31,60,.13)]"
                  >
                    {/* غلاف المعلَم */}
                    <div className="relative h-44 overflow-hidden">
                      {image ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${image})` }}
                          aria-hidden="true"
                        />
                      ) : (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`}
                          aria-hidden="true"
                        />
                      )}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-navy/55 via-navy/10 to-transparent"
                        aria-hidden="true"
                      />
                    </div>

                    {/* جسم البطاقة */}
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-center gap-2.5">
                        {flag ? (
                          <span
                            className="h-6 w-9 shrink-0 rounded-[3px] bg-cover bg-center shadow-sm ring-1 ring-black/10"
                            style={{ backgroundImage: `url(${flag})` }}
                            aria-hidden="true"
                          />
                        ) : (
                          dest.flagEmoji && (
                            <span className="text-2xl leading-none" aria-hidden="true">
                              {dest.flagEmoji}
                            </span>
                          )
                        )}
                        <span className="text-sm font-semibold text-[#5c6b80]">{name}</span>
                      </div>

                      <h2 className="mt-2.5 text-lg font-black leading-snug text-navy transition group-hover:text-baraka">
                        {tr.h1Title}
                      </h2>

                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#5c6b80]">
                        {desc}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 self-start rounded-lg bg-gradient-to-br from-gold to-gold-soft px-5 py-2.5 text-sm font-bold text-navy shadow-sm transition group-hover:brightness-105">
                        {ui.explore}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
