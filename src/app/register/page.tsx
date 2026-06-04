import Link from "next/link";
import RegisterForm from "./RegisterForm";
import { registerInvestor } from "./actions";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const metadata = { title: "تسجيل مستثمر جديد — شركاء البركة" };

export default async function RegisterPage() {
  const locale = await getLocale();

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-baraka-light flex items-center justify-center text-baraka-dark font-bold text-lg mb-3">
            ع
          </div>
          <h1 className="text-xl font-bold text-baraka-dark">
            {t(locale, "reg.investorTitle")}
          </h1>
          <p className="text-sm text-gray-500 mt-1 text-center leading-relaxed">
            {t(locale, "reg.investorSub")}
          </p>
        </div>

        <RegisterForm action={registerInvestor} locale={locale} />

        <div className="mt-6 space-y-1 text-center text-sm text-gray-500">
          <p>
            {t(locale, "reg.haveAccount")}{" "}
            <Link href="/login" className="text-baraka hover:underline">
              {t(locale, "home.login")}
            </Link>
          </p>
          <p>
            {t(locale, "home.ownerQ")}{" "}
            <Link href="/register/owner" className="text-baraka hover:underline">
              {t(locale, "reg.asOwner")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
