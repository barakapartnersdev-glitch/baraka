"use client";
// نموذجا إعادة التعيين: طلب رابط (mode="request") أو تعيين كلمة مرور جديدة (mode="set").
import { useActionState } from "react";
import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { resetUi } from "@/lib/reset-i18n";
import { requestPasswordReset, setNewPassword, type RequestState, type SetState } from "./actions";

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-baraka";

export default function ResetForms({
  locale,
  mode,
  token,
  showExpired,
}: {
  locale: Locale;
  mode: "request" | "set";
  token: string | null;
  showExpired: boolean;
}) {
  const ui = resetUi(locale);

  if (mode === "set") {
    return <SetForm locale={locale} token={token ?? ""} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {showExpired && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
          {ui.linkExpired}
        </p>
      )}
      <RequestForm locale={locale} />
    </div>
  );
}

function RequestForm({ locale }: { locale: Locale }) {
  const ui = resetUi(locale);
  const [state, action, pending] = useActionState<RequestState, FormData>(requestPasswordReset, {});

  if (state.ok) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3 leading-relaxed">
          {ui.requestDone}
        </p>
        <Link href="/login" className="text-baraka hover:underline text-sm text-center">
          {ui.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* مصيدة سبام */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <label htmlFor="email" className="block text-sm text-gray-700 mb-1">{ui.emailLabel}</label>
        <input id="email" name="email" type="email" autoComplete="email" required dir="ltr" className={`${inputCls} text-right`} />
      </div>
      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className="bg-baraka text-white py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60">
        {pending ? ui.sending : ui.sendBtn}
      </button>
      <Link href="/login" className="text-baraka hover:underline text-sm text-center">{ui.backToLogin}</Link>
    </form>
  );
}

function SetForm({ locale, token }: { locale: Locale; token: string }) {
  const ui = resetUi(locale);
  const [state, action, pending] = useActionState<SetState, FormData>(setNewPassword, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
          {ui.newPassword} <span className="text-gray-400 text-xs">{ui.passwordHint}</span>
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} dir="ltr" className={`${inputCls} text-right`} />
      </div>
      <div>
        <label htmlFor="confirm" className="block text-sm text-gray-700 mb-1">{ui.confirmPassword}</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} dir="ltr" className={`${inputCls} text-right`} />
      </div>
      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className="bg-baraka text-white py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60">
        {pending ? ui.saving : ui.saveBtn}
      </button>
    </form>
  );
}
