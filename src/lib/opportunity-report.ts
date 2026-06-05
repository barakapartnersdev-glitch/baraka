// بناء تقرير منظّم من إجابات نموذج الفرصة — نسختان: كاملة (للإدارة) ومستثمر (بلا معلومات حساسة).
// مخرجات: أقسام مهيكلة (للعرض)، HTML للطباعة/Word، و Markdown جاهز للذكاء الصناعي.
import { FORM_PAGES, labelOf, type Ans } from "@/lib/opportunity-form";

export type ReportMode = "full" | "investor";

export interface ReportField { label: string; value: string }
export interface ReportSection { id: string; title: string; fields: ReportField[] }

// أقسام تُحجب بالكامل في نسخة المستثمر (هوية المالك، صفته القانونية، تفاصيل الملكية، الخصوصية الداخلية)
const INVESTOR_HIDDEN_PAGES = new Set(["applicant", "relation", "ownership", "privacy"]);
// حقول داخلية/دقيقة تُحجب دائماً عن المستثمر
const ALWAYS_SENSITIVE = new Set(["coords", "mapUrl", "projectArea", "minEntry"]);
const LOCATION_FIELDS = new Set(["projectCity", "projectArea", "coords", "mapUrl"]);
const FINANCIAL_FIELDS = new Set(["financialData", "annualRevenue", "netProfit", "hasDebts", "debtsNature", "hasValuation"]);

export function extractAnswers(sourceData: unknown): Ans {
  if (sourceData && typeof sourceData === "object" && "answers" in (sourceData as object)) {
    const a = (sourceData as { answers?: unknown }).answers;
    if (a && typeof a === "object") return a as Ans;
  }
  return {};
}

export function hasFormAnswers(sourceData: unknown): boolean {
  return Object.keys(extractAnswers(sourceData)).length > 0;
}

export function buildReport(answers: Ans, mode: ReportMode): ReportSection[] {
  const sens = Array.isArray(answers.sensitiveInfo) ? (answers.sensitiveInfo as string[]) : [];
  const hideExact = sens.includes("exactLocation");
  const hideFin = sens.includes("financials");

  const hidden = (pageId: string, fieldId: string): boolean => {
    if (mode === "full") return false;
    if (INVESTOR_HIDDEN_PAGES.has(pageId)) return true;
    if (ALWAYS_SENSITIVE.has(fieldId)) return true;
    if (hideExact && LOCATION_FIELDS.has(fieldId)) return true;
    if (hideFin && FINANCIAL_FIELDS.has(fieldId)) return true;
    return false;
  };

  const out: ReportSection[] = [];
  for (const page of FORM_PAGES) {
    if (mode === "investor" && INVESTOR_HIDDEN_PAGES.has(page.id)) continue;
    const fields: ReportField[] = [];
    for (const f of page.fields) {
      if (f.kind === "info") continue;
      if (f.showIf && !f.showIf(answers)) continue;
      if (hidden(page.id, f.id)) continue;
      const raw = answers[f.id];
      if (raw == null || raw === "" || (Array.isArray(raw) && raw.length === 0)) continue;
      const value = Array.isArray(raw)
        ? raw.map((v) => (f.options ? labelOf(f.id, v) : v)).join("، ")
        : f.options
        ? labelOf(f.id, raw)
        : String(raw);
      fields.push({ label: f.label ?? f.id, value });
    }
    if (fields.length) out.push({ id: page.id, title: page.title, fields });
  }
  return out;
}

export interface ReportMeta {
  title: string;
  ref: string;
  sector: string;
  country: string;
  ownerName?: string; // للنسخة الكاملة فقط
  generatedAt: string;
  mode: ReportMode;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// HTML منسّق (RTL) — يصلح للطباعة/حفظ PDF من المتصفح، ولفتحه في Word كملف .doc
export function buildReportHtml(meta: ReportMeta, sections: ReportSection[], forWord = false): string {
  const isInvestor = meta.mode === "investor";
  const rows = sections
    .map(
      (s) => `
    <h2>${esc(s.title)}</h2>
    <table>
      ${s.fields
        .map(
          (f) => `<tr><th>${esc(f.label)}</th><td>${esc(f.value).replace(/\n/g, "<br/>")}</td></tr>`
        )
        .join("\n      ")}
    </table>`
    )
    .join("\n");

  const printBtn = forWord
    ? ""
    : `<div class="noprint actions"><button onclick="window.print()">طباعة / حفظ PDF</button></div>`;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>تقرير الفرصة — ${esc(meta.title)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Tajawal', system-ui, sans-serif; color: #14213d; line-height: 1.8; max-width: 820px; margin: 24px auto; padding: 0 24px; }
  .head { border-bottom: 3px solid #c9a24b; padding-bottom: 14px; margin-bottom: 8px; display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
  .brand { color: #0a1f3c; font-weight: 700; font-size: 20px; }
  .brand small { display:block; font-size:11px; letter-spacing:2px; color:#c9a24b; font-weight:500; }
  h1 { font-size: 22px; margin: 14px 0 2px; color:#0a1f3c; }
  .meta { color: #5c6b80; font-size: 13px; margin-bottom: 18px; }
  .tag { display:inline-block; font-size:12px; font-weight:700; padding:3px 10px; border-radius:20px; }
  .tag.full { background:#0a1f3c; color:#fff; }
  .tag.inv { background:#fdf3da; color:#7a5b12; border:1px solid #e3c987; }
  .banner { background:#fdf3da; border:1px solid #e3c987; color:#7a5b12; padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:18px; }
  h2 { font-size: 16px; color:#0a1f3c; margin: 22px 0 8px; padding-bottom:5px; border-bottom:1px solid #e6e9ef; }
  table { width:100%; border-collapse: collapse; margin-bottom: 6px; }
  th, td { text-align: start; vertical-align: top; padding: 7px 10px; border:1px solid #e6e9ef; font-size: 13.5px; }
  th { background:#f6f7f9; color:#0a1f3c; font-weight:700; width: 38%; }
  .foot { margin-top: 26px; color:#8a94a6; font-size:11px; text-align:center; border-top:1px solid #e6e9ef; padding-top:12px; }
  .actions { margin: 14px 0 22px; }
  .actions button { background:#0a1f3c; color:#fff; border:0; border-radius:8px; padding:10px 18px; font-family:inherit; font-weight:700; cursor:pointer; }
  @media print { body { margin:0; } .noprint { display:none !important; } }
</style>
</head>
<body>
  <div class="head">
    <div class="brand">شركاء البركة<small>BARAKA PARTNERS</small></div>
    <span class="tag ${isInvestor ? "inv" : "full"}">${isInvestor ? "نسخة المستثمر" : "نسخة كاملة — للإدارة"}</span>
  </div>
  <h1>${esc(meta.title)}</h1>
  <div class="meta">
    المرجع: ${esc(meta.ref)} — القطاع: ${esc(meta.sector)} — الدولة: ${esc(meta.country)}${meta.ownerName ? ` — مقدّم الطلب: ${esc(meta.ownerName)}` : ""}<br/>
    تاريخ التوليد: ${esc(meta.generatedAt)}
  </div>
  ${isInvestor ? `<div class="banner">هذه نسخة مخصّصة للمستثمر، حُجبت منها هوية المالك والموقع الدقيق والمعلومات الحساسة وفق تفضيلات صاحب الفرصة وسياسة المنصة.</div>` : ""}
  ${printBtn}
  ${rows}
  <div class="foot">مُولَّد آلياً من منصة شركاء البركة — ${isInvestor ? "نسخة مستثمر" : "للاستخدام الداخلي للإدارة"}.</div>
</body>
</html>`;
}

// Markdown منظّم — مثالي لإقحامه في الذكاء الاصطناعي لتقييم الفرصة.
export function buildReportMarkdown(meta: ReportMeta, sections: ReportSection[]): string {
  const lines: string[] = [];
  lines.push(`# تقرير فرصة استثمارية — ${meta.title}`);
  lines.push("");
  lines.push(`- **المرجع:** ${meta.ref}`);
  lines.push(`- **القطاع:** ${meta.sector}`);
  lines.push(`- **الدولة:** ${meta.country}`);
  if (meta.ownerName) lines.push(`- **مقدّم الطلب:** ${meta.ownerName}`);
  lines.push(`- **النسخة:** ${meta.mode === "investor" ? "مستثمر (بلا معلومات حساسة)" : "كاملة (للإدارة)"}`);
  lines.push(`- **تاريخ التوليد:** ${meta.generatedAt}`);
  lines.push("");
  for (const s of sections) {
    lines.push(`## ${s.title}`);
    for (const f of s.fields) lines.push(`- **${f.label}:** ${f.value.replace(/\n/g, " ")}`);
    lines.push("");
  }
  return lines.join("\n");
}
