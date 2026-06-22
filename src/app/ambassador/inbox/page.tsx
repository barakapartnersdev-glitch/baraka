// بوّابة السفير: صندوق الوارد من الإدارة (منفصل عن رسائله التي يبدؤها هو).
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import InboxList from "@/components/inbox/InboxList";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  return <InboxList userId={session.userId} basePath="/ambassador/inbox" locale={locale} />;
}
