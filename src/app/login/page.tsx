import Link from "next/link";
import LoginForm from "./LoginForm";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const metadata = { title: "تسجيل الدخول — شركاء البركة" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const { denied } = await searchParams;
  const locale = await getLocale();

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

        {denied === "1" && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">
            {t(locale, "login.denied")}
          </p>
        )}

        <LoginForm locale={locale} />

        <p className="mt-6 text-center text-sm text-gray-500">
          {t(locale, "login.newInvestor")}{" "}
          <Link href="/register" className="text-baraka hover:underline">
            {t(locale, "login.createAccount")}
          </Link>
        </p>
      </div>
    </main>
  );
}
