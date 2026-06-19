"use client";
// نموذج تواصل سريع للصفحة الرئيسية — متعدّد اللغات، يحفظ المدخلات كـ CrmLead.
import { useActionState } from "react";
import { tc } from "@/lib/crm-i18n";
import { thq, HOME_INTERESTS } from "@/lib/home-quick-i18n";
import { type Locale } from "@/lib/i18n";
import { submitHomeQuickLead } from "./home-actions";
import type { LeadFormState } from "@/lib/crm-submit";

const initial: LeadFormState = {};

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";

export default function HomeQuickForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(submitHomeQuickLead, initial);

  if (state.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center max-w-xl mx-auto">
        <div className="text-green-700 text-2xl mb-2">✓</div>
        <p className="font-bold text-green-800 mb-1">{tc(locale, "success.title")}</p>
        <p className="text-sm text-green-700 leading-relaxed">{tc(locale, "success.body")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-xl mx-auto shadow-sm">
      <h3 className="text-lg font-bold text-baraka-dark mb-1">{thq(locale, "quickTitle")}</h3>
      <p className="text-sm text-gray-500 mb-5">{thq(locale, "quickSub")}</p>

      <form action={formAction} className="flex flex-col gap-3">
        {/* فخّ النحل */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="fullName" type="text" required autoComplete="name" placeholder={tc(locale, "field.fullName")} className={inputCls} />
          <input name="email" type="email" required dir="ltr" autoComplete="email" placeholder={tc(locale, "field.email")} className={inputCls} />
          <input name="phone" type="tel" dir="ltr" autoComplete="tel" placeholder={thq(locale, "phoneWa")} className={inputCls} />
          <select name="interestType" defaultValue="looking" className={inputCls} aria-label={thq(locale, "interestType")}>
            {HOME_INTERESTS.map((it) => (
              <option key={it} value={it}>
                {thq(locale, `it.${it}`)}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="message"
          rows={3}
          placeholder={`${tc(locale, "field.message")} ${tc(locale, "field.optional")}`}
          className={inputCls}
        />

        <label className="flex items-start gap-2 text-xs text-gray-600">
          <input type="checkbox" name="privacy" value="1" required className="mt-0.5 shrink-0" />
          <span>{tc(locale, "privacy.consent")}</span>
        </label>

        {state.error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-baraka text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {pending ? tc(locale, "submitting") : tc(locale, "submit")}
        </button>
      </form>
    </div>
  );
}
