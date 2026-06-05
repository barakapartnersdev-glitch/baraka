import Sidebar from "@/components/Sidebar";
import { requireRole } from "@/lib/auth";
import { getBellData } from "@/lib/notify";
import NotificationBell from "@/components/NotificationBell";
import LocaleMenu from "@/components/LocaleMenu";
import { logout } from "@/app/login/actions";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // خط دفاع ثانٍ على مستوى الخادم (إضافةً إلى middleware)
  const session = await requireRole("ADMIN");
  const locale = await getLocale();
  const { count, items } = await getBellData(session.userId);

  return (
    <div className="flex min-h-screen">
      <Sidebar locale={locale} />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gold/20 bg-navy/90 px-6 py-3 backdrop-blur">
          <span className="text-sm text-[#cdd6e4]">
            {t(locale, "common.welcome")}{" "}
            <span className="font-semibold text-white">{session.fullName}</span>
          </span>
          <div className="flex items-center gap-3 sm:gap-4">
            <LocaleMenu locale={locale} />
            <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />
            <NotificationBell count={count} items={items} dark />
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-[#cdd6e4] transition hover:text-gold"
              >
                {t(locale, "common.logout")}
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
