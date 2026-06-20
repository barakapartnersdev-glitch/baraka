// تخطيط بوّابة وكيل صاحب الأصل — محميّة بدور ASSET_OWNER_AGENT.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getBellData } from "@/lib/notify";
import { getAgentAccount } from "@/lib/agent-account";
import NotificationBell from "@/components/NotificationBell";
import LocaleMenu from "@/components/LocaleMenu";
import { logout } from "@/app/login/actions";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";

const NAV = [
  { href: "/agent", key: "portal.nav.dashboard" },
  { href: "/agent/assets", key: "portal.nav.assets" },
  { href: "/agent/stats", key: "portal.nav.stats" },
  { href: "/agent/messages", key: "portal.nav.messages" },
  { href: "/agent/profile", key: "portal.nav.profile" },
];

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const [{ count, items }, account] = await Promise.all([
    getBellData(session.userId),
    getAgentAccount(session.userId),
  ]);
  const suspended = account != null && account.status !== "active";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-gold/20 bg-navy/90 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/agent" className="flex shrink-0 items-center gap-2.5 text-white">
            <img src="/logo-mark.png" alt="Baraka Partners" width={36} height={36} className="h-9 w-9 shrink-0" />
            <span className="flex flex-col items-start text-sm font-extrabold leading-tight">
              <span className="block">{tg(locale, "portal.role")}</span>
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
                {tg(locale, "portal.logout")}
              </button>
            </form>
          </div>
        </div>
        <nav className="border-t border-white/10 bg-navy/80">
          <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-5 sm:px-8">
            {NAV.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="whitespace-nowrap px-3 py-2.5 text-sm font-medium text-[#cdd6e4] transition hover:text-gold"
              >
                {tg(locale, it.key)}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {suspended && (
        <div className="bg-amber-50 border-b border-amber-100">
          <div className="max-w-5xl mx-auto px-6 py-2.5 text-sm text-amber-800">{tg(locale, "portal.banner.suspended")}</div>
        </div>
      )}

      <main className="max-w-5xl mx-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
