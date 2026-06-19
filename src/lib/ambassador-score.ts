// حساب درجة تقييم طلب السفير تلقائياً (حد أقصى 100) وفق معايير القسم 9 من المواصفات.
// النتيجة قابلة للتعديل اليدوي من الإدارة لاحقاً.
import { asStringArray } from "@/lib/ambassador-form";

export interface ScorableApplication {
  yearsOfExperience: string | null;
  experienceSummary: string | null;
  linkedinUrl: string | null;
  relationshipType: string | null;
  coveredCountries: unknown;
  coveredSectors: unknown;
  investorTypes: unknown;
  investmentRange: string | null;
  motivation: string | null;
  addedValue: string | null;
}

const HIGH_VALUE_TYPES = ["hnwi", "family_office", "fund", "investment_company", "holding"];
const BIG_RANGES = ["1m_5m", "5m_20m", "gt20m"];

export function computeAmbassadorScore(a: ScorableApplication, hasProfileFile: boolean): number {
  let s = 0;

  // وضوح الخبرة المهنية: 15
  if (a.yearsOfExperience && a.yearsOfExperience !== "lt2") s += 8;
  if ((a.experienceSummary?.trim().length ?? 0) >= 40) s += 7;

  // وجود LinkedIn احترافي: 10
  if (a.linkedinUrl && a.linkedinUrl.trim().length > 0) s += 10;

  // وجود بروفايل أو CV: 10
  if (hasProfileFile) s += 10;

  // علاقات مباشرة مع مستثمرين: 20
  if (a.relationshipType === "direct") s += 20;
  else if (a.relationshipType === "mixed") s += 10;

  // تغطية دول مهمة: 10
  if (asStringArray(a.coveredCountries).length > 0) s += 10;

  // تغطية قطاعات مطلوبة: 10
  if (asStringArray(a.coveredSectors).length > 0) s += 10;

  // القدرة على الوصول لمستثمرين بملاءة عالية: 15
  const types = asStringArray(a.investorTypes);
  const highValue = types.some((v) => HIGH_VALUE_TYPES.includes(v));
  const bigRange = BIG_RANGES.includes(a.investmentRange ?? "");
  if (highValue && bigRange) s += 15;
  else if (highValue || bigRange) s += 8;

  // جودة الإجابات في النموذج: 10
  const answersLen = (a.motivation?.trim().length ?? 0) + (a.addedValue?.trim().length ?? 0);
  if (answersLen >= 120) s += 10;
  else if (answersLen >= 40) s += 5;

  return Math.min(100, s);
}
