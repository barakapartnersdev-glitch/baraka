// مخطط نموذج توثيق المستثمر — KYC + الملف الاستثماري للمطابقة.
// المصدر الموحّد: يقرؤه محرّك الـ wizard لعرض الأقسام والتحقّق، وتُخزَّن الإجابات في InvestorEntity.profile.
// مبدأ الحوكمة: بيانات الهوية والمستندات سرّية للإدارة فقط، ولا تُكشف لأصحاب المشاريع إطلاقاً.
import { is, type Ans, type FormPage, type Opt } from "@/lib/opportunity-form";

export type { Ans } from "@/lib/opportunity-form";

// قطاعات الاهتمام (للمطابقة مع الفرص)
export const SECTORS: Opt[] = [
  { v: "industrial", l: "صناعة وتصنيع" },
  { v: "agri", l: "زراعة وأغذية" },
  { v: "realestate", l: "عقارات وإنشاءات" },
  { v: "tech", l: "تقنية ورقمنة" },
  { v: "health", l: "صحة وأدوية" },
  { v: "energy", l: "طاقة وبنية تحتية" },
  { v: "retail", l: "تجارة وتجزئة" },
  { v: "tourism", l: "سياحة وضيافة" },
  { v: "logistics", l: "لوجستيات ونقل" },
  { v: "finance", l: "مالية وخدمات" },
  { v: "education", l: "تعليم" },
  { v: "other", l: "قطاعات أخرى" },
];

// النطاق الجغرافي المفضّل
export const REGIONS: Opt[] = [
  { v: "gulf", l: "دول الخليج" },
  { v: "levant", l: "بلاد الشام" },
  { v: "egypt", l: "مصر" },
  { v: "maghreb", l: "المغرب العربي" },
  { v: "turkey", l: "تركيا" },
  { v: "europe", l: "أوروبا" },
  { v: "africa", l: "أفريقيا" },
  { v: "asia", l: "آسيا" },
  { v: "americas", l: "الأمريكتان" },
  { v: "global", l: "عالمي / مرن" },
];

// مساعد: هل المستثمر كيان (شركة/صندوق) لا فرد؟
const isEntity = (a: Ans) => is(a, "investorType", "company") || is(a, "investorType", "fund");
const isIndividual = (a: Ans) => is(a, "investorType", "individual");

export const INVESTOR_PAGES: FormPage[] = [
  // ===== 1) نوع المستثمر والكيان =====
  {
    id: "entity",
    title: "نوع المستثمر",
    subtitle: "حدّد صفتك الاستثمارية. تبقى كل البيانات سرّية لدى الإدارة.",
    fields: [
      {
        id: "investorType", label: "أنت تستثمر بصفتك:", kind: "radio", required: true,
        options: [
          { v: "individual", l: "فرد" },
          { v: "company", l: "شركة" },
          { v: "fund", l: "صندوق استثماري" },
        ],
        help: "يحدّد هذا الخيار بقية الأسئلة المطلوبة منك.",
      },
      // كيان (شركة/صندوق)
      { id: "legalName", label: "الاسم القانوني للكيان", kind: "text", required: true, showIf: isEntity, example: "Golden Crops Investment Ltd." },
      { id: "regCountry", label: "بلد التسجيل", kind: "country", required: true, showIf: isEntity },
      { id: "regNumber", label: "رقم السجل التجاري / الترخيص", kind: "text", required: true, showIf: isEntity },
      { id: "repName", label: "اسم الممثّل المفوّض", kind: "text", required: true, showIf: isEntity, help: "الشخص المخوّل بالتعامل والتوقيع نيابة عن الكيان." },
      { id: "repRole", label: "صفة الممثّل داخل الكيان", kind: "text", required: true, showIf: isEntity, example: "مدير عام / شريك مفوّض" },
      {
        id: "repAuthority", label: "صلاحية التمثيل", kind: "radio", showIf: isEntity,
        options: [
          { v: "signatory", l: "مفوّض بالتوقيع" },
          { v: "manager", l: "مدير مخوّل" },
          { v: "partner", l: "شريك" },
          { v: "agent", l: "وكيل بتوكيل رسمي" },
        ],
      },
      { id: "ubo", label: "المستفيد الحقيقي (UBO) إن اختلف عن الممثّل", kind: "text", showIf: isEntity, help: "الاسم الكامل لمن يملك أو يسيطر فعلياً على الكيان (متطلّب امتثال)." },
    ],
  },

  // ===== 2) الهوية والتوثيق (KYC) — سرّي =====
  {
    id: "identity",
    title: "الهوية والتوثيق (KYC)",
    subtitle: "بيانات تحقّق الهوية. سرّية تماماً وتُستخدم لاعتماد الإدارة فقط.",
    fields: [
      // فرد
      { id: "legalFullName", label: "الاسم الكامل كما في وثيقة الهوية", kind: "text", required: true, showIf: isIndividual, help: "الاسم الرباعي كما يظهر في الهوية أو جواز السفر." },
      { id: "nationality", label: "الجنسية", kind: "country", required: true, showIf: isIndividual },
      { id: "residenceCountry", label: "بلد الإقامة", kind: "country", required: true, showIf: isIndividual },
      { id: "cityResidence", label: "المدينة", kind: "text", required: true, showIf: isIndividual },
      { id: "birthDate", label: "تاريخ الميلاد", kind: "text", showIf: isIndividual, placeholder: "YYYY-MM-DD" },
      {
        id: "idDocType", label: "نوع وثيقة الهوية", kind: "radio", required: true, showIf: isIndividual,
        options: [
          { v: "national_id", l: "هوية وطنية" },
          { v: "passport", l: "جواز سفر" },
          { v: "residency", l: "إقامة" },
        ],
      },
      { id: "idNumber", label: "رقم الوثيقة", kind: "text", required: true, showIf: isIndividual },
      // كيان — هوية الممثّل
      { id: "repNationality", label: "جنسية الممثّل المفوّض", kind: "country", required: true, showIf: isEntity },
      { id: "repResidence", label: "بلد إقامة الممثّل", kind: "country", showIf: isEntity },
      {
        id: "repIdDocType", label: "نوع وثيقة هوية الممثّل", kind: "radio", required: true, showIf: isEntity,
        options: [
          { v: "national_id", l: "هوية وطنية" },
          { v: "passport", l: "جواز سفر" },
          { v: "residency", l: "إقامة" },
        ],
      },
      { id: "repIdNumber", label: "رقم وثيقة هوية الممثّل", kind: "text", required: true, showIf: isEntity },
      {
        id: "docsNote", kind: "info", noteTone: "info",
        note: "ستطلب الإدارة لاحقاً نسخاً من المستندات (إثبات الهوية، وللكيان: السجل التجاري وتفويض الممثّل) عبر قناة رفع آمنة قبل اعتماد حسابك.",
      },
    ],
  },

  // ===== 3) الملف الاستثماري (للمطابقة) =====
  {
    id: "profile",
    title: "الملف الاستثماري",
    subtitle: "يساعدنا على مطابقتك بالفرص الأنسب وترتيب اهتمامك.",
    fields: [
      { id: "sectors", label: "القطاعات محل اهتمامك", kind: "checkbox", required: true, options: SECTORS, help: "اختر قطاعاً واحداً أو أكثر." },
      { id: "regions", label: "النطاق الجغرافي المفضّل", kind: "checkbox", required: true, options: REGIONS },
      {
        id: "ticketCurrency", label: "عملة الاستثمار", kind: "radio", required: true,
        options: [
          { v: "USD", l: "دولار أمريكي (USD)" },
          { v: "EUR", l: "يورو (EUR)" },
          { v: "TRY", l: "ليرة تركية (TRY)" },
          { v: "other", l: "أخرى" },
        ],
      },
      { id: "ticketMin", label: "أدنى حجم استثمار متوقّع", kind: "money", required: true, help: "المبلغ الذي يمكنك تخصيصه للفرصة الواحدة (الحد الأدنى)." },
      { id: "ticketMax", label: "أعلى حجم استثمار متوقّع", kind: "money", required: true },
      {
        id: "participationType", label: "نوع المشاركة المفضّل", kind: "checkbox", required: true,
        options: [
          { v: "equity", l: "حصة ملكية (شراكة برأس المال)" },
          { v: "financing", l: "تمويل / قرض بعائد" },
          { v: "operational", l: "شراكة تشغيلية / إدارية" },
          { v: "flexible", l: "مرن حسب الفرصة" },
        ],
      },
      {
        id: "horizon", label: "أفق الاستثمار", kind: "radio",
        options: [
          { v: "short", l: "قصير (أقل من 3 سنوات)" },
          { v: "medium", l: "متوسّط (3 – 6 سنوات)" },
          { v: "long", l: "طويل (أكثر من 6 سنوات)" },
          { v: "flexible", l: "مرن" },
        ],
      },
      {
        id: "sourceOfFunds", label: "مصدر أموال الاستثمار", kind: "radio", required: true,
        help: "تصريح عام مطلوب ضمن متطلّبات مكافحة غسل الأموال (AML).",
        options: [
          { v: "personal", l: "أموال شخصية / مدّخرات" },
          { v: "business", l: "أرباح أعمال أو شركة" },
          { v: "fund", l: "صندوق / مستثمرون مجمّعون" },
          { v: "financing", l: "تمويل بنكي" },
          { v: "inheritance", l: "إرث / هبة" },
          { v: "mixed", l: "مختلط" },
          { v: "other", l: "أخرى" },
        ],
      },
      { id: "sourceOfFundsNote", label: "توضيح مصدر الأموال", kind: "textarea", showIf: (a) => is(a, "sourceOfFunds", "other") || is(a, "sourceOfFunds", "mixed") },
      { id: "experience", label: "خبرة استثمارية سابقة (اختياري)", kind: "textarea", help: "مجالات أو أمثلة استثمارات سابقة إن وُجدت — يساعد على فهم ملفك." },
    ],
  },

  // ===== 4) الإقرارات والموافقات =====
  {
    id: "declarations",
    title: "الإقرارات والموافقات",
    subtitle: "موافقات قانونية لازمة لتفعيل حسابك.",
    fields: [
      {
        id: "qualifiedInvestor", label: "هل تصنّف نفسك مستثمراً مؤهّلاً / محترفاً؟", kind: "radio",
        options: [
          { v: "yes", l: "نعم" },
          { v: "no", l: "لا" },
          { v: "na", l: "لا أعرف / لا ينطبق" },
        ],
      },
      {
        id: "agree", label: "أقرّ وأوافق على ما يلي:", kind: "checkbox", required: true,
        options: [
          { v: "terms", l: "الموافقة على الشروط والأحكام وسياسة الخصوصية" },
          { v: "dataProcessing", l: "الموافقة على معالجة بياناتي (وفق KVKK / GDPR)" },
          { v: "accuracy", l: "إقرار بصحة البيانات والتزام تحديثها عند تغيّرها" },
          { v: "ncnda", l: "العلم بأن الاطلاع الكامل على أي فرصة يتطلّب توقيع اتفاقية NCNDA لاحقاً" },
        ],
      },
    ],
  },
];

// ===== مساعدات =====

// عنوان خيار حسب معرّف الحقل والقيمة
export function labelOf(fieldId: string, value: string): string {
  for (const page of INVESTOR_PAGES) {
    for (const f of page.fields) {
      if (f.id === fieldId && f.options) {
        const o = f.options.find((x) => x.v === value);
        if (o) return o.l;
      }
    }
  }
  return value;
}

const str = (a: Ans, id: string) => (typeof a[id] === "string" ? (a[id] as string).trim() : "");
const arr = (a: Ans, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : []);

// اكتمال الحد الأدنى لاعتماد الملف وإتاحة طلب الاهتمام بالفرص
export function isInvestorProfileComplete(a: Ans): boolean {
  if (!str(a, "investorType")) return false;

  if (a["investorType"] === "individual") {
    for (const id of ["legalFullName", "nationality", "residenceCountry", "cityResidence", "idDocType", "idNumber"]) {
      if (!str(a, id)) return false;
    }
  } else {
    // شركة / صندوق
    for (const id of ["legalName", "regCountry", "regNumber", "repName", "repRole", "repNationality", "repIdDocType", "repIdNumber"]) {
      if (!str(a, id)) return false;
    }
  }

  // الملف الاستثماري
  if (arr(a, "sectors").length === 0) return false;
  if (arr(a, "regions").length === 0) return false;
  if (!str(a, "ticketCurrency")) return false;
  if (!str(a, "ticketMin") || !str(a, "ticketMax")) return false;
  if (arr(a, "participationType").length === 0) return false;
  if (!str(a, "sourceOfFunds")) return false;

  // الإقرارات — الأربعة إلزامية
  const ag = arr(a, "agree");
  for (const need of ["terms", "dataProcessing", "accuracy", "ncnda"]) {
    if (!ag.includes(need)) return false;
  }
  return true;
}

// أقسام منظّمة لعرض الملف كاملاً في لوحة الإدارة
export interface ProfileField { label: string; value: string }
export interface ProfileSection { id: string; title: string; fields: ProfileField[] }

export function buildInvestorSections(a: Ans): ProfileSection[] {
  const out: ProfileSection[] = [];
  for (const page of INVESTOR_PAGES) {
    const fields: ProfileField[] = [];
    for (const f of page.fields) {
      if (f.kind === "info") continue;
      if (f.showIf && !f.showIf(a)) continue;
      const raw = a[f.id];
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

// ملخّص قصير للمطابقة (يُعرض للإدارة)
export function profileSummary(a: Ans): string {
  const sectors = arr(a, "sectors").map((v) => labelOf("sectors", v)).join("، ");
  const regions = arr(a, "regions").map((v) => labelOf("regions", v)).join("، ");
  const cur = str(a, "ticketCurrency");
  const range = str(a, "ticketMin") && str(a, "ticketMax") ? `${str(a, "ticketMin")} – ${str(a, "ticketMax")} ${cur}` : "";
  const parts = [
    sectors ? `القطاعات: ${sectors}` : "",
    regions ? `الجغرافيا: ${regions}` : "",
    range ? `حجم التذكرة: ${range}` : "",
  ].filter(Boolean);
  return parts.join(" · ");
}
