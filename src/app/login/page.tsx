// صفحة «تسجيل الدخول» — تصميم فاخر بعمودين، والنموذج الحقيقي login مع رسائل denied/reset.
/* eslint-disable @next/next/no-img-element */
import LoginForm from "./LoginForm";
import { getLocale } from "@/lib/i18n-server";
import { t, dir } from "@/lib/i18n";
import { resetUi } from "@/lib/reset-i18n";
import { loginX } from "@/lib/login-extra";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: `${loginX(locale).formH2} | Baraka Partners` };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string; reset?: string }>;
}) {
  const { denied, reset } = await searchParams;
  const locale = await getLocale();
  const lx = loginX(locale);
  const rui = resetUi(locale);
  const d = dir(locale);
  const visualGrad = d === "rtl" ? "bg-gradient-to-l" : "bg-gradient-to-r";

  return (
    <main dir={d} className="min-h-screen bg-[#f7f1e7] text-[#171717]">
      <section className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* VISUAL SIDE */}
        <div className="relative hidden overflow-hidden lg:block">
          <img src="/login/visual.jpg" alt={lx.visualBadge} className="h-full w-full object-cover" />
          <div className={`absolute inset-0 ${visualGrad} from-black/90 via-black/68 to-black/35`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(215,181,109,0.36),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.10),transparent_30%)]" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-3xl px-14">
              <div className="mb-6 inline-flex rounded-full border border-[#d7b56d]/50 bg-white/10 px-5 py-2 text-sm font-black text-[#e8cf91] backdrop-blur">
                {lx.visualBadge}
              </div>
              <h1 className="text-5xl font-black leading-tight text-white xl:text-7xl">
                {lx.visualH1a}
                <span className="mt-4 block text-[#d7b56d]">{lx.visualGold}</span>
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-10 text-white/80">{lx.visualLead}</p>
              <div className="mt-10 grid max-w-2xl gap-4">
                {lx.benefits.map((item) => (
                  <div key={item} className="flex gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d7b56d] text-xs font-black text-[#171717]">✓</span>
                    <span className="leading-7 text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="flex items-center px-6 py-12 md:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-xl">
            <div className="mb-8 lg:hidden">
              <div className="mb-5 inline-flex rounded-full border border-[#d7b56d] bg-white px-5 py-2 text-sm font-black text-[#a67c28]">
                {lx.formH2}
              </div>
              <h1 className="text-4xl font-black leading-tight">{lx.mobileTitle}</h1>
              <p className="mt-4 text-lg leading-8 text-[#555]">{lx.mobileSub}</p>
            </div>

            <div className="rounded-[2.5rem] border border-[#e3d5bd] bg-white p-6 shadow-2xl md:p-9">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#171717] text-2xl font-black text-[#d7b56d]">
                  BP
                </div>
                <p className="text-sm font-black text-[#a67c28]">Baraka Partners</p>
                <h2 className="mt-3 text-3xl font-black leading-tight">{lx.formH2}</h2>
                <p className="mt-3 leading-8 text-[#666]">{lx.formLead}</p>
              </div>

              {reset === "1" && (
                <p className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{rui.loginResetOk}</p>
              )}
              {denied === "1" && (
                <p className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{t(locale, "login.denied")}</p>
              )}

              <LoginForm locale={locale} />

              <div className="mt-8 rounded-[2rem] border border-[#e3d5bd] bg-[#fff8e8] p-5 leading-8 text-[#5a4a22]">
                {lx.securityNotice}
              </div>

              <div className="mt-8 grid gap-4 text-center text-sm leading-7 text-[#555]">
                <p>
                  {t(locale, "login.newInvestor")}{" "}
                  <a href="/register" className="font-black text-[#a67c28] underline underline-offset-4">
                    {t(locale, "login.createAccount")}
                  </a>
                </p>
                <p>
                  {lx.ownerQ}{" "}
                  <a href="/register/owner" className="font-black text-[#a67c28] underline underline-offset-4">
                    {lx.ownerCreate}
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {lx.stats.map(([title, text]) => (
                <div key={title} className="rounded-3xl border border-[#e3d5bd] bg-white p-5 text-center shadow-sm">
                  <div className="font-black text-[#a67c28]">{title}</div>
                  <div className="mt-1 text-sm text-[#666]">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
