import Link from "next/link";
import { createDestination } from "../actions";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  countryKey: "مفتاح الدولة مطلوب.",
  translation: "اللغة والعنوان الرئيسي والرابط مطلوبة للترجمة الأولى.",
  duplicate: "مفتاح الدولة أو الرابط مستخدم مسبقاً.",
};

export default async function NewDestination({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-baraka focus:ring-1 focus:ring-baraka";
  const labelCls = "mb-1 block text-xs font-medium text-gray-600";

  return (
    <div className="max-w-3xl">
      <Link href="/admin/destinations" className="text-sm text-gray-500 hover:text-baraka">
        → كل الوجهات
      </Link>
      <h1 className="mb-1 mt-3 text-2xl font-bold">وجهة جديدة</h1>
      <p className="mb-6 text-sm text-gray-500">
        أنشئ الدولة ببياناتها العامة وأول ترجمة، ثم أكمل بقية اللغات والمحتوى من صفحة التحرير.
      </p>

      {error && (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {ERRORS[error] ?? "تعذّر الإنشاء."}
        </p>
      )}

      <form action={createDestination} className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-bold">بيانات عامة</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>مفتاح الدولة (إنجليزي، ثابت) *</label>
              <input name="countryKey" required placeholder="turkey" dir="ltr" className={inputCls} />
              <p className="mt-1 text-[11px] text-gray-400">مثل: turkey، syria، european-union</p>
            </div>
            <div>
              <label className={labelCls}>المنطقة</label>
              <input name="region" placeholder="الشرق الأوسط" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>رمز العلم (إيموجي)</label>
              <input name="flagEmoji" placeholder="🇹🇷" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>صورة رئيسية (رابط)</label>
              <input name="featuredImage" dir="ltr" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>ترتيب العرض</label>
              <input name="displayOrder" type="number" defaultValue={0} className={inputCls} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked /> مفعّلة</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="showInMenu" defaultChecked /> في القائمة</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="showInFooter" defaultChecked /> في الفوتر</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="inSitemap" defaultChecked /> في sitemap</label>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-bold">الترجمة الأولى</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>اللغة *</label>
              <select name="locale" className={inputCls} defaultValue="ar">
                <option value="ar">العربية</option>
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>اسم الدولة (باللغة)</label>
              <input name="countryName" placeholder="تركيا" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>الرابط (slug) *</label>
              <input name="slug" required placeholder="invest-in-turkey" dir="ltr" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>العنوان الرئيسي H1 *</label>
              <input name="h1Title" required placeholder="استثمر في تركيا" className={inputCls} />
            </div>
          </div>
        </div>

        <button type="submit" className="rounded-lg bg-baraka px-6 py-3 text-sm font-bold text-white hover:bg-baraka-dark">
          إنشاء الوجهة
        </button>
      </form>
    </div>
  );
}
