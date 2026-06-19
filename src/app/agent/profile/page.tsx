// بوّابة الوكيل: ملفي الشخصي.
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAgentAccount } from "@/lib/agent-account";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";
import { ContactForm, PasswordForm } from "./ProfileForms";

export const dynamic = "force-dynamic";

export default async function AgentProfilePage() {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const t = (k: string) => tg(locale, k);

  const [user, account] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, select: { fullName: true, email: true } }),
    prisma.assetAgentAccount.findUnique({
      where: { userId: session.userId },
      include: { application: { select: { phone: true, whatsapp: true, linkedinUrl: true, websiteUrl: true, companyUrl: true } } },
    }),
  ]);
  const app = account?.application;

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t("profile.title")}</h1>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-bold text-baraka-dark mb-4">{t("profile.contact")}</h2>
        <ContactForm
          locale={locale}
          phone={app?.phone ?? ""}
          whatsapp={app?.whatsapp ?? ""}
          linkedinUrl={app?.linkedinUrl ?? ""}
          websiteUrl={app?.websiteUrl ?? ""}
          companyUrl={app?.companyUrl ?? ""}
        />
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
          <p className="text-xs text-gray-400">{user?.fullName}</p>
          <p className="text-gray-700" dir="ltr">{user?.email}</p>
        </div>
        <p className="mt-3 text-xs text-amber-700">{t("profile.scopeNote")}</p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-bold text-baraka-dark mb-4">{t("profile.security")}</h2>
        <PasswordForm locale={locale} />
      </section>
    </div>
  );
}
