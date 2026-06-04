"use client";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import { t, type Locale } from "@/lib/i18n";

const initialState: LoginState = {};

export default function LoginForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
        <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
          {t(locale, "field.password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          dir="ltr"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:border-baraka"
        />
      </div>

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
        {pending ? t(locale, "login.submitting") : t(locale, "login.submit")}
      </button>
    </form>
  );
}
