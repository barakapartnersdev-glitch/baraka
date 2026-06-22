"use client";
// نموذج إنشاء ونشر فرصة استثمارية من لوحة الإدارة (عربي).
// يجمع الحقول + رابط الصورة المرفوعة، ثم يستدعي createAndPublishOpportunity
// (التي تترجم بالذكاء الاصطناعي وتنشر). يعرض حالة «جارٍ الترجمة والنشر».
// إضافةً لذلك: زر «تحليل ملف المشروع» يقرأ ملفاً (PDF/صورة/نص) بالذكاء الاصطناعي
// ويملأ الحقول تلقائياً ليراجعها الأدمن قبل النشر.
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { createAndPublishOpportunity, extractOpportunityFromFile } from "./actions";
import type { OppDraft } from "@/lib/ai-extract";

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
  const docInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [analyzing, startAnalyze] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [analyzeMsg, setAnalyzeMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [done, setDone] = useState<{ id: string; warning?: string } | null>(null);

  // يضبط قيمة حقل غير مُتحكَّم به عبر مرجع النموذج.
  function setField(name: string, value?: string) {
    const el = formRef.current?.elements.namedItem(name) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null;
    if (el && value != null && value !== "") el.value = value;
  }

  // يملأ النموذج من مسوّدة الذكاء الاصطناعي.
  function applyDraft(d: OppDraft) {
    setField("displayTitle", d.displayTitle);
    setField("summary", d.summary);
    setField("highlights", d.highlights);
    setField("details", d.details);
    setField("paybackPeriod", d.paybackPeriod);
    setField("annualReturn", d.annualReturn);
    setField("sector", d.sector);
    setField("country", d.country);
    setField("city", d.city);
    setField("investmentMin", d.investmentMin);
    setField("investmentMax", d.investmentMax);
    // العملة: لا تُضبط إلا إن كانت ضمن خيارات القائمة (تفادياً لإفراغها)
    if (d.currency) {
      const sel = formRef.current?.elements.namedItem("currency") as HTMLSelectElement | null;
      if (sel && Array.from(sel.options).some((o) => o.value === d.currency)) {
        sel.value = d.currency;
      }
    }
    // محاولة مطابقة الوجهة حسب اسم الدولة
    if (d.country) {
      const match = destinations.find(
        (x) => x.label.includes(d.country!) || d.country!.includes(x.label)
      );
      if (match) setField("destinationId", match.id);
    }
  }

  function onAnalyze(file: File | undefined) {
    if (!file) return;
    setAnalyzeMsg(null);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    startAnalyze(async () => {
      const res = await extractOpportunityFromFile(fd);
      if (res.ok && res.draft) {
        applyDraft(res.draft);
        setAnalyzeMsg({ ok: true, text: "تم تحليل الملف وتعبئة الحقول. راجِعها وعدّلها قبل النشر." });
      } else {
        setAnalyzeMsg({ ok: false, text: res.error ?? "تعذّر تحليل الملف." });
      }
      if (docInputRef.current) docInputRef.current.value = "";
    });
  }

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
        {done.warning && <p className="mb-4 text-sm text-amber-700">{done.warning}</p>}
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
      {/* تحليل ملف المشروع بالذكاء الاصطناعي */}
      <div className="rounded-2xl border-2 border-dashed border-baraka/40 bg-baraka-light/40 p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-baraka text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M9 13l2 2 4-4" />
            </svg>
          </span>
          <div className="flex-1">
            <h2 className="font-bold">تحليل ملف المشروع بالذكاء الاصطناعي (اختياري)</h2>
            <p className="mt-1 text-xs text-gray-600">
              ارفع ملف المشروع (دراسة جدوى / عرض / مذكرة بصيغة PDF أو صورة أو نص) ليقرأه الذكاء
              الاصطناعي ويملأ الحقول أدناه تلقائياً ببناء نص عرض مناسب. راجِع الحقول وعدّلها قبل النشر.
            </p>
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,image/*,.txt,.md,.csv"
              className="hidden"
              onChange={(e) => onAnalyze(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              disabled={analyzing}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-baraka px-4 py-2 text-sm font-bold text-white hover:bg-baraka-dark disabled:opacity-60"
            >
              {analyzing ? "جارٍ قراءة الملف وتحليله..." : "رفع ملف المشروع وتحليله"}
            </button>
            {analyzing && (
              <span className="mr-2 text-xs text-gray-500">قد يستغرق التحليل بضع ثوانٍ.</span>
            )}
            {analyzeMsg && (
              <p className={`mt-2 text-xs ${analyzeMsg.ok ? "text-emerald-700" : "text-rose-700"}`}>
                {analyzeMsg.text}
              </p>
            )}
          </div>
        </div>
      </div>

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

      {/* نطاق الاستثمار والعوائد */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-bold">نطاق الاستثمار والعوائد</h2>
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
          <div>
            <label className={labelCls}>العائد السنوي المتوقع</label>
            <input name="annualReturn" className={inputCls} placeholder="مثال: 15% سنوياً" />
          </div>
          <div>
            <label className={labelCls}>فترة الاسترداد المتوقعة لرأس المال</label>
            <input name="paybackPeriod" className={inputCls} placeholder="مثال: سنتان" />
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
