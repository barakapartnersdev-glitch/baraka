// منطق قسم «وجهات الاستثمار» — قراءات قاعدة البيانات (دفاعية)، بناء الروابط المطلقة،
// بدائل اللغة (hreflang)، وبيانات Schema.org. يُستورد في صفحات الخادم وملف sitemap.
// كل القراءات «أفضل جهد»: عند أي خطأ (مثلاً قبل تشغيل migration) تُعيد قيمة فارغة
// بدل أن تكسر الصفحة — على نهج src/lib/notify.ts.
import "server-only";
import { prisma } from "@/lib/prisma";
import type { Destination, DestinationTranslation } from "@prisma/client";
import {
  DEFAULT_LOCALE,
  LOCALES,
  isLocale,
  type Locale,
} from "@/lib/i18n";

// ===== ثوابت الروابط =====
// الرابط الأساسي للموقع (للروابط المطلقة في canonical/hreflang/OG/sitemap).
export const SITE_URL = (
  process.env.APP_BASE_URL || "https://barakapartners.com"
).replace(/\/+$/, "");

export const DEST_SEGMENT = "investment-destinations";

export function hubPath(locale: Locale): string {
  return `/${locale}/${DEST_SEGMENT}`;
}
export function destPath(locale: Locale, slug: string): string {
  return `/${locale}/${DEST_SEGMENT}/${slug}`;
}
export function absUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// ===== مُحوّلات آمنة لأعمدة JSON =====
export type FaqEntry = { q: string; a: string };

export function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export function faqArr(v: unknown): FaqEntry[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter(
      (x): x is FaqEntry =>
        !!x &&
        typeof x === "object" &&
        typeof (x as Record<string, unknown>).q === "string" &&
        typeof (x as Record<string, unknown>).a === "string"
    )
    .map((x) => ({ q: x.q, a: x.a }));
}

// ===== أنواع مساعدة =====
export type DestWithTranslations = Destination & {
  translations: DestinationTranslation[];
};

export function pickTranslation(
  d: DestWithTranslations,
  locale: Locale
): DestinationTranslation | null {
  return d.translations.find((t) => t.locale === locale) ?? null;
}

// ===== قراءات قاعدة البيانات (دفاعية) =====

// كل الوجهات المفعّلة مع ترجماتها، مرتّبة حسب ترتيب العرض.
export async function getActiveDestinations(): Promise<DestWithTranslations[]> {
  try {
    return await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      include: { translations: true },
    });
  } catch (e) {
    console.error("[destinations] getActiveDestinations:", e);
    return [];
  }
}

// الوجهات المفعّلة التي تملك ترجمة في اللغة المطلوبة (لتفادي خلط اللغات في القوائم).
export async function getDestinationCards(
  locale: Locale
): Promise<{ dest: DestWithTranslations; tr: DestinationTranslation }[]> {
  const all = await getActiveDestinations();
  return all
    .map((dest) => ({ dest, tr: pickTranslation(dest, locale) }))
    .filter((x): x is { dest: DestWithTranslations; tr: DestinationTranslation } =>
      x.tr !== null
    );
}

// ترجمة وجهة واحدة عبر (اللغة، slug) — مع الوجهة وكل ترجماتها (لبناء hreflang).
// تُعيد null إذا لم توجد أو كانت الوجهة مخفية.
export async function getDestinationBySlug(
  locale: Locale,
  slug: string
): Promise<
  | (DestinationTranslation & { destination: DestWithTranslations })
  | null
> {
  try {
    const tr = await prisma.destinationTranslation.findUnique({
      where: { locale_slug: { locale, slug } },
      include: { destination: { include: { translations: true } } },
    });
    if (!tr || !tr.destination.isActive) return null;
    return tr;
  } catch (e) {
    console.error("[destinations] getDestinationBySlug:", e);
    return null;
  }
}

// إيجاد وجهة عبر slug في أي لغة — للسماح بإعادة التوجيه إلى slug اللغة الحالية
// (مثلاً عند تبديل اللغة وبقاء slug لغة أخرى في الرابط، فتُصبح الصفحة «غير موجودة»).
export async function findDestinationByAnySlug(
  slug: string
): Promise<DestWithTranslations | null> {
  try {
    const trx = await prisma.destinationTranslation.findFirst({
      where: { slug },
      include: { destination: { include: { translations: true } } },
    });
    if (!trx || !trx.destination.isActive) return null;
    return trx.destination;
  } catch (e) {
    console.error("[destinations] findDestinationByAnySlug:", e);
    return null;
  }
}

// الفرص المنشورة المرتبطة بوجهة (لقسم «فرص متاحة في هذه الدولة»).
export async function getDestinationOpportunities(destinationId: string) {
  try {
    return await prisma.opportunity.findMany({
      where: { destinationId, state: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 12,
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
  } catch (e) {
    console.error("[destinations] getDestinationOpportunities:", e);
    return [];
  }
}

// ===== hreflang / بدائل اللغة =====
// يبني خريطة hreflang→رابط مطلق من ترجمات الوجهة، مع x-default (إنجليزي ثم الافتراضي).
export function buildLanguageAlternates(
  translations: Pick<DestinationTranslation, "locale" | "slug">[]
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const t of translations) {
    if (isLocale(t.locale)) languages[t.locale] = absUrl(destPath(t.locale, t.slug));
  }
  const xdef =
    translations.find((t) => t.locale === "en") ??
    translations.find((t) => t.locale === DEFAULT_LOCALE) ??
    translations[0];
  if (xdef && isLocale(xdef.locale)) {
    languages["x-default"] = absUrl(destPath(xdef.locale, xdef.slug));
  }
  return languages;
}

// بدائل لغة صفحة المحور (الهَب) — رابط ثابت لكل لغة.
export function hubLanguageAlternates(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = absUrl(hubPath(l));
  languages["x-default"] = absUrl(hubPath("en"));
  return languages;
}

// ===== بيانات Schema.org (JSON-LD) =====
const ORG_NAME = "Baraka Partners";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    logo: absUrl("/logo-mark.png"),
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function webPageLd(params: {
  name: string;
  description?: string | null;
  url: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: params.name,
    description: params.description ?? undefined,
    url: params.url,
    inLanguage: params.locale,
    isPartOf: { "@type": "WebSite", name: ORG_NAME, url: SITE_URL },
  };
}

export function faqPageLd(faq: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// مساعد لحقن JSON-LD في الصفحة بأمان.
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
