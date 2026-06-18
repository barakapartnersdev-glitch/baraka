"use client";
import { useActionState } from "react";
import { t, type Locale } from "@/lib/i18n";
import type { RegisterState } from "./actions";

const initialState: RegisterState = {};

export default function RegisterForm({
  action,
  locale,
  showInvestorType = false,
}: {
  action: (prev: RegisterState, formData: FormData) => Promise<RegisterState>;
  locale: Locale;
  showInvestorType?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const typeOptions: { v: string; key: string }[] = [
    { v: "individual", key: "reg.typeIndividual" },
    { v: "company", key: "reg.typeCompany" },
    { v: "fund", key: "reg.typeFund" },
  ];

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="fullName" className="block text-sm text-gray-700 mb-1">
          {t(locale, "field.fullName")}
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:border-baraka"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
          {t(locale, "field.email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          dir="ltr"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:border-baraka"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm text-gray-700 mb-1">
          {t(locale, "field.phone")}{" "}
          <span className="text-gray-400">{t(locale, "common.optional")}</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          dir="ltr"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:border-baraka"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
          {t(locale, "field.password")}{" "}
          <span className="text-gray-400">{t(locale, "reg.passwordHint")}</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          dir="ltr"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:border-baraka"
        />
      </div>

      <div>
        <label htmlFor="confirm" className="block text-sm text-gray-700 mb-1">
          {t(locale, "field.confirm")}
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          dir="ltr"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:border-baraka"
        />
      </div>

      {showInvestorType && (
        <div>
          <span className="block text-sm text-gray-700 mb-1.5">
            {t(locale, "reg.investorType")}
          </span>
          <div className="grid grid-cols-3 gap-2">
            {typeOptions.map((o, i) => (
              <label
                key={o.v}
                className="relative flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-700 transition hover:border-baraka has-[:checked]:border-baraka has-[:checked]:bg-baraka-light has-[:checked]:font-semibold has-[:checked]:text-baraka-dark"
              >
                <input
                  type="radio"
                  name="investorType"
                  value={o.v}
                  defaultChecked={i === 0}
                  className="sr-only"
                />
                {t(locale, o.key)}
              </label>
            ))}
          </div>
        </div>
      )}

      {state?.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-baraka text-white py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
      >
        {pending ? t(locale, "reg.submitting") : t(locale, "reg.submit")}
      </button>
    </form>
  );
}
