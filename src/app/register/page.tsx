// صفحة «تسجيل مستثمر» — تصميم فاخر بعمودين (بصري + نموذج)، والنموذج الحقيقي registerInvestor.
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import InvestorRegisterForm from "./InvestorRegisterForm";
import { registerInvestor } from "./actions";
import { getLocale } from "@/lib/i18n-server";
import { t, dir } from "@/lib/i18n";
import { registerX } from "@/lib/register-extra";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: `${t(locale, "reg.investorTitle")} | Baraka Partners` };
}

export default async function RegisterPage() {
  const locale = await getLocale();
  const rx = registerX(locale);
  const d = dir(locale);
  const visualGrad = d === "rtl" ? "bg-gradient-to-l" : "bg-gradient-to-r";

  return (
    <main dir={d} className="min-h-screen bg-[#f7f1e7] text-[#171717]">
      <section className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* VISUAL SIDE */}
        <div className="relative hidden overflow-hidden lg:block">
          <img src="/register/visual.jpg" alt={rx.visualBadge} className="h-full w-full object-cover" />
          <div className={`absolute inset-0 ${visualGrad} from-black/85 via-black/65 to-black/30`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(215,181,109,0.36),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.10),transparent_30%)]" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-3xl px-14">
              <div className="mb-6 inline-flex rounded-full border border-[#d7b56d]/50 bg-white/10 px-5 py-2 text-sm font-black text-[#e8cf91] backdrop-blur">
                {rx.visualBadge}
              </div>
              <h1 className="text-5xl font-black leading-tight text-white xl:text-7xl">
                {rx.visualH1a}
                <span className="mt-4 block text-[#d7b56d]">{rx.visualGold}</span>
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-10 text-white/80">{rx.visualLead}</p>
              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
                {rx.stats.map(([title, text]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-5 text-white backdrop-blur">
                    <div className="text-2xl font-black text-[#d7b56d]">{title}</div>
                    <div className="mt-2 text-sm text-white/70">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="flex items-center px-6 py-12 md:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-8 lg:hidden">
              <div className="mb-5 inline-flex rounded-full border border-[#d7b56d] bg-white px-5 py-2 text-sm font-black text-[#a67c28]">
                {rx.visualBadge}
              </div>
              <h1 className="text-4xl font-black leading-tight">{t(locale, "reg.investorTitle")}</h1>
              <p className="mt-4 text-lg leading-8 text-[#555]">{t(locale, "reg.investorSub")}</p>
            </div>

            <div className="rounded-[2.5rem] border border-[#e3d5bd] bg-white p-6 shadow-2xl md:p-9">
              <div className="mb-8">
                <p className="text-sm font-black text-[#a67c28]">{rx.formKicker}</p>
                <h2 className="mt-3 text-3xl font-black leading-tight">{rx.formH2}</h2>
                <p className="mt-3 leading-8 text-[#666]">{rx.formLead}</p>
              </div>

              <InvestorRegisterForm action={registerInvestor} locale={locale} />

              <div className="mt-8 grid gap-3 text-center text-sm leading-7 text-[#555]">
                <p>
                  {t(locale, "reg.haveAccount")}{" "}
                  <Link href="/login" className="font-black text-[#a67c28] underline underline-offset-4">
                    {t(locale, "home.login")}
                  </Link>
                </p>
                <p>
                  {t(locale, "home.ownerQ")}{" "}
                  <Link href="/register/owner" className="font-black text-[#a67c28] underline underline-offset-4">
                    {t(locale, "reg.asOwner")}
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-[#e3d5bd] bg-[#fff8e8] p-5 leading-8 text-[#5a4a22]">
              {rx.note}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
