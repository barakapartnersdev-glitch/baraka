import Link from "next/link";
import LoginForm from "./LoginForm";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { resetUi } from "@/lib/reset-i18n";

export const metadata = { title: "تسجيل الدخول — شركاء البركة" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string; reset?: string }>;
}) {
  const { denied, reset } = await searchParams;
  const locale = await getLocale();
  const rui = resetUi(locale);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-baraka-light flex items-center justify-center text-baraka-dark font-bold text-lg mb-3">
            ع
          </div>
          <h1 className="text-xl font-bold text-baraka-dark">{t(locale, "brand")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t(locale, "login.subtitle")}</p>
        </div>

        {reset === "1" && (
          <p className="mb-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3">
            {rui.loginResetOk}
          </p>
        )}

        {denied === "1" && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">
            {t(locale, "login.denied")}
          </p>
        )}

        <LoginForm locale={locale} />

        <p className="mt-4 text-center text-sm">
          <Link href="/reset-password" className="text-baraka hover:underline">
            {rui.forgotPassword}
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-gray-500">
          {t(locale, "login.newInvestor")}{" "}
          <Link href="/register" className="text-baraka hover:underline">
            {t(locale, "login.createAccount")}
          </Link>
        </p>
      </div>
    </main>
  );
}
