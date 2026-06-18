"use server";
// إجراء إرسال نموذج الانضمام كسفير استثمار من الصفحة العامة.
import { submitAmbassadorApplication, type AmbassadorFormState } from "@/lib/ambassador-submit";

export async function submitAmbassador(
  _prev: AmbassadorFormState,
  formData: FormData
): Promise<AmbassadorFormState> {
  return submitAmbassadorApplication(formData);
}
