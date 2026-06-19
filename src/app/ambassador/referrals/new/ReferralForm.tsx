"use client";
// نموذج ترشيح مستثمر — بوّابة السفير.
import { useActionState } from "react";
import Link from "next/link";
import { ta } from "@/lib/ambassador-i18n";
import { type Locale } from "@/lib/i18n";
import {
  REF_INVESTOR_TYPES,
  REF_RELATIONSHIP,
  REF_SERIOUSNESS,
  REF_CONSENT,
  SECTORS,
  INVESTMENT_RANGES,
} from "@/lib/ambassador-form";
import { submitReferral, type ReferralFormState } from "../actions";

const initial: ReferralFormState = {};
const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

function Field({
  locale,
  name,
  labelKey,
  type = "text",
  required = false,
  ltr = false,
}: {
  locale: Locale;
  name: string;
  labelKey: string;
  type?: string;
  required?: boolean;
  ltr?: boolean;
}) {
  return (
    <div>
      <label htmlFor={`r-${name}`} className={labelCls}>
        {ta(locale, labelKey)}
      </label>
      <input id={`r-${name}`} name={name} type={type} required={required} dir={ltr ? "ltr" : undefined} className={inputCls} />
    </div>
  );
}

function Sel({
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
    <div>
      <label htmlFor={`r-${name}`} className={labelCls}>
        {ta(locale, labelKey)}
      </label>
      <select id={`r-${name}`} name={name} defaultValue="" className={inputCls}>
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

export default function ReferralForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(submitReferral, initial);
  const t = (k: string) => ta(locale, k);

  if (state.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-green-700 text-3xl mb-2">✓</div>
        <p className="text-sm text-green-700 mb-4">{t("ref.success")}</p>
        <Link href="/ambassador/referrals" className="text-baraka hover:underline text-sm font-medium">
          {t("ref.title")}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3">{t("ref.privacyNote")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field locale={locale} name="investorName" labelKey="ref.f.investorName" required />
        <Field locale={locale} name="investorCompany" labelKey="ref.f.investorCompany" />
        <Field locale={locale} name="investorCountry" labelKey="ref.f.investorCountry" />
        <Field locale={locale} name="investorCity" labelKey="ref.f.investorCity" />
        <Sel locale={locale} name="investorType" labelKey="ref.f.investorType" options={REF_INVESTOR_TYPES} prefix="ref.opt.investorType" />
        <Sel locale={locale} name="investmentRange" labelKey="ref.f.investmentRange" options={INVESTMENT_RANGES} prefix="opt.range" />
        <Sel locale={locale} name="relationship" labelKey="ref.f.relationship" options={REF_RELATIONSHIP} prefix="ref.opt.relationship" />
        <Sel locale={locale} name="seriousness" labelKey="ref.f.seriousness" options={REF_SERIOUSNESS} prefix="ref.opt.seriousness" />
        <Sel locale={locale} name="consent" labelKey="ref.f.consent" options={REF_CONSENT} prefix="ref.opt.consent" />
      </div>

      <div>
        <span className={labelCls}>{t("ref.f.interestedSectors")}</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-2">
          {SECTORS.map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="interestedSectors" value={v} className="shrink-0" />
              {t(`opt.sector.${v}`)}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field locale={locale} name="contactEmail" labelKey="ref.f.contactEmail" type="email" ltr />
        <Field locale={locale} name="contactPhone" labelKey="ref.f.contactPhone" type="tel" ltr />
        <Field locale={locale} name="linkedinUrl" labelKey="ref.f.linkedin" type="url" ltr />
        <Field locale={locale} name="website" labelKey="ref.f.website" type="url" ltr />
      </div>

      <div>
        <label htmlFor="r-description" className={labelCls}>{t("ref.f.description")}</label>
        <textarea id="r-description" name="description" rows={3} className={inputCls} />
      </div>
      <div>
        <label htmlFor="r-notes" className={labelCls}>{t("ref.f.notes")}</label>
        <textarea id="r-notes" name="notes" rows={2} className={inputCls} />
      </div>

      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{state.error}</p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-baraka text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {pending ? t("ref.submitting") : t("ref.submit")}
        </button>
      </div>
    </form>
  );
}
