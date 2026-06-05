// توليد تقرير تقييم الفرصة بالذكاء الاصطناعي.
// المزوّد الافتراضي: OpenAI (OPENAI_API_KEY). احتياطياً: Anthropic (ANTHROPIC_API_KEY).
// نسختان: تقرير إداري كامل، ونسخة عرض للمستثمر بلا معلومات حساسة.
import "server-only";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

// تعليمات النظام — ثابتة بين الطلبين.
const SYSTEM = `أنت محلّل استثماري خبير في منصة «شركاء البركة» التي يديرها فريق عهد البركة. مهمّتك إعداد تقرير تقييم احترافي لفرصة استثمارية اعتماداً على البيانات التي قدّمها صاحب الفرصة عبر نموذج التسجيل.

اكتب بالعربية الفصحى، بصيغة Markdown منظّمة بعناوين واضحة. كن دقيقاً وواقعياً، واعتمد فقط على المعطيات الواردة؛ وعند نقص معلومة اذكر ذلك صراحةً ولا تختلق أرقاماً أو حقائق.

تتلقّى في رسالة المستخدم: (1) نوع النسخة المطلوبة، (2) بيانات الفرصة.

إذا كانت النسخة «تقرير إداري كامل» فأنتج تقريراً داخلياً شاملاً بالأقسام:
1. ملخّص تنفيذي
2. وصف الفرصة وطبيعتها
3. نقاط القوة
4. المخاطر والملاحظات والإشارات التحذيرية
5. اكتمال البيانات والنواقص المطلوب استكمالها قبل العرض
6. قراءة مالية مبدئية وتقدير المعقولية (دون اختلاق أرقام)
7. التوصية (متابعة / طلب نواقص / تعليق) مع المبرّرات

إذا كانت النسخة «نسخة للمستثمر» فأنتج عرضاً تعريفياً موضوعياً وجذّاباً موجّهاً لمستثمر مهتم، **دون أي معلومات حساسة** (لا هوية المالك، لا الموقع الدقيق، لا أرقام مالية داخلية غير مخصّصة للعرض). ركّز على: القطاع والفكرة، أبرز نقاط الجاذبية، نوع الاستثمار المطلوب ونطاقه العام، والخطوات التالية للمستثمر المهتم. تجنّب النقد الداخلي والتقييم السلبي الصريح.

ابدأ مباشرةً بعنوان التقرير دون أي ديباجة قبله أو تعليقات بعده.`;

export type EvalMode = "full" | "investor";

export class MissingApiKeyError extends Error {
  constructor() {
    super("OPENAI_API_KEY (أو ANTHROPIC_API_KEY) غير مضبوط.");
    this.name = "MissingApiKeyError";
  }
}

function userContent(markdown: string, mode: EvalMode): string {
  const versionLabel =
    mode === "full" ? "تقرير إداري كامل" : "نسخة للمستثمر بلا معلومات حساسة";
  return `النسخة المطلوبة: ${versionLabel}\n\nبيانات الفرصة:\n\n${markdown}`;
}

export async function generateEvaluation(
  markdown: string,
  mode: EvalMode
): Promise<{ text: string; model: string }> {
  const content = userContent(markdown, mode);
  if (process.env.OPENAI_API_KEY) return viaOpenAI(content);
  if (process.env.ANTHROPIC_API_KEY) return viaAnthropic(content);
  throw new MissingApiKeyError();
}

// ===== OpenAI (Chat Completions) =====
async function viaOpenAI(content: string): Promise<{ text: string; model: string }> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.4,
      max_tokens: 4000,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content },
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
  const text = data.choices?.[0]?.message?.content?.trim() || "تعذّر توليد التقرير.";
  return { text, model: OPENAI_MODEL };
}

// ===== Anthropic (احتياطي) =====
async function viaAnthropic(content: string): Promise<{ text: string; model: string }> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content }],
  });
  const text = msg.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join("\n")
    .trim();
  return { text: text || "تعذّر توليد التقرير.", model: ANTHROPIC_MODEL };
}
