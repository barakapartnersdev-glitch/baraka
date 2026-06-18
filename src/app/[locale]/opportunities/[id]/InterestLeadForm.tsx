"use client";
// نموذج «طلب اهتمام بفرصة» العام — متعدّد اللغات، يظهر عند الضغط على الزر.
import { useActionState, useState } from "react";
import { tc } from "@/lib/crm-i18n";
import { SENDER_ROLES, PREFERRED_CONTACTS } from "@/lib/crm";
import { type Locale } from "@/lib/i18n";
import { submitInterestLead } from "./actions";
import type { LeadFormState } from "@/lib/crm-submit";

const initial: LeadFormState = {};

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";

export default function InterestLeadForm({
  opportunityId,
  locale,
}: {
  opportunityId: string;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(submitInterestLead, initial);

  if (state.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-green-700 text-2xl mb-2">✓</div>
        <p className="font-bold text-green-800 mb-1">{tc(locale, "success.title")}</p>
        <p className="text-sm text-green-700 leading-relaxed">{tc(locale, "success.body")}</p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="bg-baraka-light border border-baraka/20 rounded-xl p-5 text-center">
        <p className="text-sm text-baraka-dark mb-3">{tc(locale, "interest.formSub")}</p>
        <button
          onClick={() => setOpen(true)}
          className="inline-block bg-baraka text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition"
        >
          {tc(locale, "interest.cta")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-bold text-baraka-dark mb-1">{tc(locale, "interest.formTitle")}</h2>
      <p className="text-sm text-gray-500 mb-5">{tc(locale, "interest.formSub")}</p>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="relatedOpportunityId" value={opportunityId} />
        {/* فخّ النحل — مخفي عن البشر، يملؤه الروبوت */}
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
            <label htmlFor="il-name" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.fullName")}
            </label>
            <input id="il-name" name="fullName" type="text" required autoComplete="name" className={inputCls} />
          </div>
          <div>
            <label htmlFor="il-email" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.email")}
            </label>
            <input id="il-email" name="email" type="email" required dir="ltr" autoComplete="email" className={inputCls} />
          </div>
          <div>
            <label htmlFor="il-phone" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.phone")} <span className="text-gray-400">{tc(locale, "field.optional")}</span>
            </label>
            <input id="il-phone" name="phone" type="tel" dir="ltr" autoComplete="tel" className={inputCls} />
          </div>
          <div>
            <label htmlFor="il-wa" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.whatsapp")} <span className="text-gray-400">{tc(locale, "field.optional")}</span>
            </label>
            <input id="il-wa" name="whatsapp" type="tel" dir="ltr" className={inputCls} />
          </div>
          <div>
            <label htmlFor="il-country" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.country")}
            </label>
            <input id="il-country" name="country" type="text" autoComplete="country-name" className={inputCls} />
          </div>
          <div>
            <label htmlFor="il-company" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.company")} <span className="text-gray-400">{tc(locale, "field.optional")}</span>
            </label>
            <input id="il-company" name="companyName" type="text" autoComplete="organization" className={inputCls} />
          </div>
          <div>
            <label htmlFor="il-role" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.senderRole")}
            </label>
            <select id="il-role" name="senderRole" defaultValue="" className={inputCls}>
              <option value="" disabled>
                {tc(locale, "opt.choose")}
              </option>
              {SENDER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {tc(locale, `senderRole.${r}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="il-budget" className="block text-sm text-gray-700 mb-1">
              {tc(locale, "field.budget")} <span className="text-gray-400">{tc(locale, "field.optional")}</span>
            </label>
            <input id="il-budget" name="investmentBudget" type="text" dir="ltr" className={inputCls} />
          </div>
        </div>

        <div>
          <label htmlFor="il-pref" className="block text-sm text-gray-700 mb-1">
            {tc(locale, "field.prefContact")}
          </label>
          <select id="il-pref" name="preferredContact" defaultValue="" className={inputCls}>
            <option value="" disabled>
              {tc(locale, "opt.choose")}
            </option>
            {PREFERRED_CONTACTS.map((p) => (
              <option key={p} value={p}>
                {tc(locale, `prefContact.${p}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="il-msg" className="block text-sm text-gray-700 mb-1">
            {tc(locale, "field.message")} <span className="text-gray-400">{tc(locale, "field.optional")}</span>
          </label>
          <textarea id="il-msg" name="message" rows={4} className={inputCls} />
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" name="privacy" value="1" required className="mt-1 shrink-0" />
          <span>{tc(locale, "privacy.consent")}</span>
        </label>

        {state.error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{state.error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="bg-baraka text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
          >
            {pending ? tc(locale, "submitting") : tc(locale, "submit")}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </form>
    </div>
  );
}
