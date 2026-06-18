import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const metadata = { title: "من نحن — شركاء البركة" };

export default async function AboutPage() {
  const locale = await getLocale();
  const values = [
    { title: "home.trust1Title", desc: "home.trust1Desc" },
    { title: "home.trust2Title", desc: "home.trust2Desc" },
    { title: "home.trust3Title", desc: "home.trust3Desc" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold text-baraka-dark mb-4">{t(locale, "about.title")}</h1>
        <p className="text-gray-700 leading-relaxed mb-3">{t(locale, "about.body1")}</p>
        <p className="text-gray-700 leading-relaxed mb-10">{t(locale, "about.body2")}</p>

        <div className="bg-baraka-light/50 border border-baraka/15 rounded-2xl p-6 mb-10">
          <h2 className="font-bold text-baraka-dark mb-2">{t(locale, "about.missionTitle")}</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{t(locale, "about.missionDesc")}</p>
        </div>

        <h2 className="text-xl font-bold text-baraka-dark mb-4">{t(locale, "about.valuesTitle")}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {values.map((v) => (
            <div key={v.title} className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold mb-1">{t(locale, v.title)}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{t(locale, v.desc)}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
