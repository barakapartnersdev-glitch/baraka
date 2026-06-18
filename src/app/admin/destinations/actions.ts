"use server";
// إجراءات إدارة صفحات وجهات الاستثمار — محمية بـ requireRole("ADMIN").
// كلها إضافية/تحريرية على جداول Destination / DestinationTranslation وربط الفرص.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";

// ===== مساعدات قراءة الحقول =====
const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
};
const strOrNull = (fd: FormData, k: string) => str(fd, k) || null;
const bool = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return v === "on" || v === "true" || v === "1";
};
const lines = (fd: FormData, k: string) =>
  str(fd, k)
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
const linesOrNull = (fd: FormData, k: string) => {
  const arr = lines(fd, k);
  return arr.length ? arr : Prisma.DbNull;
};
const numOr = (fd: FormData, k: string, d: number) => {
  const n = parseFloat(str(fd, k));
  return Number.isFinite(n) ? n : d;
};
// أسئلة شائعة: كل سطر «السؤال :: الجواب»
function faqParse(fd: FormData, k: string) {
  const arr = lines(fd, k)
    .map((l) => {
      const i = l.indexOf("::");
      if (i === -1) return null;
      const q = l.slice(0, i).trim();
      const a = l.slice(i + 2).trim();
      return q && a ? { q, a } : null;
    })
    .filter(Boolean);
  return arr.length ? (arr as { q: string; a: string }[]) : Prisma.DbNull;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

// ===== إنشاء وجهة جديدة (+ ترجمة أولى) =====
export async function createDestination(fd: FormData): Promise<void> {
  await requireRole("ADMIN");
  const countryKey = slugify(str(fd, "countryKey"));
  if (!countryKey) redirect("/admin/destinations/new?error=countryKey");

  const locale = str(fd, "locale");
  const h1Title = str(fd, "h1Title");
  let slug = slugify(str(fd, "slug") || h1Title);
  if (!isLocale(locale) || !h1Title || !slug) {
    redirect("/admin/destinations/new?error=translation");
  }

  let destId = "";
  try {
    const dest = await prisma.destination.create({
      data: {
        countryKey,
        region: strOrNull(fd, "region"),
        flagEmoji: strOrNull(fd, "flagEmoji"),
        featuredImage: strOrNull(fd, "featuredImage"),
        displayOrder: Math.trunc(numOr(fd, "displayOrder", 0)),
        isActive: bool(fd, "isActive"),
        showInMenu: bool(fd, "showInMenu"),
        showInFooter: bool(fd, "showInFooter"),
        inSitemap: bool(fd, "inSitemap"),
        translations: {
          create: {
            locale,
            slug,
            countryName: strOrNull(fd, "countryName"),
            h1Title,
          },
        },
      },
    });
    destId = dest.id;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      redirect("/admin/destinations/new?error=duplicate");
    }
    throw e;
  }

  revalidatePath("/admin/destinations");
  redirect(`/admin/destinations/${destId}?ok=created`);
}

// ===== تحديث البيانات العامة للوجهة =====
export async function updateDestinationGeneral(fd: FormData): Promise<void> {
  await requireRole("ADMIN");
  const id = str(fd, "id");
  if (!id) return;
  await prisma.destination.update({
    where: { id },
    data: {
      region: strOrNull(fd, "region"),
      flagEmoji: strOrNull(fd, "flagEmoji"),
      featuredImage: strOrNull(fd, "featuredImage"),
      displayOrder: Math.trunc(numOr(fd, "displayOrder", 0)),
      isActive: bool(fd, "isActive"),
      showInMenu: bool(fd, "showInMenu"),
      showInFooter: bool(fd, "showInFooter"),
      inSitemap: bool(fd, "inSitemap"),
    },
  });
  revalidatePath(`/admin/destinations/${id}`);
  revalidatePath("/admin/destinations");
  redirect(`/admin/destinations/${id}?ok=general`);
}

// ===== حفظ/تحديث ترجمة لغة (محتوى + SEO) =====
export async function saveTranslation(fd: FormData): Promise<void> {
  await requireRole("ADMIN");
  const destinationId = str(fd, "destinationId");
  const locale = str(fd, "locale");
  if (!destinationId || !isLocale(locale)) return;

  const h1Title = str(fd, "h1Title");
  const slug = slugify(str(fd, "slug") || h1Title);
  if (!h1Title || !slug) {
    redirect(`/admin/destinations/${destinationId}?error=translation&locale=${locale}`);
  }

  const data = {
    slug,
    countryName: strOrNull(fd, "countryName"),
    pageTitle: strOrNull(fd, "pageTitle"),
    h1Title,
    introText: strOrNull(fd, "introText"),
    whyInvestTitle: strOrNull(fd, "whyInvestTitle"),
    whyInvestPoints: linesOrNull(fd, "whyInvestPoints"),
    keySectorsTitle: strOrNull(fd, "keySectorsTitle"),
    keySectorsList: linesOrNull(fd, "keySectorsList"),
    opportunityTypesTitle: strOrNull(fd, "opportunityTypesTitle"),
    opportunityTypesList: linesOrNull(fd, "opportunityTypesList"),
    investorNotesTitle: strOrNull(fd, "investorNotesTitle"),
    investorNotesPoints: linesOrNull(fd, "investorNotesPoints"),
    disclaimerText: strOrNull(fd, "disclaimerText"),
    ctaTitle: strOrNull(fd, "ctaTitle"),
    ctaDescription: strOrNull(fd, "ctaDescription"),
    ctaButtonText: strOrNull(fd, "ctaButtonText"),
    faq: faqParse(fd, "faq"),
    seoTitle: strOrNull(fd, "seoTitle"),
    metaDescription: strOrNull(fd, "metaDescription"),
    focusKeyword: strOrNull(fd, "focusKeyword"),
    secondaryKeywords: linesOrNull(fd, "secondaryKeywords"),
    canonicalUrl: strOrNull(fd, "canonicalUrl"),
    ogTitle: strOrNull(fd, "ogTitle"),
    ogDescription: strOrNull(fd, "ogDescription"),
    ogImage: strOrNull(fd, "ogImage"),
    twitterTitle: strOrNull(fd, "twitterTitle"),
    twitterDescription: strOrNull(fd, "twitterDescription"),
    twitterImage: strOrNull(fd, "twitterImage"),
    robotsIndex: bool(fd, "robotsIndex"),
    robotsFollow: bool(fd, "robotsFollow"),
    sitemapPriority: numOr(fd, "sitemapPriority", 0.7),
    sitemapChangefreq: str(fd, "sitemapChangefreq") || "monthly",
  };

  try {
    await prisma.destinationTranslation.upsert({
      where: { destinationId_locale: { destinationId, locale } },
      create: { destinationId, locale, ...data },
      update: data,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      redirect(`/admin/destinations/${destinationId}?error=slug&locale=${locale}`);
    }
    throw e;
  }

  revalidatePath(`/admin/destinations/${destinationId}`);
  redirect(`/admin/destinations/${destinationId}?ok=translation&locale=${locale}`);
}

// ===== حذف ترجمة لغة =====
export async function deleteTranslation(fd: FormData): Promise<void> {
  await requireRole("ADMIN");
  const id = str(fd, "translationId");
  const destinationId = str(fd, "destinationId");
  if (!id) return;
  await prisma.destinationTranslation.delete({ where: { id } });
  revalidatePath(`/admin/destinations/${destinationId}`);
  redirect(`/admin/destinations/${destinationId}?ok=deletedTranslation`);
}

// ===== تفعيل/إخفاء سريع من القائمة =====
export async function toggleActive(fd: FormData): Promise<void> {
  await requireRole("ADMIN");
  const id = str(fd, "id");
  const next = str(fd, "next") === "true";
  if (!id) return;
  await prisma.destination.update({ where: { id }, data: { isActive: next } });
  revalidatePath("/admin/destinations");
}

// ===== حذف وجهة بالكامل =====
export async function deleteDestination(fd: FormData): Promise<void> {
  await requireRole("ADMIN");
  const id = str(fd, "id");
  if (!id) return;
  await prisma.destination.delete({ where: { id } });
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations");
}

// ===== ربط/فكّ فرصة منشورة بالوجهة =====
export async function setOpportunityLink(fd: FormData): Promise<void> {
  await requireRole("ADMIN");
  const destinationId = str(fd, "destinationId");
  const opportunityId = str(fd, "opportunityId");
  const attach = str(fd, "attach") === "true";
  if (!opportunityId) return;
  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: { destinationId: attach ? destinationId : null },
  });
  revalidatePath(`/admin/destinations/${destinationId}`);
}
