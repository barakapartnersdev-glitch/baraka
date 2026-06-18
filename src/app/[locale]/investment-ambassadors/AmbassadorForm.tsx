"use client";
// نموذج «طلب الانضمام كسفير استثمار» العام — متعدّد اللغات (RTL/LTR)، رفع ملفات، إقرارات.
// مكوّنات الحقول مُعرّفة على مستوى الوحدة (هوية ثابتة) كي لا تُفقد القيم عند إعادة العرض بعد خطأ.
import { useActionState } from "react";
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
        {ta(locale, labelKey)} {optional && <Optional locale={locale} />}
      </label>
      <input
        id={`amb-${name}`}
        name={name}
        type={type}
        required={required}
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
        {ta(locale, labelKey)}
      </label>
      <select id={`amb-${name}`} name={name} defaultValue="" required={required} className={inputCls}>
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

  if (state.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-green-700 text-3xl mb-2">✓</div>
        <p className="font-bold text-lg text-green-800 mb-1">{ta(locale, "success.title")}</p>
        <p className="text-sm text-green-700 leading-relaxed max-w-md mx-auto">{ta(locale, "success.body")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* فخّ النحل — مخفي عن البشر */}
      <input
        type="text"
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {/* البيانات الشخصية */}
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

      {/* البيانات المهنية */}
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

      {/* شبكة العلاقات */}
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

      {/* أسئلة التقييم */}
      <Section title={ta(locale, "sec.evaluation")}>
        <Area locale={locale} name="motivation" labelKey="f.motivation" />
        <Area locale={locale} name="addedValue" labelKey="f.addedValue" />
        <RadioGroup locale={locale} name="canArrangeMeetings" labelKey="f.canArrangeMeetings" options={YES_NO} prefix="opt.yesno" />
        <RadioGroup locale={locale} name="negotiationExperience" labelKey="f.negotiationExperience" options={YES_NO} prefix="opt.yesno" />
        <RadioGroup locale={locale} name="regionKnowledge" labelKey="f.regionKnowledge" options={REGION_KNOWLEDGE} prefix="opt.region" />
        <Area locale={locale} name="conflictOfInterest" labelKey="f.conflictOfInterest" optional />
      </Section>

      {/* المرفقات */}
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

      {/* الإقرارات */}
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

      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{state.error}</p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-baraka text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {pending ? ta(locale, "submitting") : ta(locale, "submit")}
        </button>
      </div>
    </form>
  );
}
