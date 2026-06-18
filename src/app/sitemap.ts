import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { LOCALES, DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import {
  getActiveDestinations,
  hubPath,
  destPath,
  absUrl,
  buildLanguageAlternates,
  hubLanguageAlternates,
} from "@/lib/destinations";

// المسارات العامة الثابتة (بلا بادئة لغة — تُضاف لكل لغة)
const STATIC_PATHS = [
  "",
  "/opportunities",
  "/how-it-works",
  "/about",
  "/contact",
  "/investment-ambassadors",
];

function staticLanguageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = absUrl(`/${l}${path}`);
  languages["x-default"] = absUrl(`/${DEFAULT_LOCALE}${path}`);
  return languages;
}

export const dynamic = "force-dynamic";

const FREQS = new Set([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
]);
type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];
const freq = (v: string): Freq => (FREQS.has(v) ? (v as Freq) : "monthly");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // الصفحات العامة الثابتة (الرئيسية، الفرص، آلية العمل، عن، تواصل، سفراء الاستثمار)
  for (const path of STATIC_PATHS) {
    const priority = path === "" ? 1 : path === "/investment-ambassadors" ? 0.8 : 0.7;
    for (const l of LOCALES) {
      entries.push({
        url: absUrl(`/${l}${path}`),
        changeFrequency: "weekly",
        priority,
        alternates: { languages: staticLanguageAlternates(path) },
      });
    }
  }

  // الفرص المنشورة — أفضل جهد (لا تكسر الخريطة إن تعذّر الوصول للقاعدة)
  try {
    const opps = await prisma.opportunity.findMany({
      where: { state: "PUBLISHED" },
      select: { id: true, updatedAt: true },
      take: 1000,
    });
    for (const o of opps) {
      const path = `/opportunities/${o.id}`;
      for (const l of LOCALES) {
        entries.push({
          url: absUrl(`/${l}${path}`),
          lastModified: o.updatedAt,
          changeFrequency: "weekly",
          priority: 0.6,
          alternates: { languages: staticLanguageAlternates(path) },
        });
      }
    }
  } catch (e) {
    console.error("[sitemap] تعذّر جلب الفرص المنشورة:", e);
  }

  // صفحة المحور (الهَب) لكل لغة
  const hubLangs = hubLanguageAlternates();
  for (const l of LOCALES) {
    entries.push({
      url: absUrl(hubPath(l)),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: hubLangs },
    });
  }

  // صفحات الدول المفعّلة القابلة للفهرسة
  const destinations = await getActiveDestinations();
  for (const d of destinations) {
    if (!d.inSitemap) continue;
    const langs = buildLanguageAlternates(d.translations);
    for (const tr of d.translations) {
      if (!isLocale(tr.locale) || !tr.robotsIndex) continue;
      entries.push({
        url: absUrl(destPath(tr.locale, tr.slug)),
        lastModified: tr.updatedAt,
        changeFrequency: freq(tr.sitemapChangefreq),
        priority: tr.sitemapPriority,
        alternates: { languages: langs },
      });
    }
  }

  return entries;
}
