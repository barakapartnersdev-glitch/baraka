import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const metadata = { title: "كيف تعمل المنصة — شركاء البركة" };

export default async function HowItWorksPage() {
  const locale = await getLocale();
  const steps = [
    { n: 1, title: "home.step1Title", desc: "home.step1Desc" },
    { n: 2, title: "home.step2Title", desc: "home.step2Desc" },
    { n: 3, title: "home.step3Title", desc: "home.step3Desc" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold text-baraka-dark mb-3">{t(locale, "how.title")}</h1>
        <p className="text-gray-600 leading-relaxed mb-10">{t(locale, "how.intro")}</p>

        <div className="flex flex-col gap-5 mb-12">
          {steps.map((s) => (
            <div key={s.n} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5">
              <div className="w-9 h-9 shrink-0 rounded-full bg-baraka text-white flex items-center justify-center font-bold">
                {s.n}
              </div>
              <div>
                <h3 className="font-bold mb-1">{t(locale, s.title)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t(locale, s.desc)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-baraka-light/50 border border-baraka/15 rounded-2xl p-6">
          <h2 className="font-bold text-baraka-dark mb-2">{t(locale, "how.confTitle")}</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{t(locale, "how.confDesc")}</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/register" className="bg-baraka text-white px-6 py-3 rounded-lg hover:bg-baraka-dark transition">
            {t(locale, "reg.asInvestor")}
          </Link>
          <Link href="/register/owner" className="border border-baraka text-baraka-dark px-6 py-3 rounded-lg hover:bg-baraka-light transition">
            {t(locale, "home.ownerRegister")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
