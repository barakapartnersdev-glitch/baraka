"use client";
import { useActionState } from "react";
import { SOURCE_FIELDS } from "@/lib/opportunity";
import { createOpportunity, type CreateState } from "@/app/owner/actions";
import { t, type Locale } from "@/lib/i18n";

const initial: CreateState = {};

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-baraka";

export default function CreateForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(createOpportunity, initial);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            {t(locale, "ownerEditor.oppTitle")} <span className="text-red-500">*</span>
          </label>
          <input name="title" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            {t(locale, "col.sector")} <span className="text-red-500">*</span>
          </label>
          <input name="sector" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            {t(locale, "col.country")} <span className="text-red-500">*</span>
          </label>
          <input name="country" required className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t(locale, "ownerEditor.fundFrom")} (USD)
            </label>
            <input name="investmentMin" inputMode="numeric" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t(locale, "ownerEditor.fundTo")} (USD)
            </label>
            <input name="investmentMax" inputMode="numeric" className={inputCls} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h2 className="text-sm font-bold mb-1">{t(locale, "ownerEditor.sourceTitle")}</h2>
        <p className="text-xs text-gray-500 mb-4">{t(locale, "ownerEditor.sourceNote")}</p>
        <div className="flex flex-col gap-4">
          {SOURCE_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-sm text-gray-700 mb-1">
                {t(locale, `sfield.${f.key}`)}
              </label>
              {f.textarea ? (
                <textarea name={f.key} rows={3} className={inputCls} />
              ) : (
                <input name={f.key} className={inputCls} />
              )}
            </div>
          ))}
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">
          {state.error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-baraka text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {pending ? t(locale, "createForm.saving") : t(locale, "createForm.draft")}
        </button>
      </div>
    </form>
  );
}
