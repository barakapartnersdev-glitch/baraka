import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getAccountStatus } from "@/lib/account";
import { getBellData } from "@/lib/notify";
import NotificationBell from "@/components/NotificationBell";
import LocaleMenu from "@/components/LocaleMenu";
import { logout } from "@/app/login/actions";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();
  const status = await getAccountStatus(session.userId);
  const pending = status !== "ACTIVE";
  const { count, items } = await getBellData(session.userId);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-gold/20 bg-navy/90 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/owner" className="flex shrink-0 items-center gap-2.5 text-white">
              <img src="/logo-mark.png" alt="Baraka Partners" width={36} height={36} className="h-9 w-9 shrink-0" />
              <span className="flex flex-col items-start text-sm font-extrabold leading-tight">
                <span className="block">{t(locale, "brand")}</span>
                <small className="block text-[9px] font-medium text-gold-soft">
                  <span className="inline-block tracking-[0.12em]">{t(locale, "portal.owner")}</span>
                </small>
              </span>
            </Link>
            <nav className="hidden items-center gap-5 text-sm font-medium text-[#cdd6e4] sm:flex">
              <Link href="/owner" className="transition hover:text-gold">
                {t(locale, "owner.nav.mine")}
              </Link>
              {!pending && (
                <Link href="/owner/opportunities/new" className="transition hover:text-gold">
                  {t(locale, "owner.nav.new")}
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <LocaleMenu locale={locale} />
            <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />
            <NotificationBell count={count} items={items} dark />
            <span className="hidden text-sm text-[#cdd6e4] sm:inline">{session.fullName}</span>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-[#cdd6e4] transition hover:text-gold"
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
              : t(locale, "banner.pendingOwner")}
          </div>
        </div>
      )}
      <main className="max-w-5xl mx-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
