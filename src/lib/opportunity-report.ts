// بناء تقرير منظّم من إجابات نموذج الفرصة — نسختان: كاملة (للإدارة) ومستثمر (بلا معلومات حساسة).
// مخرجات: أقسام مهيكلة (للعرض)، HTML للطباعة/Word، و Markdown جاهز للذكاء الصناعي.
import { FORM_PAGES, labelOf, type Ans } from "@/lib/opportunity-form";
import { LOGO_DATA_URI } from "@/lib/logo-data";

export type ReportMode = "full" | "investor";

export interface ReportField { label: string; value: string }
export interface ReportSection { id: string; title: string; fields: ReportField[] }

// أقسام تُحجب بالكامل في نسخة المستثمر (هوية المالك، صفته القانونية، تفاصيل الملكية، الخصوصية الداخلية)
const INVESTOR_HIDDEN_PAGES = new Set(["applicant", "relation", "ownership", "privacy"]);
// حقول داخلية/دقيقة تُحجب دائماً عن المستثمر
const ALWAYS_SENSITIVE = new Set(["coords", "mapUrl", "projectArea", "minEntry"]);
const LOCATION_FIELDS = new Set(["projectCity", "projectArea", "coords", "mapUrl"]);
const FINANCIAL_FIELDS = new Set(["financialData", "annualRevenue", "netProfit", "hasDebts", "debtsNature", "hasValuation"]);
// تنقية نسخة المستثمر: حقول داخلية/تفضيلية/سلبية لا تخدم العرض الترويجي
const INVESTOR_HIDDEN_FIELDS = new Set([
  // تفضيلات وإعدادات داخلية
  "showLocation", "locationSensitive", "readyToUpload", "amountMode", "amountBasis", "hasProposedShare",
  // موقع دقيق
  "projectCity", "projectArea", "coords", "mapUrl",
  // تحديات ونزاعات والتزامات (لا تُعرض في الملف الترويجي)
  "challenges", "hasLegalDispute", "disputeDetail", "investorObligations",
  // مالية داخلية خام (يبقى العائد المتوقّع فقط)
  "financialData", "annualRevenue", "netProfit", "hasDebts", "debtsNature", "hasValuation", "minEntry",
]);

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
    if (INVESTOR_HIDDEN_FIELDS.has(fieldId)) return true;
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
    <section class="block">
      <h2>${esc(s.title)}</h2>
      <table>
        ${s.fields
          .map(
            (f, i) =>
              `<tr${i % 2 ? ' class="alt"' : ""}><th>${esc(f.label)}</th><td>${esc(f.value).replace(/\n/g, "<br/>")}</td></tr>`
          )
          .join("\n        ")}
      </table>
    </section>`
    )
    .join("\n");

  const printBtn = forWord
    ? ""
    : `<div class="noprint actions"><button onclick="window.print()">طباعة / حفظ PDF</button></div>`;

  const metaPills = [
    `المرجع: ${esc(meta.ref)}`,
    `القطاع: ${esc(meta.sector)}`,
    `الدولة: ${esc(meta.country)}`,
    meta.ownerName ? `مقدّم الطلب: ${esc(meta.ownerName)}` : "",
  ]
    .filter(Boolean)
    .map((x) => `<span class="pill">${x}</span>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${isInvestor ? "ملف الفرصة" : "تقرير الفرصة"} — ${esc(meta.title)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Tajawal', system-ui, sans-serif; color: #1a2433; line-height: 1.85; max-width: 820px; margin: 0 auto; padding: 32px 28px 48px; background: #fff; }
  .head { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
  .brandbox { display: flex; align-items: center; gap: 12px; }
  .logo { width: 46px; height: 46px; }
  .brand { color: #0a1f3c; font-weight: 800; font-size: 19px; line-height: 1.2; }
  .brand small { display: block; font-size: 10px; letter-spacing: 2.5px; color: #c9a24b; font-weight: 500; margin-top: 2px; }
  .tag { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; background: #0a1f3c; color: #fff; }
  .rule { height: 3px; background: linear-gradient(90deg, #c9a24b, #e3c987); border-radius: 3px; margin: 14px 0 22px; }
  .kicker { color: #c9a24b; font-weight: 700; font-size: 12px; letter-spacing: 1px; margin: 0 0 4px; }
  h1 { font-size: 25px; margin: 0 0 14px; color: #0a1f3c; font-weight: 800; line-height: 1.3; }
  .pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
  .pill { display: inline-block; font-size: 12px; color: #0a1f3c; background: #eef2f8; border: 1px solid #dde4ef; border-radius: 20px; padding: 4px 12px; }
  .date { color: #5c6b80; font-size: 12.5px; margin: 6px 0 0; }
  .actions { margin: 18px 0 22px; }
  .actions button { background: #0a1f3c; color: #fff; border: 0; border-radius: 9px; padding: 11px 22px; font-family: inherit; font-weight: 700; font-size: 14px; cursor: pointer; }
  .actions button:hover { background: #13315e; }
  .block { margin-bottom: 18px; page-break-inside: avoid; }
  h2 { font-size: 16px; color: #0a1f3c; font-weight: 800; margin: 22px 0 10px; padding-inline-start: 11px; border-inline-start: 4px solid #c9a24b; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: start; vertical-align: top; padding: 8px 12px; border: 1px solid #e6e9ef; font-size: 13.5px; }
  th { background: #eef2f8; color: #0a1f3c; font-weight: 700; width: 36%; }
  tr.alt td { background: #fafbfc; }
  .foot { margin-top: 30px; color: #5c6b80; font-size: 11.5px; text-align: center; border-top: 2px solid #c9a24b; padding-top: 14px; }
  .foot strong { color: #0a1f3c; }
  .foot span { color: #c9a24b; letter-spacing: 1px; }
  @media print { body { margin: 0; padding: 0 12px; } .noprint { display: none !important; } }
</style>
</head>
<body>
  <header class="head">
    <div class="brandbox">
      <img class="logo" src="${LOGO_DATA_URI}" alt="Baraka Partners" />
      <div class="brand">شركاء البركة<small>BARAKA PARTNERS</small></div>
    </div>
    ${isInvestor ? "" : `<span class="tag">للاستخدام الداخلي</span>`}
  </header>
  <div class="rule"></div>

  <p class="kicker">${isInvestor ? "ملف الفرصة الاستثمارية" : "تقرير الفرصة الاستثمارية"}</p>
  <h1>${esc(meta.title)}</h1>
  <div class="pills">${metaPills}</div>
  <p class="date">صدر بتاريخ ${esc(meta.generatedAt)}</p>

  ${printBtn}
  ${rows}

  <div class="foot">
    <strong>شركاء البركة — Baraka Partners</strong><br/>
    <span>Where Global Capital Meets Real Opportunities</span>
  </div>
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
  lines.push(`- **النسخة:** ${meta.mode === "investor" ? "ملف الفرصة (للمستثمر)" : "كاملة (للإدارة)"}`);
  lines.push(`- **تاريخ التوليد:** ${meta.generatedAt}`);
  lines.push("");
  for (const s of sections) {
    lines.push(`## ${s.title}`);
    for (const f of s.fields) lines.push(`- **${f.label}:** ${f.value.replace(/\n/g, " ")}`);
    lines.push("");
  }
  return lines.join("\n");
}
