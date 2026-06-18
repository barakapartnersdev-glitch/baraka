import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";

type NavItem = {
  href: string;
  icon: string;
  key?: string;
  labels?: Record<Locale, string>;
};

const items: NavItem[] = [
  { href: "/admin", key: "sidebar.home", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/opportunities", key: "sidebar.opportunities", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/admin/interests", key: "sidebar.interests", icon: "M5 13l4 4L19 7" },
  { href: "/admin/crm", key: "sidebar.crm", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  {
    href: "/admin/destinations",
    icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c3 3 3 17 0 20m0-20c-3 3-3 17 0 20M2 12h20",
    labels: { ar: "وجهات الاستثمار", en: "Investment Destinations", tr: "Yatırım Destinasyonları", zh: "投资目的地" },
  },
  {
    href: "/admin/ambassadors",
    icon: "M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21l2.3-7.4-6-4.6h7.6z",
    labels: { ar: "سفراء الاستثمار", en: "Investment Ambassadors", tr: "Yatırım Elçileri", zh: "投资大使" },
  },
  { href: "/admin/investors", key: "sidebar.users", icon: "M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" },
];

export default function Sidebar({ locale }: { locale: Locale }) {
  return (
    <aside className="w-60 shrink-0 bg-white border-l border-gray-200 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <img src="/logo-mark.png" alt="Baraka Partners" width={36} height={36} className="h-9 w-9 shrink-0 rounded-lg" />
        <div>
          <p className="font-bold text-sm">{t(locale, "portal.adminOrg")}</p>
          <p className="text-xs text-gray-500">{t(locale, "portal.adminPanel")}</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <Link key={it.href} href={it.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-baraka-light hover:text-baraka-dark transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={it.icon} /></svg>
            {it.labels ? it.labels[locale] : t(locale, it.key as string)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
