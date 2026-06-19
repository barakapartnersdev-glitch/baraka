"use client";
// نموذج «طلب الانضمام كسفير استثمار» العام — يفتح على مراحل (wizard) كصفحة وكيل صاحب الأصل.
// نحافظ على النموذج الأصلي (<form action={submitAmbassador}>) وأسماء الحقول كما هي، فلا يتغيّر
// أي شيء في الخادم؛ نعرض قسماً واحداً في كل مرة مع شريط تقدّم وأزرار السابق/التالي.
// كل الأقسام تبقى في DOM (نُخفي غير النشط بكلاس) كي يرسل الإرسال الواحد جميع الحقول.
// تحقّق الحقول المطلوبة في الأقسام الأولى يتم بالـ JS عند «التالي»؛ أما إقرارات القسم الأخير
// فتبقى required أصلية (القسم ظاهر وقت الإرسال) لتفادي مشكلة الحقل المخفي «غير القابل للتركيز».
import { useActionState, useRef, useState } from "react";
import { ta } from "@/lib/ambassador-i18n";
import { type Locale } from "@/lib/i18n";
import {
  WORK_TYPES,
  YEARS_EXPERIENCE,
  INVESTOR_TYPES,
  SECTORS,
  INVESTMENT_RANGES,
  RELATIONSHIP_TYPES,
  YES_NO,
  REGION_KNOWLEDGE,
  LANGUAGES,
  FILE_FIELDS,
  REQUIRED_CONSENTS,
} from "@/lib/ambassador-form";
import { submitAmbassador } from "./actions";
import type { AmbassadorFormState } from "@/lib/ambassador-submit";

const initial: AmbassadorFormState = {};
const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

// نصوص واجهة الـ wizard فقط (غير مخزّنة في ambassador-i18n) — بأربع لغات.
const WIZ: Record<Locale, { back: string; next: string; sec: string; of: string; required: string }> = {
  ar: { back: "السابق", next: "التالي", sec: "القسم", of: "من", required: "يرجى تعبئة الحقول المطلوبة في هذا القسم." },
  en: { back: "Back", next: "Next", sec: "Section", of: "of", required: "Please fill in the required fields in this section." },
  tr: { back: "Geri", next: "İleri", sec: "Bölüm", of: "/", required: "Lütfen bu bölümdeki zorunlu alanları doldurun." },
  zh: { back: "上一步", next: "下一步", sec: "第", of: "/", required: "请填写本部分的必填字段。" },
};

const STEP_TITLE_KEYS = [
  "sec.personal",
  "sec.professional",
  "sec.network",
  "sec.evaluation",
  "sec.files",
  "sec.consents",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border border-gray-200 rounded-xl p-5">
      <legend className="px-2 text-sm font-bold text-baraka-dark">{title}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </fieldset>
  );
}

function Optional({ locale }: { locale: Locale }) {
  return <span className="text-gray-400 font-normal">{ta(locale, "f.optional")}</span>;
}

function Req() {
  return <span className="text-red-500"> *</span>;
}

function Field({
  locale,
  name,
  labelKey,
  type = "text",
  required = false,
  ltr = false,
  optional = false,
}: {
  locale: Locale;
  name: string;
  labelKey: string;
  type?: string;
  required?: boolean;
  ltr?: boolean;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={`amb-${name}`} className={labelCls}>
        {ta(locale, labelKey)} {required && <Req />} {optional && <Optional locale={locale} />}
      </label>
      <input
        id={`amb-${name}`}
        name={name}
        type={type}
        data-req={required ? "1" : undefined}
        dir={ltr ? "ltr" : undefined}
        className={inputCls}
      />
    </div>
  );
}

function Area({
  locale,
  name,
  labelKey,
  optional = false,
}: {
  locale: Locale;
  name: string;
  labelKey: string;
  optional?: boolean;
}) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={`amb-${name}`} className={labelCls}>
        {ta(locale, labelKey)} {optional && <Optional locale={locale} />}
      </label>
      <textarea id={`amb-${name}`} name={name} rows={3} className={inputCls} />
    </div>
  );
}

function SelectField({
  locale,
  name,
  labelKey,
  options,
  prefix,
  required = false,
}: {
  locale: Locale;
  name: string;
  labelKey: string;
  options: readonly string[];
  prefix: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={`amb-${name}`} className={labelCls}>
        {ta(locale, labelKey)} {required && <Req />}
      </label>
      <select id={`amb-${name}`} name={name} defaultValue="" data-req={required ? "1" : undefined} className={inputCls}>
        <option value="" disabled>
          {ta(locale, "opt.choose")}
        </option>
        {options.map((v) => (
          <option key={v} value={v}>
            {ta(locale, `${prefix}.${v}`)}
          </option>
        ))}
      </select>
    </div>
  );
}

function RadioGroup({
  locale,
  name,
  labelKey,
  options,
  prefix,
}: {
  locale: Locale;
  name: string;
  labelKey: string;
  options: readonly string[];
  prefix: string;
}) {
  return (
    <div className="sm:col-span-2">
      <span className={labelCls}>{ta(locale, labelKey)}</span>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map((v) => (
          <label key={v} className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" name={name} value={v} className="shrink-0" />
            {ta(locale, `${prefix}.${v}`)}
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckGroup({
  locale,
  name,
  labelKey,
  options,
  prefix,
}: {
  locale: Locale;
  name: string;
  labelKey: string;
  options: readonly string[];
  prefix: string;
}) {
  return (
    <div className="sm:col-span-2">
      <span className={labelCls}>{ta(locale, labelKey)}</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
        {options.map((v) => (
          <label key={v} className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name={name} value={v} className="shrink-0" />
            {ta(locale, `${prefix}.${v}`)}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function AmbassadorForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(submitAmbassador, initial);
  const [step, setStep] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const w = WIZ[locale] ?? WIZ.en;
  const total = STEP_TITLE_KEYS.length;

  if (state.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-green-700 text-3xl mb-2">✓</div>
        <p className="font-bold text-lg text-green-800 mb-1">{ta(locale, "success.title")}</p>
        <p className="text-sm text-green-700 leading-relaxed max-w-md mx-auto">{ta(locale, "success.body")}</p>
      </div>
    );
  }

  // تحقّق الحقول المطلوبة (data-req) ضمن القسم الحالي — للأقسام قبل الأخير.
  function validateStep(s: number): boolean {
    const root = formRef.current;
    if (!root) return true;
    const stepEl = root.querySelector<HTMLElement>(`[data-step="${s}"]`);
    if (!stepEl) return true;
    const ctrls = stepEl.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[data-req='1']");
    let firstInvalid: HTMLElement | null = null;
    ctrls.forEach((el) => {
      const empty = !el.value || !el.value.trim();
      el.classList.toggle("!border-red-400", empty);
      el.classList.toggle("border-red-400", empty);
      if (empty && !firstInvalid) firstInvalid = el as HTMLElement;
    });
    if (firstInvalid) {
      (firstInvalid as HTMLElement).focus();
      return false;
    }
    return true;
  }

  function goTo(target: number) {
    setMsg(null);
    setStep(target);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function next() {
    if (!validateStep(step)) {
      setMsg(w.required);
      return;
    }
    goTo(Math.min(step + 1, total - 1));
  }
  function back() {
    goTo(Math.max(0, step - 1));
  }

  // إزالة تمييز الخطأ عند الكتابة
  function onInput(e: React.FormEvent<HTMLFormElement>) {
    const t = e.target as HTMLElement;
    if (t?.classList?.contains("border-red-400")) {
      t.classList.remove("border-red-400", "!border-red-400");
    }
  }

  const show = (i: number) => (step === i ? "" : "hidden");

  return (
    <form ref={formRef} action={formAction} onInput={onInput} className="flex flex-col gap-6">
      {/* فخّ النحل — مخفي عن البشر */}
      <input
        type="text"
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {/* شريط التقدّم */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-bold text-navy">{ta(locale, STEP_TITLE_KEYS[step])}</span>
          <span className="text-gray-500">
            {w.sec} {step + 1} {w.of} {total}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-l from-gold to-gold-soft transition-all duration-300"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {msg && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{msg}</p>}

      {/* 1) البيانات الشخصية */}
      <div data-step={0} className={show(0)}>
        <Section title={ta(locale, "sec.personal")}>
          <Field locale={locale} name="fullName" labelKey="f.fullName" required />
          <Field locale={locale} name="nationality" labelKey="f.nationality" required />
          <Field locale={locale} name="residenceCountry" labelKey="f.residenceCountry" required />
          <Field locale={locale} name="city" labelKey="f.city" required />
          <Field locale={locale} name="phone" labelKey="f.phone" type="tel" required ltr />
          <Field locale={locale} name="whatsapp" labelKey="f.whatsapp" type="tel" ltr optional />
          <Field locale={locale} name="email" labelKey="f.email" type="email" required ltr />
          <SelectField locale={locale} name="preferredLanguage" labelKey="f.preferredLanguage" options={LANGUAGES} prefix="opt.lang" required />
          <CheckGroup locale={locale} name="spokenLanguages" labelKey="f.spokenLanguages" options={LANGUAGES} prefix="opt.lang" />
        </Section>
      </div>

      {/* 2) البيانات المهنية */}
      <div data-step={1} className={show(1)}>
        <Section title={ta(locale, "sec.professional")}>
          <Field locale={locale} name="currentTitle" labelKey="f.currentTitle" optional />
          <Field locale={locale} name="companyName" labelKey="f.companyName" optional />
          <Field locale={locale} name="professionalRole" labelKey="f.professionalRole" optional />
          <SelectField locale={locale} name="yearsOfExperience" labelKey="f.yearsOfExperience" options={YEARS_EXPERIENCE} prefix="opt.years" />
          <SelectField locale={locale} name="workType" labelKey="f.workType" options={WORK_TYPES} prefix="opt.workType" required />
          <Field locale={locale} name="website" labelKey="f.website" type="url" ltr optional />
          <Field locale={locale} name="linkedinUrl" labelKey="f.linkedin" type="url" ltr optional />
          <Field locale={locale} name="otherLinks" labelKey="f.otherLinks" ltr optional />
        </Section>
      </div>

      {/* 3) شبكة العلاقات */}
      <div data-step={2} className={show(2)}>
        <Section title={ta(locale, "sec.network")}>
          <div className="sm:col-span-2">
            <label htmlFor="amb-coveredCountries" className={labelCls}>
              {ta(locale, "f.coveredCountries")}
            </label>
            <input id="amb-coveredCountries" name="coveredCountries" type="text" className={inputCls} />
            <p className="text-xs text-gray-400 mt-1">{ta(locale, "f.coveredCountries.help")}</p>
          </div>
          <CheckGroup locale={locale} name="investorTypes" labelKey="f.investorTypes" options={INVESTOR_TYPES} prefix="opt.investorType" />
          <CheckGroup locale={locale} name="coveredSectors" labelKey="f.coveredSectors" options={SECTORS} prefix="opt.sector" />
          <RadioGroup locale={locale} name="investmentRange" labelKey="f.investmentRange" options={INVESTMENT_RANGES} prefix="opt.range" />
          <RadioGroup locale={locale} name="relationshipType" labelKey="f.relationshipType" options={RELATIONSHIP_TYPES} prefix="opt.relationship" />
          <RadioGroup locale={locale} name="previousExperience" labelKey="f.previousExperience" options={YES_NO} prefix="opt.yesno" />
          <Area locale={locale} name="experienceSummary" labelKey="f.experienceSummary" optional />
        </Section>
      </div>

      {/* 4) أسئلة التقييم */}
      <div data-step={3} className={show(3)}>
        <Section title={ta(locale, "sec.evaluation")}>
          <Area locale={locale} name="motivation" labelKey="f.motivation" />
          <Area locale={locale} name="addedValue" labelKey="f.addedValue" />
          <RadioGroup locale={locale} name="canArrangeMeetings" labelKey="f.canArrangeMeetings" options={YES_NO} prefix="opt.yesno" />
          <RadioGroup locale={locale} name="negotiationExperience" labelKey="f.negotiationExperience" options={YES_NO} prefix="opt.yesno" />
          <RadioGroup locale={locale} name="regionKnowledge" labelKey="f.regionKnowledge" options={REGION_KNOWLEDGE} prefix="opt.region" />
          <Area locale={locale} name="conflictOfInterest" labelKey="f.conflictOfInterest" optional />
        </Section>
      </div>

      {/* 5) المرفقات */}
      <div data-step={4} className={show(4)}>
        <Section title={ta(locale, "sec.files")}>
          <div className="sm:col-span-2 -mb-1">
            <p className="text-xs text-gray-500">{ta(locale, "f.filesHint")}</p>
          </div>
          <div>
            <label htmlFor="amb-photo" className={labelCls}>
              {ta(locale, "f.photo")} <Optional locale={locale} />
            </label>
            <input id="amb-photo" name="photo" type="file" accept="image/png,image/jpeg" className="text-sm" />
          </div>
          {FILE_FIELDS.map((f) => (
            <div key={f.name}>
              <label htmlFor={`amb-${f.name}`} className={labelCls}>
                {ta(locale, f.labelKey)} <Optional locale={locale} />
              </label>
              <input
                id={`amb-${f.name}`}
                name={f.name}
                type="file"
                accept=".pdf,.doc,.docx,image/png,image/jpeg"
                className="text-sm"
              />
            </div>
          ))}
        </Section>
      </div>

      {/* 6) الإقرارات — required أصلية (القسم ظاهر وقت الإرسال) */}
      <div data-step={5} className={show(5)}>
        <fieldset className="border border-gray-200 rounded-xl p-5">
          <legend className="px-2 text-sm font-bold text-baraka-dark">{ta(locale, "sec.consents")}</legend>
          <div className="flex flex-col gap-3">
            {REQUIRED_CONSENTS.map((c) => (
              <label key={c.field} className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" name={c.field} value="1" required className="mt-1 shrink-0" />
                <span>{ta(locale, c.labelKey)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{state.error}</p>
      )}

      {/* أزرار التنقّل */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || pending}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
        >
          {w.back}
        </button>
        {step < total - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={pending}
            className="rounded-lg bg-navy px-6 py-2.5 text-sm font-bold text-white transition hover:bg-navy-600 disabled:opacity-50"
          >
            {w.next}
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-baraka px-8 py-3 text-sm font-bold text-white transition hover:bg-baraka-dark disabled:opacity-60"
          >
            {pending ? ta(locale, "submitting") : ta(locale, "submit")}
          </button>
        )}
      </div>
    </form>
  );
}
