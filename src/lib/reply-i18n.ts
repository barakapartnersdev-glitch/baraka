// ملصقات واجهة الردود الجاهزة (client-safe) — لاختيار قالب ونسخه/فتحه في البريد.
import type { Locale } from "@/lib/i18n";

type Quad = { ar: string; en: string; tr: string; zh: string };

const M: Record<string, Quad> = {
  "replyTitle": { ar: "ردّ جاهز", en: "Quick reply", tr: "Hazır yanıt", zh: "快捷回复" },
  "replyHint": {
    ar: "اختر قالباً بلغة العميل، عدّله إن لزم، ثم انسخه أو افتحه في بريدك.",
    en: "Pick a template in the client's language, edit if needed, then copy or open in your email.",
    tr: "Müşterinin dilinde bir şablon seçin, gerekirse düzenleyin, sonra kopyalayın veya e-postanızda açın.",
    zh: "选择客户语言的模板，按需编辑，然后复制或在邮箱中打开。",
  },
  "chooseTemplate": { ar: "— اختر قالباً —", en: "— Choose a template —", tr: "— Şablon seçin —", zh: "— 选择模板 —" },
  "subject": { ar: "الموضوع", en: "Subject", tr: "Konu", zh: "主题" },
  "body": { ar: "النص", en: "Body", tr: "İçerik", zh: "正文" },
  "copy": { ar: "نسخ الرد", en: "Copy reply", tr: "Yanıtı kopyala", zh: "复制回复" },
  "copied": { ar: "تم النسخ ✓", en: "Copied ✓", tr: "Kopyalandı ✓", zh: "已复制 ✓" },
  "openEmail": { ar: "فتح في البريد", en: "Open in email", tr: "E-postada aç", zh: "在邮箱中打开" },
  "noTemplates": { ar: "لا قوالب متاحة.", en: "No templates available.", tr: "Şablon yok.", zh: "暂无模板。" },
};

export function tr(locale: Locale, key: string): string {
  const e = M[key];
  return e ? (e[locale] ?? e.ar) : key;
}
