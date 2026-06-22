// تحليل ملف المشروع (دراسة جدوى/عرض/مذكرة) بالذكاء الاصطناعي واستخراج مسوّدة فرصة عامة.
// يقرأ PDF/صورة/نص مباشرةً عبر OpenAI (gpt-4o) متعدّد الوسائط — بلا اعتمادية إضافية.
// المُخرَج عربي وجاهز لتعبئة نموذج «نشر فرصة»، ثم تُترجَم لاحقاً عند النشر.
import "server-only";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

// أقصى حجم للملف المُرسَل للنموذج (قيود الطلب على الـ API).
export const MAX_DOC_BYTES = 20 * 1024 * 1024; // 20MB

export interface OppDraft {
  displayTitle?: string;
  summary?: string;
  highlights?: string;
  details?: string;
  paybackPeriod?: string; // فترة الاسترداد المتوقعة لرأس المال
  annualReturn?: string; // العائد السنوي المتوقع
  sector?: string;
  country?: string;
  city?: string;
  investmentMin?: string; // أرقام فقط
  investmentMax?: string;
  currency?: string;
}

export class MissingApiKeyError extends Error {
  constructor() {
    super("OPENAI_API_KEY (أو ANTHROPIC_API_KEY) غير مضبوط.");
    this.name = "MissingApiKeyError";
  }
}

export class UnsupportedFileError extends Error {
  constructor() {
    super("نوع الملف غير مدعوم.");
    this.name = "UnsupportedFileError";
  }
}

const SYSTEM = `أنت محلّل استثماري خبير في منصة «شركاء البركة». تتلقّى ملف مشروع (دراسة جدوى، عرض استثماري، مذكرة معلومات...) وتستخرج منه نسخة عرض عامة جاهزة للنشر.

التزم بدقّة بالآتي:
- اكتب كل القيم بالعربية الفصحى، حتى لو كان الملف بلغة أخرى.
- لا تُدرج أي معلومات حساسة تكشف الهوية (اسم المالك أو الشركة، العنوان الدقيق، أرقام تواصل، أسماء أشخاص) — اجعل العرض محايداً يحمي صاحب المشروع.
- ابنِ عنواناً جذّاباً، ومقدمة استثمارية مقنعة، وأبرز نقاط واقعية، وتفاصيل موسّعة — اعتماداً فقط على ما ورد في الملف. لا تختلق أرقاماً أو حقائق؛ وعند غياب معلومة اتركها فارغة.
- استخرج القطاع والدولة والمدينة ونطاق الاستثمار المطلوب إن توفّرت.
- أعد JSON صارماً فقط، دون أي نص قبله أو بعده.`;

function instructions(): string {
  return `حلّل ملف المشروع المرفق وأعد كائن JSON بهذه المفاتيح بالضبط (اترك القيمة "" إن لم تتوفّر):
{
  "displayTitle": "عنوان عرض جذّاب ومختصر",
  "summary": "مقدمة استثمارية واضحة في فقرة (٣-٦ أسطر)",
  "highlights": "أبرز النقاط — كل نقطة في سطر مستقل",
  "details": "تفاصيل إضافية موسّعة عن الفرصة",
  "paybackPeriod": "فترة الاسترداد المتوقعة لرأس المال (مثل: سنتان، 18 شهراً) — إن وُجدت",
  "annualReturn": "العائد السنوي المتوقع (مثل: 15%، 20-25% سنوياً) — إن وُجد",
  "sector": "القطاع (مثل: تصنيع أغذية، عقارات وتطوير...)",
  "country": "الدولة",
  "city": "المدينة",
  "investmentMin": "الحد الأدنى للاستثمار — بأرقام لاتينية (0-9) فقط بلا فواصل أو عملة",
  "investmentMax": "الحد الأعلى — بأرقام لاتينية (0-9) فقط",
  "currency": "رمز العملة بثلاثة أحرف لاتينية مثل USD أو EUR"
}`;
}

// نقطة الدخول — تختار المزوّد المتاح وتعيد المسوّدة.
export async function analyzeProjectDocument(file: File): Promise<OppDraft> {
  const mime = file.type || "";
  const name = file.name || "document";
  const buffer = Buffer.from(await file.arrayBuffer());

  let raw: string;
  if (process.env.OPENAI_API_KEY) raw = await viaOpenAI(buffer, mime, name);
  else if (process.env.ANTHROPIC_API_KEY) raw = await viaAnthropic(buffer, mime, name);
  else throw new MissingApiKeyError();

  return normalize(parseJson(raw));
}

// ===== OpenAI (gpt-4o متعدّد الوسائط) =====
type OpenAIPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "file"; file: { filename: string; file_data: string } };

function isPdf(mime: string, name: string): boolean {
  return mime === "application/pdf" || name.toLowerCase().endsWith(".pdf");
}
function isImage(mime: string): boolean {
  return mime.startsWith("image/");
}
function isText(mime: string, name: string): boolean {
  return (
    mime.startsWith("text/") ||
    /\.(txt|md|csv|json)$/i.test(name)
  );
}

function openAIFilePart(buffer: Buffer, mime: string, name: string): OpenAIPart {
  const b64 = buffer.toString("base64");
  if (isPdf(mime, name)) {
    return { type: "file", file: { filename: name, file_data: `data:application/pdf;base64,${b64}` } };
  }
  if (isImage(mime)) {
    return { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } };
  }
  if (isText(mime, name)) {
    return { type: "text", text: `محتوى الملف النصي:\n\n${buffer.toString("utf-8").slice(0, 200000)}` };
  }
  throw new UnsupportedFileError();
}

async function viaOpenAI(buffer: Buffer, mime: string, name: string): Promise<string> {
  const filePart = openAIFilePart(buffer, mime, name);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: [{ type: "text", text: instructions() }, filePart] },
      ],
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || "{}";
}

// ===== Anthropic (احتياطي) =====
async function viaAnthropic(buffer: Buffer, mime: string, name: string): Promise<string> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const b64 = buffer.toString("base64");

  let docPart: unknown;
  if (isPdf(mime, name)) {
    docPart = { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } };
  } else if (isImage(mime)) {
    docPart = { type: "image", source: { type: "base64", media_type: mime, data: b64 } };
  } else if (isText(mime, name)) {
    docPart = { type: "text", text: `محتوى الملف النصي:\n\n${buffer.toString("utf-8").slice(0, 200000)}` };
  } else {
    throw new UnsupportedFileError();
  }

  const msg = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: [{ role: "user", content: [{ type: "text", text: `${instructions()}\n\nأعد JSON فقط.` }, docPart] as any }],
  });
  return msg.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join("\n")
    .trim();
}

// ===== مساعدات =====
function parseJson(raw: string): Record<string, unknown> {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  const slice = start !== -1 && end !== -1 ? candidate.slice(start, end + 1) : candidate;
  try {
    return JSON.parse(slice) as Record<string, unknown>;
  } catch {
    throw new Error("تعذّر تحليل ناتج النموذج (JSON غير صالح).");
  }
}

// يحوّل الأرقام العربية-الهندية والفارسية إلى لاتينية ليتمكّن الفرز منها.
function toAsciiDigits(s: string): string {
  return s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

// يحوّل اسم/رمز العملة إلى رمز ISO من الخيارات المدعومة (أو undefined).
function normCurrency(raw: string): string | undefined {
  const up = raw.trim().toUpperCase();
  if (/^[A-Z]{3}$/.test(up)) return up; // رمز ISO جاهز
  const t = raw.toLowerCase();
  if (/دولار|dollar|usd/.test(t)) return "USD";
  if (/يورو|euro|eur/.test(t)) return "EUR";
  if (/ليرة|تركي|lira|try/.test(t)) return "TRY";
  if (/ريال|سعود|sar/.test(t)) return "SAR";
  if (/درهم|امارات|إمارات|aed|dirham/.test(t)) return "AED";
  return undefined;
}

function normalize(obj: Record<string, unknown>): OppDraft {
  const out: OppDraft = {};
  const textKeys: (keyof OppDraft)[] = [
    "displayTitle",
    "summary",
    "highlights",
    "details",
    "paybackPeriod",
    "annualReturn",
    "sector",
    "country",
    "city",
  ];
  for (const k of textKeys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  for (const k of ["investmentMin", "investmentMax"] as const) {
    const v = obj[k];
    if (v != null) {
      const digits = toAsciiDigits(String(v)).replace(/[^\d]/g, "");
      if (digits) out[k] = digits;
    }
  }
  const cur = obj.currency;
  if (typeof cur === "string" && cur.trim()) {
    const code = normCurrency(cur);
    if (code) out.currency = code;
  }
  return out;
}
