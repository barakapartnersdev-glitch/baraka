import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale } from "@/lib/i18n-server";
import { dir } from "@/lib/i18n";
import { AnalyticsScripts, GtmNoScript, analyticsEnabled } from "@/components/Analytics";
import ConsentBanner from "@/components/ConsentBanner";

const GOOGLE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  title: "شركاء البركة — Baraka Partners",
  description: "منصة BarakaPartners الاستثمارية",
  ...(GOOGLE_VERIFICATION
    ? { verification: { google: GOOGLE_VERIFICATION } }
    : {}),
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
        <GtmNoScript />
        <AnalyticsScripts />
        {children}
        {analyticsEnabled() && <ConsentBanner locale={locale} />}
        <SpeedInsights />
      </body>
    </html>
  );
}
