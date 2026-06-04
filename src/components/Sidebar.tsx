import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";

const items = [
  { href: "/admin", key: "sidebar.home", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/opportunities", key: "sidebar.opportunities", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/admin/interests", key: "sidebar.interests", icon: "M5 13l4 4L19 7" },
  { href: "/admin/investors", key: "sidebar.users", icon: "M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" },
];

export default function Sidebar({ locale }: { locale: Locale }) {
  return (
    <aside className="w-60 shrink-0 bg-white border-l border-gray-200 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-9 h-9 rounded-lg bg-baraka-light flex items-center justify-center text-baraka-dark font-bold">ع</div>
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
            {t(locale, it.key)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
