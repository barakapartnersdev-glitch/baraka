// بوّابة السفير: عرض محادثة من الإدارة.
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import ThreadView from "@/components/inbox/ThreadView";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const { id } = await params;
  return <ThreadView userId={session.userId} threadId={id} basePath="/ambassador/inbox" locale={locale} />;
}
