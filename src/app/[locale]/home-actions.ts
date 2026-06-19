"use server";
// إجراء نموذج الصفحة الرئيسية السريع — يحوّل المدخلات إلى CrmLead (HOME_QUICK / HOME_PAGE).
// ينسخ الهاتف إلى واتساب (لزر المحادثة)، ويضيف «نوع الاهتمام» للرسالة بلغة المرسل.
import { submitLead, type LeadFormState } from "@/lib/crm-submit";
import { getLocale } from "@/lib/i18n-server";
import { thq, HOME_INTERESTS, HOME_INTEREST_TO_SENDER_ROLE } from "@/lib/home-quick-i18n";

export async function submitHomeQuickLead(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  // الهاتف يُستخدم أيضاً كرقم واتساب إن لم يُملأ واتساب
  const phone = String(formData.get("phone") ?? "").trim();
  if (phone && !String(formData.get("whatsapp") ?? "").trim()) {
    formData.set("whatsapp", phone);
  }

  const itRaw = String(formData.get("interestType") ?? "").trim();
  const it = (HOME_INTERESTS as readonly string[]).includes(itRaw) ? itRaw : "";
  if (it) {
    const locale = await getLocale();
    const label = `${thq(locale, "interestLabel")}: ${thq(locale, `it.${it}`)}`;
    const msg = String(formData.get("message") ?? "").trim();
    formData.set("message", msg ? `${label}\n\n${msg}` : label);

    const mapped = HOME_INTEREST_TO_SENDER_ROLE[it as keyof typeof HOME_INTEREST_TO_SENDER_ROLE];
    if (mapped && !formData.get("senderRole")) formData.set("senderRole", mapped);
  }

  return submitLead({ leadType: "HOME_QUICK", source: "HOME_PAGE", formData });
}
