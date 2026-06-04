import Sidebar from "@/components/Sidebar";
import { requireRole } from "@/lib/auth";
import { getBellData } from "@/lib/notify";
import NotificationBell from "@/components/NotificationBell";
import LocaleSwitcher from "@/components/LocaleSwitcher";
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
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <span className="text-sm text-gray-600">
            {t(locale, "common.welcome")}{" "}
            <span className="font-medium text-gray-800">{session.fullName}</span>
          </span>
          <div className="flex items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <NotificationBell count={count} items={items} />
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-red-600 transition"
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
