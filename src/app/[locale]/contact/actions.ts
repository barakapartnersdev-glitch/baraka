"use server";
// إجراء نموذج التواصل العام — يحوّل الرسالة إلى CrmLead (CONTACT / CONTACT_PAGE).
// يضيف «نوع الطلب» إلى نص الرسالة بلغة المرسل، ويربطه بصفة senderRole حيث يوجد تطابق.
import { submitLead, type LeadFormState } from "@/lib/crm-submit";
import { getLocale } from "@/lib/i18n-server";
import { tc } from "@/lib/crm-i18n";
import { tcc, REQUEST_TYPES, REQUEST_TYPE_TO_SENDER_ROLE } from "@/lib/contact-i18n";

export async function submitContactLead(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const locale = await getLocale();

  // كل حقول نموذج التواصل إلزامية — لا نقبل طلباً ناقصاً (سند خادمي لـ required في المتصفح).
  const phone = String(formData.get("phone") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!phone || !country || !message) {
    return { error: tc(locale, "err.required") };
  }

  const rtRaw = String(formData.get("requestType") ?? "").trim();
  const rt = (REQUEST_TYPES as readonly string[]).includes(rtRaw) ? rtRaw : "";

  if (rt) {
    const label = `${tcc(locale, "requestTypeLabel")}: ${tcc(locale, `rt.${rt}`)}`;
    const msg = String(formData.get("message") ?? "").trim();
    formData.set("message", msg ? `${label}\n\n${msg}` : label);

    const mapped = REQUEST_TYPE_TO_SENDER_ROLE[rt as keyof typeof REQUEST_TYPE_TO_SENDER_ROLE];
    if (mapped && !formData.get("senderRole")) formData.set("senderRole", mapped);
  }

  return submitLead({ leadType: "CONTACT", source: "CONTACT_PAGE", formData });
}
