"use server";
// إجراء إرسال نموذج «طلب اهتمام بفرصة» من الصفحة العامة للفرصة.
import { submitLead, type LeadFormState } from "@/lib/crm-submit";

export async function submitInterestLead(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  return submitLead({
    leadType: "INVESTOR_INTEREST",
    source: "OPPORTUNITY_PAGE",
    formData,
  });
}
