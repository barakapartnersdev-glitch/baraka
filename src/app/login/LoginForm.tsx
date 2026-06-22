"use client";
// نموذج تسجيل الدخول — تصميم فاخر. المنطق والإجراء وأسماء الحقول كما هي دون تغيير.
import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import { t, type Locale } from "@/lib/i18n";
import { resetUi } from "@/lib/reset-i18n";

const initialState: LoginState = {};
const inputCls =
  "w-full rounded-2xl border border-[#e3d5bd] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#d7b56d]";
const labelCls = "mb-2 block text-sm font-bold text-[#333]";

export default function LoginForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const rui = resetUi(locale);
  const req = <span className="text-red-500"> *</span>;

  return (
    <form action={formAction} className="space-y-6">
      <section className="rounded-[2rem] bg-[#f7f1e7] p-5 md:p-6">
        <div className="grid gap-5">
          <div>
            <label htmlFor="email" className={labelCls}>{t(locale, "field.email")}{req}</label>
            <input id="email" name="email" type="email" autoComplete="email" required dir="ltr" className={inputCls} />
          </div>
          <div>
            <label htmlFor="password" className={labelCls}>{t(locale, "field.password")}{req}</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required dir="ltr" className={inputCls} />
          </div>
        </div>
        <div className="mt-5 text-end text-sm">
          <a href="/reset-password" className="font-black text-[#a67c28] underline underline-offset-4">
            {rui.forgotPassword}
          </a>
        </div>
      </section>

      {state?.error && (
        <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#171717] px-8 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#2a2a2a] disabled:translate-y-0 disabled:opacity-60"
      >
        {pending ? t(locale, "login.submitting") : t(locale, "login.submit")}
      </button>
    </form>
  );
}
