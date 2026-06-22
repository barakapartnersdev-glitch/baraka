// ترجمة الفرصة الاستثمارية للغات الأربع بالذكاء الاصطناعي.
// المزوّد الافتراضي: OpenAI (OPENAI_API_KEY) بصيغة JSON. احتياطياً: Anthropic (ANTHROPIC_API_KEY).
// المُدخل عربي (النسخة العامة)؛ المُخرَج كائن { en, zh, tr } بنفس الحقول مترجمة.
import "server-only";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

// اللغات الهدف (العربية هي المصدر فلا تُترجَم).
export const TARGET_LOCALES = ["en", "zh", "tr"] as const;
export type TargetLocale = (typeof TARGET_LOCALES)[number];

// الحقول القابلة للترجمة في الفرصة.
export interface OppFields {
  displayTitle?: string;
  summary?: string;
  highlights?: string; // أسطر متعددة (كل سطر نقطة) — تُحفظ فواصل الأسطر
  details?: string;
  sector?: string;
  country?: string;
  city?: string;
}

export type OppTranslationsResult = Record<TargetLocale, OppFields>;

const LANG_NAME: Record<TargetLocale, string> = {
  en: "English",
  zh: "Simplified Chinese (简体中文)",
  tr: "Turkish (Türkçe)",
};

export class MissingApiKeyError extends Error {
  constructor() {
    super("OPENAI_API_KEY (أو ANTHROPIC_API_KEY) غير مضبوط.");
    this.name = "MissingApiKeyError";
  }
}

const SYSTEM = `You are a professional investment-content translator for the "Baraka Partners" platform. You translate Arabic investment-opportunity copy into other languages faithfully, fluently and in a professional financial register.

Rules:
- Translate ONLY the provided field values. Do not add, omit, summarize or invent content.
- Keep all numbers, currencies, percentages and units exactly as in the source.
- Preserve line breaks: the "highlights" field is a bullet list with one item per line — keep the same number of lines.
- Use natural, idiomatic phrasing in each target language (not literal word-for-word).
- For city/country/sector return the standard localized name.
- Return STRICT JSON only, matching the schema requested in the user message. No markdown, no comments, no extra keys.`;

function buildUserPrompt(fields: OppFields): string {
  const src = JSON.stringify(fields, null, 2);
  const langs = TARGET_LOCALES.map((l) => `"${l}" (${LANG_NAME[l]})`).join(", ");
  const sampleKeys = Object.keys(fields)
    .map((k) => `"${k}": "..."`)
    .join(", ");
  return `Translate the following Arabic investment-opportunity fields into ${langs}.

Source (Arabic) fields:
${src}

Return a JSON object with exactly these top-level keys: ${TARGET_LOCALES.map((l) => `"${l}"`).join(", ")}.
Each value is an object containing the SAME field keys as the source ({ ${sampleKeys} }), translated into that language.
Only include keys that exist in the source. Preserve line breaks inside "highlights".`;
}

// نقطة الدخول الوحيدة — تختار المزوّد المتاح.
export async function translateOpportunity(
  fields: OppFields
): Promise<OppTranslationsResult> {
  // أزل الحقول الفارغة قبل الإرسال
  const clean: OppFields = {};
  for (const [k, v] of Object.entries(fields)) {
    const s = String(v ?? "").trim();
    if (s) clean[k as keyof OppFields] = s;
  }
  if (Object.keys(clean).length === 0) {
    return emptyResult();
  }

  let raw: string;
  if (process.env.OPENAI_API_KEY) raw = await viaOpenAI(clean);
  else if (process.env.ANTHROPIC_API_KEY) raw = await viaAnthropic(clean);
  else throw new MissingApiKeyError();

  return normalize(parseJson(raw), clean);
}

// ===== OpenAI (Chat Completions + JSON mode) =====
async function viaOpenAI(fields: OppFields): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildUserPrompt(fields) },
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
async function viaAnthropic(fields: OppFields): Promise<string> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 8000,
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `${buildUserPrompt(fields)}\n\nRespond with the JSON object only.`,
      },
    ],
  });
  return msg.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join("\n")
    .trim();
}

// ===== مساعدات =====
function emptyResult(): OppTranslationsResult {
  return { en: {}, zh: {}, tr: {} };
}

// يستخرج JSON حتى لو غُلّف بأسوار ```json أو نص قبله/بعده.
function parseJson(raw: string): Record<string, unknown> {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  const slice = start !== -1 && end !== -1 ? candidate.slice(start, end + 1) : candidate;
  try {
    return JSON.parse(slice) as Record<string, unknown>;
  } catch {
    throw new Error("تعذّر تحليل ناتج الترجمة (JSON غير صالح).");
  }
}

// يحصر الناتج على اللغات والحقول المعروفة فقط، مع نصوص نظيفة.
function normalize(
  obj: Record<string, unknown>,
  source: OppFields
): OppTranslationsResult {
  const out = emptyResult();
  const allowed = Object.keys(source) as (keyof OppFields)[];
  for (const loc of TARGET_LOCALES) {
    const node = obj[loc];
    if (node && typeof node === "object") {
      const rec = node as Record<string, unknown>;
      for (const k of allowed) {
        const v = rec[k];
        if (typeof v === "string" && v.trim()) out[loc][k] = v.trim();
      }
    }
  }
  return out;
}
