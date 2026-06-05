// إعداد بطاقة عرض الفرصة (النسخة العامة + نسخة المستثمر) تلقائياً من إجابات النموذج.
// يحترم الخصوصية: لا اسم مالك ولا موقع دقيق ولا أرقام مالية داخلية في النسخة العامة.
import { labelOf, type Ans } from "@/lib/opportunity-form";
import type { VersionData } from "@/lib/opportunity";

const str = (a: Ans, id: string) =>
  typeof a[id] === "string" ? (a[id] as string).trim() : "";
const arr = (a: Ans, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : []);
const has = (a: Ans, id: string, v: string) => arr(a, id).includes(v);

// اكتمال الحد الأدنى اللازم لإعداد بطاقة عرض ذات معنى + موافقات الحوكمة.
export function isFormComplete(a: Ans): boolean {
  const need = [
    "projectName", "projectCountry", "opportunityNature", "projectStatus",
    "ownershipType", "lookingFor", "amountMode", "agreeReframe", "agreeNda",
  ];
  for (const id of need) if (!str(a, id)) return false;
  if (a["amountMode"] === "fixed" && !str(a, "amountFixed")) return false;
  if (a["amountMode"] === "range" && (!str(a, "amountMin") || !str(a, "amountMax"))) return false;
  if (!has(a, "declaration", "agree")) return false;
  // يجب موافقة المالك على إعادة الصياغة والعرض المختصر
  if (a["agreeReframe"] !== "yes") return false;
  return true;
}

function fmtRange(a: Ans): string | null {
  const f = (s: string) => {
    const n = s.replace(/[^\d]/g, "");
    return n ? Number(n).toLocaleString("en-US") : "";
  };
  if (a["amountMode"] === "fixed") {
    const v = f(str(a, "amountFixed"));
    return v ? `${v} USD` : null;
  }
  if (a["amountMode"] === "range") {
    const lo = f(str(a, "amountMin"));
    const hi = f(str(a, "amountMax"));
    if (lo || hi) return `${lo || "?"} – ${hi || "?"} USD`;
  }
  return null;
}

// النسخة العامة (بطاقة الزائر) — عنوان محايد وملخّص آمن دون معلومات حساسة.
export function buildPublicVersionDraft(a: Ans): VersionData {
  const nature = str(a, "opportunityNature") ? labelOf("opportunityNature", str(a, "opportunityNature")) : "";
  const country = str(a, "projectCountry");
  const status = str(a, "projectStatus") ? labelOf("projectStatus", str(a, "projectStatus")) : "";
  const looking = str(a, "lookingFor") ? labelOf("lookingFor", str(a, "lookingFor")) : "";
  const range = fmtRange(a);
  const strengths = arr(a, "strengths").slice(0, 4).map((v) => labelOf("strengths", v));

  // عنوان محايد إن طلب المالك إخفاء الهوية/الاسم؛ وإلا اسم المشروع.
  const hideIdentity = has(a, "sensitiveInfo", "ownerName") || has(a, "sensitiveInfo", "companyName");
  const projectName = str(a, "projectName");
  const displayTitle =
    !hideIdentity && projectName
      ? projectName
      : `فرصة ${nature || "استثمارية"}${country ? ` في ${country}` : ""}`;

  const summaryParts = [
    `${nature || "فرصة استثمارية"}${status ? ` (${status})` : ""}${country ? ` في ${country}` : ""}.`,
    looking ? `النوع المطلوب: ${looking}.` : "",
    range ? `نطاق الاستثمار: ${range}.` : "",
  ].filter(Boolean);

  return {
    displayTitle,
    summary: summaryParts.join(" "),
    highlights: strengths.length ? strengths.join(" • ") : undefined,
  };
}

// نسخة المستثمر المسجّل — تفاصيل أوسع، تبقى بلا هوية/موقع دقيق/أرقام داخلية.
export function buildInvestorVersionDraft(a: Ans): VersionData {
  const pub = buildPublicVersionDraft(a);
  const use = arr(a, "useOfCapital").map((v) => labelOf("useOfCapital", v));
  const share = str(a, "proposedShare");
  const entry = str(a, "investorEntry") ? labelOf("investorEntry", str(a, "investorEntry")) : "";
  const details = [
    use.length ? `أوجه استخدام رأس المال: ${use.join("، ")}.` : "",
    share ? `نسبة الشراكة المقترحة: ~${share}%.` : "",
    entry ? `صيغة دخول المستثمر: ${entry}.` : "",
  ].filter(Boolean).join(" ");

  return {
    displayTitle: pub.displayTitle,
    summary: pub.summary,
    highlights: pub.highlights,
    details: details || undefined,
  };
}
