"use client";
// نموذج «اعرض فرصتك الاستثمارية» — متعدّد اللغات. يعيد استخدام نواة submitLead.
import { useActionState } from "react";
import { tc } from "@/lib/crm-i18n";
import { OWNER_SENDER_ROLES, PROJECT_SECTORS, FEASIBILITY_OPTS, LICENSING_OPTS } from "@/lib/crm";
import type { Locale } from "@/lib/i18n";
import { submitOpportunityLead } from "./actions";
import type { LeadFormState } from "@/lib/crm-submit";
import { tf } from "@/lib/file-i18n";

const initial: LeadFormState = {};

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";

export default function SubmitOpportunityForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(submitOpportunityLead, initial);

  if (state.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-green-700 text-2xl mb-2">✓</div>
        <p className="font-bold text-green-800 mb-1">{tc(locale, "success.title")}</p>
        <p className="text-sm text-green-700 leading-relaxed">{tc(locale, "success.body")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* فخّ النحل */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="so-name" className="block text-sm text-gray-700 mb-1">{tc(locale, "field.fullName")}</label>
          <input id="so-name" name="fullName" type="text" required autoComplete="name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="so-email" className="block text-sm text-gray-700 mb-1">{tc(locale, "field.email")}</label>
          <input id="so-email" name="email" type="email" required dir="ltr" autoComplete="email" className={inputCls} />
        </div>
        <div>
          <label htmlFor="so-phone" className="block text-sm text-gray-700 mb-1">{tc(locale, "field.phone")} <span className="text-gray-400">{tc(locale, "field.optional")}</span></label>
          <input id="so-phone" name="phone" type="tel" dir="ltr" autoComplete="tel" className={inputCls} />
        </div>
        <div>
          <label htmlFor="so-wa" className="block text-sm text-gray-700 mb-1">{tc(locale, "field.whatsapp")} <span className="text-gray-400">{tc(locale, "field.optional")}</span></label>
          <input id="so-wa" name="whatsapp" type="tel" dir="ltr" className={inputCls} />
        </div>
        <div>
          <label htmlFor="so-country" className="block text-sm text-gray-700 mb-1">{tc(locale, "field.country")}</label>
          <input id="so-country" name="country" type="text" autoComplete="country-name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="so-company" className="block text-sm text-gray-700 mb-1">{tc(locale, "field.company")} <span className="text-gray-400">{tc(locale, "field.optional")}</span></label>
          <input id="so-company" name="companyName" type="text" autoComplete="organization" className={inputCls} />
        </div>
        <div>
          <label htmlFor="so-role" className="block text-sm text-gray-700 mb-1">{tc(locale, "field.senderRole")}</label>
          <select id="so-role" name="senderRole" defaultValue="" className={inputCls}>
            <option value="" disabled>{tc(locale, "opt.choose")}</option>
            {OWNER_SENDER_ROLES.map((r) => (
              <option key={r} value={r}>{tc(locale, `senderRole.${r}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="so-type" className="block text-sm text-gray-700 mb-1">{tc(locale, "submitOpp.projectType")}</label>
          <select id="so-type" name="projectSector" defaultValue="" className={inputCls}>
            <option value="" disabled>{tc(locale, "opt.choose")}</option>
            {PROJECT_SECTORS.map((s) => (
              <option key={s} value={s}>{tc(locale, `projType.${s}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="so-pcountry" className="block text-sm text-gray-700 mb-1">{tc(locale, "submitOpp.projectCountry")}</label>
          <input id="so-pcountry" name="projectCountry" type="text" className={inputCls} />
        </div>
        <div>
          <label htmlFor="so-pcity" className="block text-sm text-gray-700 mb-1">{tc(locale, "submitOpp.projectCity")} <span className="text-gray-400">{tc(locale, "field.optional")}</span></label>
          <input id="so-pcity" name="projectCity" type="text" className={inputCls} />
        </div>
        <div>
          <label htmlFor="so-amount" className="block text-sm text-gray-700 mb-1">{tc(locale, "submitOpp.amount")}</label>
          <input id="so-amount" name="investmentBudget" type="text" dir="ltr" className={inputCls} />
        </div>
        <div>
          <label htmlFor="so-feas" className="block text-sm text-gray-700 mb-1">{tc(locale, "submitOpp.feasibility")}</label>
          <select id="so-feas" name="hasFeasibility" defaultValue="" className={inputCls}>
            <option value="" disabled>{tc(locale, "opt.choose")}</option>
            {FEASIBILITY_OPTS.map((o) => (
              <option key={o} value={o}>{tc(locale, `yn.${o}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="so-lic" className="block text-sm text-gray-700 mb-1">{tc(locale, "submitOpp.licensing")}</label>
          <select id="so-lic" name="hasLicensing" defaultValue="" className={inputCls}>
            <option value="" disabled>{tc(locale, "opt.choose")}</option>
            {LICENSING_OPTS.map((o) => (
              <option key={o} value={o}>{tc(locale, `yn.${o}`)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="so-desc" className="block text-sm text-gray-700 mb-1">{tc(locale, "submitOpp.desc")}</label>
        <textarea id="so-desc" name="message" rows={5} className={inputCls} />
      </div>

      {/* رفع ملفات (PDF / Word / Excel / صور) — يلتقطها submitLead تلقائياً */}
      <div>
        <label htmlFor="so-files" className="block text-sm text-gray-700 mb-1">
          {tf(locale, "attach")} <span className="text-gray-400">{tc(locale, "field.optional")}</span>
        </label>
        <input
          id="so-files"
          name="files"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
          className="w-full text-sm text-gray-600 file:mr-2 file:rounded-lg file:border-0 file:bg-baraka-light file:px-3 file:py-2 file:text-baraka-dark"
        />
        <p className="mt-1 text-xs text-gray-400">{tf(locale, "attachHint")}</p>
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
        className="self-start bg-baraka text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
      >
        {pending ? tc(locale, "submitting") : tc(locale, "submit")}
      </button>
    </form>
  );
}
