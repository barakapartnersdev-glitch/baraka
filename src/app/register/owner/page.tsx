// صفحة «تسجيل صاحب مشروع/أصل» — تصميم فاخر بعمودين، والنموذج الحقيقي registerOwner.
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import OwnerRegisterForm from "./OwnerRegisterForm";
import { registerOwner } from "../actions";
import { getLocale } from "@/lib/i18n-server";
import { t, dir } from "@/lib/i18n";
import { ownerRegisterX } from "@/lib/register-owner-extra";

export const metadata = { title: "تسجيل صاحب مشروع — شركاء البركة" };

export default async function RegisterOwnerPage() {
  const locale = await getLocale();
  const ox = ownerRegisterX(locale);
  const d = dir(locale);
  const visualGrad = d === "rtl" ? "bg-gradient-to-l" : "bg-gradient-to-r";

  return (
    <main dir={d} className="min-h-screen bg-[#f7f1e7] text-[#171717]">
      <section className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* VISUAL SIDE */}
        <div className="relative hidden overflow-hidden lg:block">
          <img src="/register/owner-visual.jpg" alt={ox.visualBadge} className="h-full w-full object-cover" />
          <div className={`absolute inset-0 ${visualGrad} from-black/90 via-black/68 to-black/35`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(215,181,109,0.36),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.10),transparent_30%)]" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-3xl px-14">
              <div className="mb-6 inline-flex rounded-full border border-[#d7b56d]/50 bg-white/10 px-5 py-2 text-sm font-black text-[#e8cf91] backdrop-blur">
                {ox.visualBadge}
              </div>
              <h1 className="text-5xl font-black leading-tight text-white xl:text-7xl">
                {ox.visualH1a}
                <span className="mt-4 block text-[#d7b56d]">{ox.visualGold}</span>
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-10 text-white/80">{ox.visualLead}</p>
              <div className="mt-10 grid max-w-2xl gap-4">
                {ox.benefits.map((item) => (
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
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-8 lg:hidden">
              <div className="mb-5 inline-flex rounded-full border border-[#d7b56d] bg-white px-5 py-2 text-sm font-black text-[#a67c28]">
                {ox.visualBadge}
              </div>
              <h1 className="text-4xl font-black leading-tight">{t(locale, "reg.ownerTitle")}</h1>
              <p className="mt-4 text-lg leading-8 text-[#555]">{t(locale, "reg.ownerSub")}</p>
            </div>

            <div className="rounded-[2.5rem] border border-[#e3d5bd] bg-white p-6 shadow-2xl md:p-9">
              <div className="mb-8">
                <p className="text-sm font-black text-[#a67c28]">{ox.formKicker}</p>
                <h2 className="mt-3 text-3xl font-black leading-tight">{ox.formH2}</h2>
                <p className="mt-3 leading-8 text-[#666]">{ox.formLead}</p>
              </div>

              <OwnerRegisterForm action={registerOwner} locale={locale} />

              <div className="mt-8 grid gap-3 text-center text-sm leading-7 text-[#555]">
                <p>
                  {t(locale, "reg.haveAccount")}{" "}
                  <Link href="/login" className="font-black text-[#a67c28] underline underline-offset-4">
                    {t(locale, "home.login")}
                  </Link>
                </p>
                <p>
                  <Link href="/register" className="font-black text-[#a67c28] underline underline-offset-4">
                    {t(locale, "reg.asInvestor")}
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-[#e3d5bd] bg-[#fff8e8] p-5 leading-8 text-[#5a4a22]">
              {ox.note}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
