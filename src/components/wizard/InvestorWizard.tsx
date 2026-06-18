"use client";
// معالج توثيق المستثمر — أقسام مستقلّة، شريط تقدّم، تحقّق، حفظ/استئناف، وإرسال للمراجعة.
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { INVESTOR_PAGES } from "@/lib/investor-form";
import type { Ans, Field, FormPage } from "@/lib/opportunity-form";
import { COUNTRIES } from "@/lib/countries";
import { saveInvestorProfile, submitInvestorProfile } from "@/app/investor/profile/actions";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-baraka focus:outline-none focus:ring-1 focus:ring-baraka/30";

export default function InvestorWizard({
  initialAnswers,
  submitted,
}: {
  initialAnswers: Ans;
  submitted: boolean;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Ans>(initialAnswers ?? {});
  const [step, setStep] = useState(0);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const [errs, setErrs] = useState<Record<string, boolean>>({});

  const totalSteps = INVESTOR_PAGES.length;
  const page: FormPage = INVESTOR_PAGES[step];
  const isLast = step === totalSteps - 1;

  function setVal(fid: string, v: string | string[]) {
    setAnswers((a) => ({ ...a, [fid]: v }));
    setErrs((e) => ({ ...e, [fid]: false }));
  }
  function toggle(fid: string, v: string) {
    setAnswers((a) => {
      const cur = Array.isArray(a[fid]) ? (a[fid] as string[]) : [];
      return { ...a, [fid]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
    setErrs((e) => ({ ...e, [fid]: false }));
  }
  const visible = (p: FormPage) => p.fields.filter((f) => !f.showIf || f.showIf(answers));

  function validate(p: FormPage): boolean {
    const e: Record<string, boolean> = {};
    for (const f of visible(p)) {
      if (f.kind === "info" || !f.required) continue;
      const x = answers[f.id];
      const empty = Array.isArray(x) ? x.length === 0 : !(x && String(x).trim());
      if (empty) e[f.id] = true;
    }
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  function save(): Promise<boolean> {
    return new Promise((resolve) => {
      start(async () => {
        const r = await saveInvestorProfile(answers);
        if (r.ok) resolve(true);
        else {
          setMsg({ t: "err", m: r.error ?? "تعذّر الحفظ." });
          resolve(false);
        }
      });
    });
  }

  async function saveExit() {
    if (await save()) router.push("/investor");
  }
  async function next() {
    if (!validate(page)) {
      setMsg({ t: "err", m: "يرجى تعبئة الحقول الإلزامية المميّزة بالأحمر." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setMsg(null);
    await save();
    setStep((s) => Math.min(s + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setMsg(null);
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    // تحقّق من كل الأقسام قبل الإرسال
    for (let i = 0; i < INVESTOR_PAGES.length; i++) {
      if (!validate(INVESTOR_PAGES[i])) {
        setStep(i);
        setMsg({ t: "err", m: "هناك حقول إلزامية ناقصة في هذا القسم." });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }
    start(async () => {
      const r = await submitInvestorProfile(answers);
      if (r.ok) {
        router.push("/investor");
        router.refresh();
      } else setMsg({ t: "err", m: r.error ?? "تعذّر الإرسال." });
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* شريط التقدّم */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-bold text-navy">{page.title}</span>
          <span className="text-gray-500">
            القسم {step + 1} من {totalSteps}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-l from-gold to-gold-soft transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`القسم ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                i === step ? "bg-gold ring-2 ring-gold/30" : i < step ? "bg-navy/60 cursor-pointer" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {submitted && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          أرسلت ملفك للمراجعة. يمكنك تحديث بياناتك في أي وقت؛ سيراجع الفريق التحديثات قبل الاعتماد.
        </p>
      )}

      {msg && (
        <p
          className={`rounded-lg border p-3 text-sm ${
            msg.t === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {msg.m}
        </p>
      )}

      {/* محتوى القسم */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-navy">{page.title}</h2>
        {page.subtitle && <p className="mt-1 mb-5 text-sm text-gray-500">{page.subtitle}</p>}
        <div className="flex flex-col gap-5">
          {visible(page).map((f) => (
            <FieldView
              key={f.id}
              f={f}
              value={answers[f.id]}
              error={!!errs[f.id]}
              onText={(v) => setVal(f.id, v)}
              onToggle={(v) => toggle(f.id, v)}
            />
          ))}
        </div>
      </div>

      {/* أزرار التنقّل */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || pending}
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
        >
          ← السابق
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={saveExit}
            disabled={pending}
            className="rounded-xl border border-baraka/40 px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-baraka-light disabled:opacity-50"
          >
            حفظ والعودة لاحقاً
          </button>
          {!isLast ? (
            <button
              type="button"
              onClick={next}
              disabled={pending}
              className="rounded-xl bg-navy px-6 py-2.5 text-sm font-bold text-white transition hover:bg-navy-600 disabled:opacity-50"
            >
              {pending ? "جارٍ الحفظ..." : "التالي →"}
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="rounded-xl bg-gradient-to-br from-gold to-gold-soft px-6 py-2.5 text-sm font-bold text-navy shadow-sm transition hover:brightness-110 disabled:opacity-50"
            >
              {pending ? "جارٍ الإرسال..." : submitted ? "حفظ التحديثات" : "إرسال الملف للمراجعة"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== عرض حقل واحد =====
function FieldView({
  f,
  value,
  error,
  onText,
  onToggle,
}: {
  f: Field;
  value: string | string[] | undefined;
  error: boolean;
  onText: (v: string) => void;
  onToggle: (v: string) => void;
}) {
  if (f.kind === "info") {
    const warn = f.noteTone === "warn";
    return (
      <div
        className={`rounded-lg border p-3 text-sm leading-relaxed ${
          warn ? "border-amber-200 bg-amber-50 text-amber-800" : "border-baraka/20 bg-baraka-light text-navy"
        }`}
      >
        {f.note}
      </div>
    );
  }

  const v = (value as string) ?? "";

  return (
    <div className={error ? "rounded-lg ring-1 ring-red-300 bg-red-50/30 p-2 -m-2" : ""}>
      <label className="mb-1.5 block text-sm font-semibold text-gray-800">
        {f.label}
        {f.required && <span className="text-red-500"> *</span>}
      </label>
      {f.example && <p className="mb-1.5 text-xs text-gray-400">مثال: {f.example}</p>}

      {f.kind === "textarea" ? (
        <textarea rows={3} value={v} onChange={(e) => onText(e.target.value)} className={inputCls} placeholder={f.placeholder} />
      ) : f.kind === "country" ? (
        <input list="baraka-countries-inv" value={v} onChange={(e) => onText(e.target.value)} className={inputCls} placeholder="اختر دولة..." />
      ) : f.kind === "radio" ? (
        <div className="flex flex-col gap-2">
          {f.options?.map((o) => {
            const sel = v === o.v;
            return (
              <button
                key={o.v}
                type="button"
                onClick={() => onText(o.v)}
                className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-start text-sm transition ${
                  sel ? "border-baraka bg-baraka-light font-semibold text-navy" : "border-gray-200 hover:border-baraka/40 hover:bg-gray-50"
                }`}
              >
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${sel ? "border-baraka" : "border-gray-300"}`}>
                  {sel && <span className="h-2 w-2 rounded-full bg-baraka" />}
                </span>
                {o.l}
              </button>
            );
          })}
        </div>
      ) : f.kind === "checkbox" ? (
        <div className="flex flex-col gap-2">
          {f.options?.map((o) => {
            const sel = Array.isArray(value) && value.includes(o.v);
            return (
              <button
                key={o.v}
                type="button"
                onClick={() => onToggle(o.v)}
                className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-start text-sm transition ${
                  sel ? "border-baraka bg-baraka-light font-semibold text-navy" : "border-gray-200 hover:border-baraka/40 hover:bg-gray-50"
                }`}
              >
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${sel ? "border-baraka bg-baraka text-white" : "border-gray-300"}`}>
                  {sel && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                  )}
                </span>
                {o.l}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          type={f.kind === "email" ? "email" : f.kind === "tel" ? "tel" : f.kind === "url" ? "url" : "text"}
          inputMode={f.kind === "number" || f.kind === "percent" || f.kind === "money" ? "numeric" : undefined}
          value={v}
          onChange={(e) => onText(e.target.value)}
          className={inputCls}
          placeholder={f.placeholder ?? (f.kind === "money" ? "USD" : undefined)}
        />
      )}

      {f.help && <p className="mt-1.5 text-xs text-gray-500">{f.help}</p>}
      <datalist id="baraka-countries-inv">
        {COUNTRIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </div>
  );
}
