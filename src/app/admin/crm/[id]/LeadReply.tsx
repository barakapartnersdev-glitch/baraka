// قسم «ردّ جاهز» داخل تفاصيل الطلب (§11/§12) — مكوّن خادم يجلب القوالب بلغة العميل
// (مع fallback للعربية) ويمرّرها للوحة تفاعلية للنسخ/الفتح في البريد.
import { prisma } from "@/lib/prisma";
import { tr } from "@/lib/reply-i18n";
import type { Locale } from "@/lib/i18n";
import LeadReplyPanel from "./LeadReplyPanel";

export default async function LeadReply({ leadId, locale }: { leadId: string; locale: Locale }) {
  const lead = await prisma.crmLead.findUnique({
    where: { id: leadId },
    select: {
      fullName: true,
      email: true,
      languageCode: true,
      relatedOpportunity: { select: { title: true } },
    },
  });
  if (!lead) return null;

  // قوالب بلغة العميل، وإلا بالعربية
  let templates = await prisma.crmEmailTemplate.findMany({
    where: { isActive: true, languageCode: lead.languageCode },
    orderBy: { templateKey: "asc" },
    select: { templateKey: true, subject: true, body: true },
  });
  if (templates.length === 0) {
    templates = await prisma.crmEmailTemplate.findMany({
      where: { isActive: true, languageCode: "ar" },
      orderBy: { templateKey: "asc" },
      select: { templateKey: true, subject: true, body: true },
    });
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-bold text-navy mb-1">{tr(locale, "replyTitle")}</h2>
      <p className="text-xs text-gray-500 mb-3">{tr(locale, "replyHint")}</p>
      <LeadReplyPanel
        locale={locale}
        templates={templates}
        email={lead.email}
        leadName={lead.fullName}
        oppTitle={lead.relatedOpportunity?.title ?? ""}
      />
    </section>
  );
}
