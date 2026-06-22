import Link from "next/link";
import { notFound } from "next/navigation";
import type { DestinationTranslation } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { LOCALES, type Locale } from "@/lib/i18n";
import { destPath, flagSrc } from "@/lib/destinations";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  updateDestinationGeneral,
  saveTranslation,
  deleteTranslation,
  deleteDestination,
  setOpportunityLink,
} from "../actions";

export const dynamic = "force-dynamic";

const LOCALE_NAME: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
  tr: "Türkçe",
  zh: "中文",
};

const OK_MSG: Record<string, string> = {
  created: "تم إنشاء الوجهة.",
  general: "تم حفظ البيانات العامة.",
  translation: "تم حفظ الترجمة.",
  deletedTranslation: "تم حذف الترجمة.",
};
const ERR_MSG: Record<string, string> = {
  translation: "العنوان الرئيسي والرابط مطلوبان.",
  slug: "هذا الرابط (slug) مستخدم في لغة أخرى — اختر رابطاً فريداً.",
};

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-baraka focus:ring-1 focus:ring-baraka";
const labelCls = "mb-1 block text-xs font-medium text-gray-600";

const toText = (v: unknown) =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string").join("\n") : "";
const faqToText = (v: unknown) =>
  Array.isArray(v)
    ? v
        .filter(
          (x) =>
            x &&
            typeof x === "object" &&
            typeof (x as Record<string, unknown>).q === "string"
        )
        .map((x) => `${(x as { q: string }).q} :: ${(x as { a: string }).a}`)
        .join("\n")
    : "";

function Field({ label, name, value, type = "text", dir }: { label: string; name: string; value?: string | null; type?: string; dir?: "ltr" | "rtl" }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input name={name} defaultValue={value ?? ""} type={type} dir={dir} className={inputCls} />
    </div>
  );
}
function Area({ label, name, value, rows = 3, hint }: { label: string; name: string; value?: string | null; rows?: number; hint?: string }) {
  return (
    <div className="sm:col-span-2">
      <label className={labelCls}>{label}{hint && <span className="text-gray-400"> — {hint}</span>}</label>
      <textarea name={name} defaultValue={value ?? ""} rows={rows} className={inputCls} />
    </div>
  );
}

function TranslationForm({
  destinationId,
  locale,
  tr,
}: {
  destinationId: string;
  locale: Locale;
  tr: DestinationTranslation | undefined;
}) {
  return (
    <details open={!!tr} className="rounded-2xl border border-gray-200 bg-white">
      <summary className="cursor-pointer list-none px-6 py-4 font-bold">
        <span className="inline-flex items-center gap-2">
          {LOCALE_NAME[locale]}
          {tr ? (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-normal text-emerald-700">محفوظة</span>
          ) : (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-normal text-gray-400">غير معدّة</span>
          )}
        </span>
      </summary>

      <form action={saveTranslation} className="border-t border-gray-100 p-6">
        <input type="hidden" name="destinationId" value={destinationId} />
        <input type="hidden" name="locale" value={locale} />

        <h4 className="mb-3 text-sm font-bold text-baraka-dark">المحتوى</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم الدولة (للعناوين)" name="countryName" value={tr?.countryName} />
          <Field label="الرابط slug *" name="slug" value={tr?.slug} dir="ltr" />
          <Field label="العنوان الرئيسي H1 *" name="h1Title" value={tr?.h1Title} />
          <Field label="عنوان التبويب (Title)" name="pageTitle" value={tr?.pageTitle} />
          <Area label="مقدمة تعريفية" name="introText" value={tr?.introText} />
          <Field label="عنوان «لماذا الاستثمار»" name="whyInvestTitle" value={tr?.whyInvestTitle} />
          <Area label="نقاط لماذا الاستثمار" name="whyInvestPoints" value={toText(tr?.whyInvestPoints)} hint="نقطة في كل سطر" rows={5} />
          <Field label="عنوان القطاعات" name="keySectorsTitle" value={tr?.keySectorsTitle} />
          <Area label="القطاعات الواعدة" name="keySectorsList" value={toText(tr?.keySectorsList)} hint="قطاع في كل سطر" rows={5} />
          <Field label="عنوان أنواع الفرص" name="opportunityTypesTitle" value={tr?.opportunityTypesTitle} />
          <Area label="أنواع الفرص" name="opportunityTypesList" value={toText(tr?.opportunityTypesList)} hint="نوع في كل سطر" rows={4} />
          <Field label="عنوان معلومات المستثمر" name="investorNotesTitle" value={tr?.investorNotesTitle} />
          <Area label="معلومات أولية للمستثمر" name="investorNotesPoints" value={toText(tr?.investorNotesPoints)} hint="نقطة في كل سطر" rows={4} />
          <Area label="التنبيه القانوني" name="disclaimerText" value={tr?.disclaimerText} hint="يُترك فارغاً لاستخدام النص الافتراضي" />
          <Field label="عنوان دعوة التواصل (CTA)" name="ctaTitle" value={tr?.ctaTitle} />
          <Field label="زر التواصل" name="ctaButtonText" value={tr?.ctaButtonText} />
          <Area label="وصف دعوة التواصل" name="ctaDescription" value={tr?.ctaDescription} />
          <Area label="الأسئلة الشائعة" name="faq" value={faqToText(tr?.faq)} hint="سطر لكل سؤال بصيغة: السؤال :: الجواب" rows={5} />
        </div>

        <h4 className="mb-3 mt-6 text-sm font-bold text-baraka-dark">تحسين محركات البحث (SEO)</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SEO Title" name="seoTitle" value={tr?.seoTitle} />
          <Field label="الكلمة المفتاحية" name="focusKeyword" value={tr?.focusKeyword} />
          <Area label="Meta Description" name="metaDescription" value={tr?.metaDescription} />
          <Area label="كلمات ثانوية" name="secondaryKeywords" value={toText(tr?.secondaryKeywords)} hint="كلمة في كل سطر" />
          <Field label="Canonical (تجاوز اختياري)" name="canonicalUrl" value={tr?.canonicalUrl} dir="ltr" />
          <Field label="OG Image (رابط)" name="ogImage" value={tr?.ogImage} dir="ltr" />
          <Field label="OG Title" name="ogTitle" value={tr?.ogTitle} />
          <Area label="OG Description" name="ogDescription" value={tr?.ogDescription} />
          <Field label="Twitter Title" name="twitterTitle" value={tr?.twitterTitle} />
          <Field label="Twitter Image (رابط)" name="twitterImage" value={tr?.twitterImage} dir="ltr" />
          <Area label="Twitter Description" name="twitterDescription" value={tr?.twitterDescription} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" name="robotsIndex" defaultChecked={tr?.robotsIndex ?? true} /> فهرسة (index)</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="robotsFollow" defaultChecked={tr?.robotsFollow ?? true} /> تتبّع الروابط (follow)</label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>أولوية sitemap</label>
              <input name="sitemapPriority" type="number" step="0.1" min="0" max="1" defaultValue={tr?.sitemapPriority ?? 0.7} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>تكرار التحديث</label>
              <select name="sitemapChangefreq" defaultValue={tr?.sitemapChangefreq ?? "monthly"} className={inputCls}>
                {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" className="rounded-lg bg-baraka px-5 py-2.5 text-sm font-bold text-white hover:bg-baraka-dark">
            حفظ {LOCALE_NAME[locale]}
          </button>
          {tr && (
            <Link
              href={destPath(locale, tr.slug)}
              target="_blank"
              className="text-xs text-baraka hover:underline"
            >
              معاينة الصفحة ↗
            </Link>
          )}
        </div>
      </form>

      {tr && (
        <form action={deleteTranslation} className="border-t border-gray-100 px-6 py-3">
          <input type="hidden" name="translationId" value={tr.id} />
          <input type="hidden" name="destinationId" value={destinationId} />
          <button type="submit" className="text-xs text-rose-600 hover:underline">
            حذف ترجمة {LOCALE_NAME[locale]}
          </button>
        </form>
      )}
    </details>
  );
}

export default async function EditDestination({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string; locale?: string }>;
}) {
  const { id } = await params;
  const { ok, error } = await searchParams;

  const dest = await prisma.destination.findUnique({
    where: { id },
    include: { translations: true, opportunities: { select: { id: true } } },
  });
  if (!dest) notFound();

  // الفرص المنشورة (لربطها بالوجهة)
  const publishedOpps = await prisma.opportunity.findMany({
    where: { state: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, sector: true, country: true, destinationId: true },
  });

  const byLocale = new Map(dest.translations.map((t) => [t.locale, t]));

  return (
    <div className="max-w-4xl">
      <Link href="/admin/destinations" className="text-sm text-gray-500 hover:text-baraka">
        → كل الوجهات
      </Link>
      <h1 className="mb-1 mt-3 flex items-center gap-2.5 text-2xl font-bold">
        {flagSrc(dest.countryKey) && (
          <span
            className="inline-block h-5 w-7 shrink-0 rounded-[3px] bg-cover bg-center ring-1 ring-black/10"
            style={{ backgroundImage: `url(${flagSrc(dest.countryKey)})` }}
            aria-hidden="true"
          />
        )}
        {dest.countryKey}
      </h1>
      <p className="mb-6 text-sm text-gray-500">حرّر البيانات العامة، ومحتوى وSEO كل لغة، واربط الفرص المنشورة.</p>

      {ok && OK_MSG[ok] && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{OK_MSG[ok]}</p>
      )}
      {error && ERR_MSG[error] && (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{ERR_MSG[error]}</p>
      )}

      {/* بيانات عامة */}
      <form action={updateDestinationGeneral} className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
        <input type="hidden" name="id" value={dest.id} />
        <h2 className="mb-4 font-bold">بيانات عامة</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="المنطقة" name="region" value={dest.region} />
          <Field label="رمز العلم (إيموجي)" name="flagEmoji" value={dest.flagEmoji} />
          <Field label="ترتيب العرض" name="displayOrder" value={String(dest.displayOrder)} type="number" />
          <div className="sm:col-span-2">
            <ImageUploadField
              name="featuredImage"
              label="صورة الهيرو الرئيسية للدولة"
              folder="destinations"
              initialUrl={dest.featuredImage}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={dest.isActive} /> مفعّلة</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="showInMenu" defaultChecked={dest.showInMenu} /> في القائمة</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="showInFooter" defaultChecked={dest.showInFooter} /> في الفوتر</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="inSitemap" defaultChecked={dest.inSitemap} /> في sitemap</label>
        </div>
        <button type="submit" className="mt-5 rounded-lg bg-baraka px-5 py-2.5 text-sm font-bold text-white hover:bg-baraka-dark">
          حفظ البيانات العامة
        </button>
      </form>

      {/* الترجمات */}
      <h2 className="mb-3 font-bold">المحتوى وSEO لكل لغة</h2>
      <div className="space-y-4">
        {LOCALES.map((l) => (
          <TranslationForm key={l} destinationId={dest.id} locale={l} tr={byLocale.get(l)} />
        ))}
      </div>

      {/* ربط الفرص */}
      <h2 className="mb-3 mt-8 font-bold">الفرص المنشورة المرتبطة</h2>
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {publishedOpps.length === 0 ? (
          <p className="text-sm text-gray-400">لا توجد فرص منشورة لربطها حالياً.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {publishedOpps.map((o) => {
              const linkedHere = o.destinationId === dest.id;
              const linkedElsewhere = !!o.destinationId && !linkedHere;
              return (
                <li key={o.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span>
                    <span className="font-medium">{o.title}</span>
                    <span className="mr-2 text-xs text-gray-400">{o.sector} — {o.country}</span>
                    {linkedElsewhere && <span className="mr-2 text-xs text-amber-600">(مرتبطة بوجهة أخرى)</span>}
                  </span>
                  <form action={setOpportunityLink}>
                    <input type="hidden" name="destinationId" value={dest.id} />
                    <input type="hidden" name="opportunityId" value={o.id} />
                    <input type="hidden" name="attach" value={(!linkedHere).toString()} />
                    <button
                      type="submit"
                      className={`rounded-md px-3 py-1 text-xs font-medium ${
                        linkedHere
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "bg-baraka-light text-baraka hover:bg-baraka/10"
                      }`}
                    >
                      {linkedHere ? "إلغاء الربط" : "ربط بالدولة"}
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* حذف */}
      <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50/40 p-6">
        <h2 className="mb-1 font-bold text-rose-700">حذف الوجهة</h2>
        <p className="mb-4 text-sm text-gray-600">يحذف الدولة وكل ترجماتها نهائياً. الطلبات المرتبطة تبقى في الـ CRM.</p>
        <form action={deleteDestination}>
          <input type="hidden" name="id" value={dest.id} />
          <button type="submit" className="rounded-lg border border-rose-300 px-5 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100">
            حذف نهائي
          </button>
        </form>
      </div>
    </div>
  );
}
