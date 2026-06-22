// بوّابة صاحب الأصل: صندوق الوارد من الإدارة.
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import InboxList from "@/components/inbox/InboxList";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();
  return <InboxList userId={session.userId} basePath="/owner/inbox" locale={locale} />;
}
