import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { t, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { pageMetadata, clampDescription } from "@/lib/seo";
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return pageMetadata({
    locale,
    path: "/contact",
    title: `${t(locale, "contact.title")} | Baraka Partners`,
    description: clampDescription(t(locale, "contact.intro")),
  });
}

export default async function ContactPage() {
  const locale = await getLocale();
  const email = t(locale, "contact.email");

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold text-baraka-dark mb-3">{t(locale, "contact.title")}</h1>
        <p className="text-gray-600 leading-relaxed mb-8">{t(locale, "contact.intro")}</p>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-xs text-gray-500 mb-1">{t(locale, "contact.emailLabel")}</p>
          <a href={`mailto:${email}`} dir="ltr" className="text-baraka font-medium hover:underline">
            {email}
          </a>
          <p className="text-sm text-gray-500 mt-4 mb-6">{t(locale, "contact.note")}</p>
          <a
            href={`mailto:${email}`}
            className="inline-block bg-baraka text-white px-6 py-3 rounded-lg text-sm hover:bg-baraka-dark transition"
          >
            {t(locale, "contact.cta")}
          </a>
        </div>

        <div className="mt-6">
          <ContactForm locale={locale} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
