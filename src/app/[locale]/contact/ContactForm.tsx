"use client";
// نموذج التواصل العام — متعدّد اللغات، يحفظ الرسالة كـ CrmLead في لوحة الإدارة.
import { useActionState } from "react";
import { tc } from "@/lib/crm-i18n";
import { tcc, REQUEST_TYPES } from "@/lib/contact-i18n";
import { type Locale } from "@/lib/i18n";
import { submitContactLead } from "./actions";
import type { LeadFormState } from "@/lib/crm-submit";

const initial: LeadFormState = {};

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";

export default function ContactForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(submitContactLead, initial);

  if (state.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="text-green-700 text-2xl mb-2">✓</div>
        <p className="font-bold text-green-800 mb-1">{tc(locale, "success.title")}</p>
        <p className="text-sm text-green-700 leading-relaxed">{tc(locale, "success.body")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-baraka-dark mb-1">{tcc(locale, "contact.formTitle")}</h2>
      <p className="text-sm text-gray-500 mb-5">{tcc(locale, "contact.formSub")}</p>

      <form action={formAction} className="flex flex-col gap-4">
        {/* فخّ النحل */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="c-name" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.fullName")}
            </label>
            <input id="c-name" name="fullName" type="text" required autoComplete="name" className={inputCls} />
          </div>
          <div>
            <label htmlFor="c-email" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.email")}
            </label>
            <input id="c-email" name="email" type="email" required dir="ltr" autoComplete="email" className={inputCls} />
          </div>
          <div>
            <label htmlFor="c-phone" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.phone")} <span className="text-gray-400">{tc(locale, "field.optional")}</span>
            </label>
            <input id="c-phone" name="phone" type="tel" dir="ltr" autoComplete="tel" className={inputCls} />
          </div>
          <div>
            <label htmlFor="c-country" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.country")} <span className="text-gray-400">{tc(locale, "field.optional")}</span>
            </label>
            <input id="c-country" name="country" type="text" autoComplete="country-name" className={inputCls} />
          </div>
        </div>

        <div>
          <label htmlFor="c-rt" className="block text-sm text-gray-700 mb-1">
            {tcc(locale, "field.requestType")}
          </label>
          <select id="c-rt" name="requestType" defaultValue="general" className={inputCls}>
            {REQUEST_TYPES.map((rt) => (
              <option key={rt} value={rt}>
                {tcc(locale, `rt.${rt}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="c-msg" className="block text-sm text-gray-700 mb-1">
            {tc(locale, "field.message")}
          </label>
          <textarea id="c-msg" name="message" rows={5} required className={inputCls} />
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" name="privacy" value="1" required className="mt-1 shrink-0" />
          <span>{tc(locale, "privacy.consent")}</span>
        </label>

        {state.error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-baraka text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60 w-fit"
        >
          {pending ? tc(locale, "submitting") : tc(locale, "submit")}
        </button>
      </form>
    </div>
  );
}
