"use client";
// نموذج إنشاء ونشر فرصة استثمارية من لوحة الإدارة (عربي).
// يجمع الحقول + رابط الصورة المرفوعة، ثم يستدعي createAndPublishOpportunity
// (التي تترجم بالذكاء الاصطناعي وتنشر). يعرض حالة «جارٍ الترجمة والنشر».
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { createAndPublishOpportunity } from "./actions";

type DestOption = { id: string; label: string };

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-baraka focus:ring-1 focus:ring-baraka";
const labelCls = "mb-1 block text-xs font-medium text-gray-600";

export default function NewOpportunityForm({
  destinations,
}: {
  destinations: DestOption[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; warning?: string } | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);

    startTransition(async () => {
      const res = await createAndPublishOpportunity(fd);
      if (!res.ok) {
        setError(res.error ?? "تعذّر النشر.");
        return;
      }
      if (res.warning) {
        // نُشرت لكن مع تنبيه ترجمة — اعرض ملخّصاً مع رابط
        setDone({ id: res.id!, warning: res.warning });
      } else {
        router.push(`/admin/opportunities/${res.id}?ok=published`);
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="mb-2 font-bold text-emerald-800">تم نشر الفرصة ✓</h2>
        {done.warning && (
          <p className="mb-4 text-sm text-amber-700">{done.warning}</p>
        )}
        <div className="flex gap-3">
          <Link
            href={`/admin/opportunities/${done.id}`}
            className="rounded-lg bg-baraka px-5 py-2 text-sm font-bold text-white hover:bg-baraka-dark"
          >
            فتح صفحة الفرصة
          </Link>
          <Link
            href="/admin/opportunities"
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm hover:bg-gray-50"
          >
            كل الفرص
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      {/* الصورة */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-bold">صورة الفرصة</h2>
        <ImageUploadField
          name="coverImageUrl"
          label="الصورة الرئيسية (تظهر في البطاقة وصفحة الفرصة) *"
          folder="opportunities"
          required
        />
      </div>

      {/* المحتوى بالعربية */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-1 font-bold">المحتوى (بالعربية)</h2>
        <p className="mb-4 text-xs text-gray-400">
          يُترجَم تلقائياً للإنجليزية والصينية والتركية عند النشر.
        </p>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>عنوان الفرصة *</label>
            <input name="displayTitle" required className={inputCls} placeholder="مثال: شراكة في مصنع أغذية — إسطنبول" />
          </div>
          <div>
            <label className={labelCls}>المقدمة الاستثمارية *</label>
            <textarea name="summary" required rows={4} className={inputCls} placeholder="نبذة تعريفية جذّابة عن الفرصة دون كشف الهوية أو الموقع الدقيق." />
          </div>
          <div>
            <label className={labelCls}>أبرز النقاط</label>
            <textarea name="highlights" rows={5} className={inputCls} placeholder="كل سطر = نقطة" />
            <p className="mt-1 text-[11px] text-gray-400">اكتب كل ميزة في سطر مستقل.</p>
          </div>
          <div>
            <label className={labelCls}>تفاصيل إضافية</label>
            <textarea name="details" rows={5} className={inputCls} placeholder="شرح أوسع للفرصة (اختياري)." />
          </div>
        </div>
      </div>

      {/* التصنيف والموقع */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-bold">التصنيف والموقع</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>القطاع *</label>
            <input name="sector" required className={inputCls} placeholder="مثال: تصنيع أغذية" />
          </div>
          <div>
            <label className={labelCls}>الدولة *</label>
            <input name="country" required className={inputCls} placeholder="مثال: تركيا" />
          </div>
          <div>
            <label className={labelCls}>المدينة *</label>
            <input name="city" required className={inputCls} placeholder="مثال: إسطنبول" />
          </div>
          <div>
            <label className={labelCls}>وجهة الاستثمار (صفحة الدولة)</label>
            <select name="destinationId" className={inputCls} defaultValue="">
              <option value="">— بدون ربط بدولة —</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-gray-400">
              عند الاختيار تظهر الفرصة أيضاً في صفحة الدولة.
            </p>
          </div>
        </div>
      </div>

      {/* نطاق الاستثمار */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-bold">نطاق الاستثمار</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>الحد الأدنى</label>
            <input name="investmentMin" inputMode="numeric" dir="ltr" className={inputCls} placeholder="1000000" />
          </div>
          <div>
            <label className={labelCls}>الحد الأعلى</label>
            <input name="investmentMax" inputMode="numeric" dir="ltr" className={inputCls} placeholder="2000000" />
          </div>
          <div>
            <label className={labelCls}>العملة</label>
            <select name="currency" className={inputCls} defaultValue="USD">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="TRY">TRY</option>
              <option value="SAR">SAR</option>
              <option value="AED">AED</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-baraka px-6 py-3 text-sm font-bold text-white hover:bg-baraka-dark disabled:opacity-60"
        >
          {pending ? "جارٍ الترجمة والنشر..." : "ترجمة ونشر"}
        </button>
        {pending && (
          <span className="text-xs text-gray-400">قد تستغرق الترجمة بضع ثوانٍ.</span>
        )}
      </div>
    </form>
  );
}
