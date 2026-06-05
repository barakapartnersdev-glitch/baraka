// توليد تقرير تقييم الفرصة بالذكاء الاصطناعي (Anthropic Claude API).
// نسختان: تقرير إداري كامل، ونسخة عرض للمستثمر بلا معلومات حساسة.
import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// النموذج الافتراضي الأحدث والأقوى (قابل للتجاوز عبر متغيّر بيئة).
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

// تعليمات النظام — ثابتة بين الطلبين ليستفيد من التخزين المؤقت (prompt caching).
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
    super("ANTHROPIC_API_KEY غير مضبوط.");
    this.name = "MissingApiKeyError";
  }
}

export async function generateEvaluation(
  markdown: string,
  mode: EvalMode
): Promise<{ text: string; model: string }> {
  if (!process.env.ANTHROPIC_API_KEY) throw new MissingApiKeyError();

  const client = new Anthropic(); // يقرأ ANTHROPIC_API_KEY من البيئة
  const versionLabel =
    mode === "full" ? "تقرير إداري كامل" : "نسخة للمستثمر بلا معلومات حساسة";

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: [
      // التخزين المؤقت: التعليمات ثابتة فيُعاد استخدامها بين النسختين
      { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
    ],
    messages: [
      {
        role: "user",
        content: `النسخة المطلوبة: ${versionLabel}\n\nبيانات الفرصة:\n\n${markdown}`,
      },
    ],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return { text: text || "تعذّر توليد التقرير.", model: MODEL };
}
