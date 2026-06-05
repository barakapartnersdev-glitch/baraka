import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getAccountStatus } from "@/lib/account";
import { getBellData } from "@/lib/notify";
import NotificationBell from "@/components/NotificationBell";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { logout } from "@/app/login/actions";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export default async function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("INVESTOR");
  const locale = await getLocale();
  const status = await getAccountStatus(session.userId);
  const pending = status !== "ACTIVE";
  const { count, items } = await getBellData(session.userId);

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/investor" className="flex items-center gap-2">
            <img src="/logo-mark.png" alt="Baraka Partners" width={32} height={32} className="h-8 w-8 shrink-0 rounded-lg" />
            <span className="font-bold text-sm">{t(locale, "portal.investor")}</span>
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher locale={locale} />
            <NotificationBell count={count} items={items} />
            <span className="text-sm text-gray-600">{session.fullName}</span>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-red-600 transition"
              >
                {t(locale, "common.logout")}
              </button>
            </form>
          </div>
        </div>
      </header>
      {pending && (
        <div className="bg-amber-50 border-b border-amber-100">
          <div className="max-w-5xl mx-auto px-6 py-2.5 text-sm text-amber-800">
            {status === "SUSPENDED"
              ? t(locale, "banner.suspended")
              : t(locale, "banner.pendingInvestor")}
          </div>
        </div>
      )}
      <main className="max-w-5xl mx-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
