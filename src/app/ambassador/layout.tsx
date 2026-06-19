// تخطيط بوّابة سفير الاستثمار — محميّة بدور AMBASSADOR، رأس بالتنقّل + جرس + لغة + خروج.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getBellData } from "@/lib/notify";
import { getAmbassadorAccount } from "@/lib/ambassador-account";
import NotificationBell from "@/components/NotificationBell";
import LocaleMenu from "@/components/LocaleMenu";
import { logout } from "@/app/login/actions";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";

const NAV = [
  { href: "/ambassador", key: "portal.nav.dashboard" },
  { href: "/ambassador/referrals", key: "portal.nav.referrals" },
  { href: "/ambassador/files", key: "portal.nav.files" },
  { href: "/ambassador/messages", key: "portal.nav.messages" },
  { href: "/ambassador/profile", key: "portal.nav.profile" },
];

export default async function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const [{ count, items }, account] = await Promise.all([
    getBellData(session.userId),
    getAmbassadorAccount(session.userId),
  ]);
  const suspended = account != null && account.status !== "active";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-gold/20 bg-navy/90 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/ambassador" className="flex shrink-0 items-center gap-2.5 text-white">
            <img src="/logo-mark.png" alt="Baraka Partners" width={36} height={36} className="h-9 w-9 shrink-0" />
            <span className="flex flex-col items-start text-sm font-extrabold leading-tight">
              <span className="block">{ta(locale, "portal.role")}</span>
              <small className="block text-[9px] font-medium text-gold-soft tracking-[0.12em]">BARAKA PARTNERS</small>
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <LocaleMenu locale={locale} />
            <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />
            <NotificationBell count={count} items={items} dark />
            <span className="hidden text-sm text-[#cdd6e4] sm:inline">{session.fullName}</span>
            <form action={logout}>
              <button type="submit" className="text-sm text-[#cdd6e4] transition hover:text-gold">
                {ta(locale, "portal.logout")}
              </button>
            </form>
          </div>
        </div>
        {/* شريط التنقّل */}
        <nav className="border-t border-white/10 bg-navy/80">
          <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-5 sm:px-8">
            {NAV.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="whitespace-nowrap px-3 py-2.5 text-sm font-medium text-[#cdd6e4] transition hover:text-gold"
              >
                {ta(locale, it.key)}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {suspended && (
        <div className="bg-amber-50 border-b border-amber-100">
          <div className="max-w-5xl mx-auto px-6 py-2.5 text-sm text-amber-800">
            {ta(locale, "portal.banner.suspended")}
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
