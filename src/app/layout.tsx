import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale } from "@/lib/i18n-server";
import { dir } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "شركاء البركة — Baraka Partners",
  description: "منصة BarakaPartners الاستثمارية",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={dir(locale)}>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
