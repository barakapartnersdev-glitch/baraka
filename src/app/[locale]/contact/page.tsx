// صفحة «تواصل معنا» — تصميم فاخر، 4 لغات (RTL/LTR)، SEO، ونموذج CRM الحقيقي.
/* eslint-disable @next/next/no-img-element */
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { t, isLocale, DEFAULT_LOCALE, dir, localeHref, shouldLocalizePath } from "@/lib/i18n";
import { pageMetadata, clampDescription } from "@/lib/seo";
import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { contactX } from "@/lib/contact-extra";

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
  const cx = contactX(locale);
  const email = t(locale, "contact.email");
  const d = dir(locale);
  // التدرّج الداكن يبدأ من جهة النص (يمين في RTL، يسار في LTR) ليبقى مقروءاً.
  const heroGrad = d === "rtl" ? "bg-gradient-to-l" : "bg-gradient-to-r";
  const howHref = shouldLocalizePath("/how-it-works") ? localeHref(locale, "/how-it-works") : "/how-it-works";

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main dir={d} className="bg-[#f7f1e7] text-[#171717]">
        {/* HERO */}
        <section className="relative min-h-[86vh] overflow-hidden">
          <div className="absolute inset-0">
            <img src="/contact/hero.jpg" alt={cx.heroBadge} className="h-full w-full object-cover object-center" />
            <div className={`absolute inset-0 ${heroGrad} from-black/92 via-black/70 to-black/30`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(215,181,109,0.36),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.10),transparent_30%)]" />
          </div>
          <div className="relative mx-auto flex min-h-[86vh] max-w-7xl items-center px-6 py-24">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex rounded-full border border-[#d7b56d]/50 bg-white/10 px-5 py-2 text-sm font-black text-[#e8cf91] backdrop-blur">
                {cx.heroBadge}
              </div>
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
                {cx.heroH1a}
                <span className="mt-4 block text-[#d7b56d]">{cx.heroGold}</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-9 text-white/80 md:text-xl">{cx.heroLead}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#contact-form" className="rounded-full bg-[#d7b56d] px-8 py-4 text-sm font-black text-[#171717] shadow-xl transition hover:-translate-y-1 hover:bg-[#e5c77d]">
                  {cx.heroBtn1}
                </a>
                <a href={howHref} className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                  {cx.heroBtn2}
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/35 backdrop-blur-xl">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-5 md:grid-cols-4">
              {cx.stats.map(([title, sub]) => (
                <div key={title} className="px-4">
                  <div className="text-xl font-black text-[#d7b56d]">{title}</div>
                  <div className="mt-1 text-sm text-white/70">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT REASONS */}
        <section className="mx-auto -mt-12 max-w-7xl px-6">
          <div className="relative z-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {cx.reasons.map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-white/60 bg-white p-7 shadow-2xl transition hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(0,0,0,0.14)]">
                <div className="mb-5 h-2 w-14 rounded-full bg-[#d7b56d]" />
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-4 leading-8 text-[#5a5a5a]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MAIN: side info + form */}
        <section className="mx-auto grid max-w-7xl items-start gap-14 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-[2.8rem] bg-[#171717] text-white shadow-2xl">
              <div className="relative h-80">
                <img src="/contact/side.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute bottom-7 right-7 left-7">
                  <h2 className="text-3xl font-black text-white">{cx.sideTitle}</h2>
                  <p className="mt-3 leading-8 text-white/75">{cx.sideText}</p>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black text-[#d7b56d]">{cx.sideChecklistTitle}</h3>
                <div className="mt-6 grid gap-4">
                  {cx.checklist.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d7b56d] text-xs font-black text-[#171717]">✓</span>
                      <span className="leading-7 text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-7 border-t border-white/10 pt-6">
                  <p className="text-sm text-white/60">{cx.sideEmailLabel}</p>
                  <a href={`mailto:${email}`} dir="ltr" className="mt-1 inline-block text-lg font-black text-[#d7b56d] hover:underline">
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <section id="contact-form" className="scroll-mt-24">
            <div className="mb-8">
              <p className="text-sm font-black text-[#a67c28]">{cx.formKicker}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{cx.formH2}</h2>
              <p className="mt-5 text-lg leading-9 text-[#555]">{cx.formLead}</p>
            </div>
            <ContactForm locale={locale} />
          </section>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 pb-24">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[#171717] px-8 py-16 text-center text-white shadow-2xl">
            <div className="absolute inset-0 opacity-25">
              <img src="/contact/cta.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-[#171717]/75" />
            <div className="relative">
              <p className="text-sm font-black text-[#d7b56d]">{cx.ctaKicker}</p>
              <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-tight md:text-5xl">{cx.ctaH2}</h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/75">{cx.ctaLead}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
