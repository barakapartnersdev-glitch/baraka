// بوّابة الوكيل: صندوق الوارد من الإدارة (منفصل عن رسائله التي يبدؤها هو).
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import InboxList from "@/components/inbox/InboxList";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  return <InboxList userId={session.userId} basePath="/agent/inbox" locale={locale} />;
}
