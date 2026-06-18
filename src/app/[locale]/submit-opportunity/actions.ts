"use server";
// إجراء إرسال نموذج «اعرض فرصتك الاستثمارية» — يحوّله إلى Lead بنوع OPPORTUNITY_SUBMISSION.
import { submitLead, type LeadFormState } from "@/lib/crm-submit";

export async function submitOpportunityLead(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  return submitLead({
    leadType: "OPPORTUNITY_SUBMISSION",
    source: "SUBMIT_PAGE",
    formData,
  });
}
