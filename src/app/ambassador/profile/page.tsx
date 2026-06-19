// بوّابة السفير: ملفي الشخصي (بيانات الاتصال + كلمة المرور + بيانات للقراءة فقط).
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { asStringArray } from "@/lib/ambassador-form";
import { ContactForm, PasswordForm } from "./ProfileForms";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const t = (k: string) => ta(locale, k);

  const [user, account] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { fullName: true, phone: true, email: true },
    }),
    prisma.ambassadorAccount.findUnique({
      where: { userId: session.userId },
      include: { application: { select: { companyName: true, linkedinUrl: true, spokenLanguages: true } } },
    }),
  ]);

  const langs = asStringArray(account?.application?.spokenLanguages)
    .map((l) => ta(locale, `opt.lang.${l}`))
    .join("، ");

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t("profile.title")}</h1>

      {/* بيانات الاتصال */}
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-bold text-baraka-dark mb-4">{t("profile.contact")}</h2>
        <ContactForm locale={locale} fullName={user?.fullName ?? ""} phone={user?.phone ?? ""} />
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400">{t("f.email")}</p>
            <p className="text-gray-700" dir="ltr">{user?.email}</p>
          </div>
          {account?.application?.companyName && (
            <div>
              <p className="text-xs text-gray-400">{t("f.companyName")}</p>
              <p className="text-gray-700">{account.application.companyName}</p>
            </div>
          )}
          {account?.application?.linkedinUrl && (
            <div>
              <p className="text-xs text-gray-400">{t("f.linkedin")}</p>
              <p className="text-gray-700 truncate" dir="ltr">{account.application.linkedinUrl}</p>
            </div>
          )}
          {langs && (
            <div>
              <p className="text-xs text-gray-400">{t("f.spokenLanguages")}</p>
              <p className="text-gray-700">{langs}</p>
            </div>
          )}
        </div>
        <p className="mt-3 text-xs text-amber-700">{t("profile.scopeNote")}</p>
      </section>

      {/* كلمة المرور */}
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-bold text-baraka-dark mb-4">{t("profile.security")}</h2>
        <PasswordForm locale={locale} />
      </section>
    </div>
  );
}
