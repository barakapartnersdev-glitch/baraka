// تخطيط الجزء العام المُسبَق بلغة. يتحقّق من صحّة بادئة اللغة.
// اللغة الفعلية تُقرأ في الخادم عبر getLocale() (ترويسة x-locale التي يضبطها middleware)،
// لذا لا حاجة لتمريرها يدويّاً عبر params لكل صفحة.
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return children;
}
