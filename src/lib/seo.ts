// مساعدات SEO للصفحات العامة الأساسية والفرص (عنوان/وصف/canonical/hreflang/OG/Twitter + JSON-LD).
// يعيد استخدام أدوات الرابط والـ JSON-LD العامة من lib/destinations لتوحيد المصدر (SITE_URL, absUrl, ...).
import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/i18n";
import { SITE_URL, absUrl } from "@/lib/destinations";

// إعادة تصدير الأدوات العامة لتكون واجهة استيراد واحدة (@/lib/seo) لكل صفحات الـ SEO.
export {
  SITE_URL,
  absUrl,
  organizationLd,
  webPageLd,
  breadcrumbLd,
  jsonLdScript,
} from "@/lib/destinations";

// JSON-LD لموقع WebSite (يُستخدم في الرئيسية إلى جانب Organization).
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Baraka Partners",
    url: SITE_URL,
  };
}

// اللغة الافتراضية لـ x-default (الإنجليزية كنسخة محايدة للزائر الدولي).
const X_DEFAULT: Locale = "en";

// بدائل hreflang لمسار محايد للّغة (مثل "/opportunities/123" أو "" للرئيسية).
export function altLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = absUrl(`/${l}${path}`);
  languages["x-default"] = absUrl(`/${X_DEFAULT}${path}`);
  return languages;
}

// يبني كائن Metadata لـ Next: عنوان/وصف/canonical/hreflang/OG/Twitter/robots.
export function pageMetadata(params: {
  locale: Locale;
  path: string; // محايد للّغة، يبدأ بـ "/" أو "" للرئيسية
  title: string;
  description: string;
  image?: string | null;
  index?: boolean; // افتراضي true
  type?: "website" | "article";
}): Metadata {
  const { locale, path, title, description } = params;
  const canonical = absUrl(`/${locale}${path}`);
  const image = params.image || absUrl("/logo-mark.png");
  const index = params.index ?? true;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical, languages: altLanguages(path) },
    openGraph: {
      type: params.type ?? "website",
      siteName: "Baraka Partners",
      title,
      description,
      url: canonical,
      locale,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

// قصّ الوصف لطول مناسب لمحركات البحث (~160 حرفاً) دون قطع كلمة.
export function clampDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max) || max).trim() + "…";
}

// JSON-LD لفرصة استثمارية (أقرب نوع متاح في schema.org: Product مع عرض سعري للنطاق).
// يُكتفى بالحقول المتوفّرة؛ غياب بعضها لا يُنتج خطأً في Search Console.
export function opportunityLd(params: {
  title: string;
  description?: string | null;
  url: string;
  sector?: string | null;
  country?: string | null;
  image?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  currency?: string | null;
  datePublished?: Date | null;
  dateModified?: Date | null;
}) {
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: params.title,
    description: params.description || undefined,
    image: params.image || undefined,
    category: params.sector || undefined,
    url: params.url,
    brand: { "@type": "Organization", name: "Baraka Partners" },
  };
  if (params.country) ld.areaServed = params.country;
  if (params.priceMin || params.priceMax) {
    ld.offers = {
      "@type": "AggregateOffer",
      priceCurrency: params.currency || "USD",
      lowPrice: params.priceMin ?? undefined,
      highPrice: params.priceMax ?? undefined,
      availability: "https://schema.org/InStock",
    };
  }
  if (params.datePublished) ld.releaseDate = params.datePublished.toISOString();
  return ld;
}
