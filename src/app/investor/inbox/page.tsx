// بوّابة المستثمر: صندوق الوارد من الإدارة.
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import InboxList from "@/components/inbox/InboxList";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await requireRole("INVESTOR");
  const locale = await getLocale();
  return <InboxList userId={session.userId} basePath="/investor/inbox" locale={locale} />;
}
