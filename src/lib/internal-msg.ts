// المراسلة الداخلية الموحّدة — وحدة نقية (ثوابت + i18n) قابلة للاستيراد في الواجهة والخادم.
// تخدم مركز المراسلة في الإدارة وصناديق الوارد في البوّابات الأربع.
import type { Locale } from "@/lib/i18n";

// ===== الفئات المستلِمة (الأدوار الأربعة) =====
export type RecipientRole = "AMBASSADOR" | "ASSET_OWNER_AGENT" | "PROJECT_OWNER" | "INVESTOR";
export const RECIPIENT_ROLES: RecipientRole[] = ["AMBASSADOR", "ASSET_OWNER_AGENT", "PROJECT_OWNER", "INVESTOR"];

export function isRecipientRole(v: string): v is RecipientRole {
  return (RECIPIENT_ROLES as string[]).includes(v);
}

// مسار صندوق الوارد في بوّابة المستلم (للروابط والإشعارات)
export function inboxBasePath(role: string): string {
  switch (role) {
    case "AMBASSADOR": return "/ambassador/inbox";
    case "ASSET_OWNER_AGENT": return "/agent/inbox";
    case "PROJECT_OWNER": return "/owner/inbox";
    case "INVESTOR": return "/investor/inbox";
    default: return "/login";
  }
}

// ===== الفئات والحالات =====
export const THREAD_CATEGORIES = ["general", "documents", "contract", "meeting", "notice", "financial", "other"] as const;
export type ThreadCategory = (typeof THREAD_CATEGORIES)[number];

export const THREAD_STATUSES = ["OPEN", "REPLIED", "CLOSED"] as const;
export type ThreadStatus = (typeof THREAD_STATUSES)[number];

// ألوان شارات الحالة (أسماء الألوان في TONE_CLASSES)
export const STATUS_TONE: Record<string, string> = {
  OPEN: "blue",
  REPLIED: "amber",
  CLOSED: "gray",
};

export function normalizeCategory(v: string): ThreadCategory {
  return (THREAD_CATEGORIES as readonly string[]).includes(v) ? (v as ThreadCategory) : "general";
}

// ===== i18n (4 لغات لكل مفتاح) =====
type Quad = { ar: string; en: string; tr: string; zh: string };

const M: Record<string, Quad> = {
  // ----- التنقّل والعناوين (الإدارة) -----
  "admin.title": { ar: "المراسلات الداخلية", en: "Internal Messaging", tr: "Dahili Mesajlaşma", zh: "内部消息" },
  "admin.subtitle": {
    ar: "راسل السفراء والوكلاء وأصحاب الأصول والمستثمرين من داخل اللوحة — تُحفظ كل المراسلات هنا.",
    en: "Message ambassadors, agents, asset owners and investors from the panel — all correspondence is stored here.",
    tr: "Elçilere, temsilcilere, varlık sahiplerine ve yatırımcılara panelden mesaj gönderin — tüm yazışmalar burada saklanır.",
    zh: "从面板向大使、代理、资产所有者和投资者发送消息——所有往来都保存在此处。",
  },
  "admin.new": { ar: "رسالة جديدة", en: "New message", tr: "Yeni mesaj", zh: "新建消息" },
  "admin.templates": { ar: "قوالب المراسلة", en: "Message templates", tr: "Mesaj şablonları", zh: "消息模板" },
  "admin.empty": { ar: "لا توجد مراسلات بعد.", en: "No correspondence yet.", tr: "Henüz yazışma yok.", zh: "暂无往来消息。" },
  "admin.search": { ar: "بحث في الموضوع أو الاسم…", en: "Search subject or name…", tr: "Konu veya ad ara…", zh: "搜索主题或姓名…" },
  "admin.filterAllTypes": { ar: "كل الفئات", en: "All groups", tr: "Tüm gruplar", zh: "所有群组" },
  "admin.filterAllStatuses": { ar: "كل الحالات", en: "All statuses", tr: "Tüm durumlar", zh: "所有状态" },
  "admin.colRecipient": { ar: "المستلم", en: "Recipient", tr: "Alıcı", zh: "收件人" },
  "admin.colSubject": { ar: "الموضوع", en: "Subject", tr: "Konu", zh: "主题" },
  "admin.unreadBadge": { ar: "جديد", en: "new", tr: "yeni", zh: "新" },

  // ----- الإنشاء -----
  "compose.title": { ar: "رسالة جديدة", en: "New message", tr: "Yeni mesaj", zh: "新建消息" },
  "compose.recipientType": { ar: "فئة المستلم", en: "Recipient group", tr: "Alıcı grubu", zh: "收件人群组" },
  "compose.recipient": { ar: "المستلم", en: "Recipient", tr: "Alıcı", zh: "收件人" },
  "compose.recipientPlaceholder": { ar: "اختر المستلم…", en: "Select recipient…", tr: "Alıcı seçin…", zh: "选择收件人…" },
  "compose.noRecipients": { ar: "لا يوجد مستخدمون في هذه الفئة بعد.", en: "No users in this group yet.", tr: "Bu grupta henüz kullanıcı yok.", zh: "该群组暂无用户。" },
  "compose.category": { ar: "التصنيف", en: "Category", tr: "Kategori", zh: "类别" },
  "compose.language": { ar: "لغة المراسلة", en: "Message language", tr: "Mesaj dili", zh: "消息语言" },
  "compose.template": { ar: "قالب جاهز", en: "Template", tr: "Şablon", zh: "模板" },
  "compose.templateNone": { ar: "— بدون قالب —", en: "— No template —", tr: "— Şablon yok —", zh: "— 无模板 —" },
  "compose.subject": { ar: "الموضوع", en: "Subject", tr: "Konu", zh: "主题" },
  "compose.body": { ar: "نص الرسالة", en: "Message body", tr: "Mesaj metni", zh: "消息正文" },
  "compose.emailCopy": { ar: "إرسال نسخة إلى بريد المستلم الإلكتروني", en: "Also send a copy to the recipient's email", tr: "Alıcının e-postasına da bir kopya gönder", zh: "同时发送副本至收件人邮箱" },
  "compose.emailCopyHint": {
    ar: "تُحفظ الرسالة داخل المنصّة دائماً؛ هذا الخيار يرسل نسخة كاملة إلى بريده أيضاً.",
    en: "The message is always saved in the platform; this option also emails a full copy.",
    tr: "Mesaj her zaman platformda saklanır; bu seçenek ayrıca tam bir kopyayı e-postayla gönderir.",
    zh: "消息始终保存在平台中；此选项还会通过电子邮件发送完整副本。",
  },
  "compose.send": { ar: "إرسال", en: "Send", tr: "Gönder", zh: "发送" },
  "compose.errRequired": { ar: "اختر المستلم وأكمل الموضوع والنص.", en: "Select a recipient and fill in subject and body.", tr: "Bir alıcı seçin ve konu ile metni doldurun.", zh: "请选择收件人并填写主题和正文。" },

  // ----- المحادثة (الإدارة) -----
  "thread.reply": { ar: "رد", en: "Reply", tr: "Yanıtla", zh: "回复" },
  "thread.replyPlaceholder": { ar: "اكتب ردّك…", en: "Write your reply…", tr: "Yanıtınızı yazın…", zh: "输入您的回复…" },
  "thread.errBody": { ar: "اكتب نص الرد.", en: "Write a reply.", tr: "Bir yanıt yazın.", zh: "请输入回复内容。" },
  "thread.close": { ar: "إغلاق المحادثة", en: "Close thread", tr: "Konuşmayı kapat", zh: "关闭会话" },
  "thread.reopen": { ar: "إعادة فتح", en: "Reopen", tr: "Yeniden aç", zh: "重新打开" },
  "thread.fromAdmin": { ar: "الإدارة", en: "Management", tr: "Yönetim", zh: "管理层" },
  "thread.fromRecipient": { ar: "المستلم", en: "Recipient", tr: "Alıcı", zh: "收件人" },
  "thread.emailSent": { ar: "أُرسلت نسخة بالبريد", en: "Emailed a copy", tr: "Kopya e-postalandı", zh: "已邮寄副本" },

  // ----- البوّابة (المستلم) -----
  "portal.navInbox": { ar: "الوارد من الإدارة", en: "Inbox", tr: "Gelen Kutusu", zh: "收件箱" },
  "portal.title": { ar: "صندوق الوارد من الإدارة", en: "Messages from Management", tr: "Yönetimden Mesajlar", zh: "来自管理层的消息" },
  "portal.subtitle": { ar: "مراسلات إدارة عهد البركة معك.", en: "Correspondence from Ahd Al-Baraka management.", tr: "Ahd Al-Baraka yönetiminden yazışmalar.", zh: "来自 Ahd Al-Baraka 管理层的往来消息。" },
  "portal.empty": { ar: "لا توجد رسائل بعد.", en: "No messages yet.", tr: "Henüz mesaj yok.", zh: "暂无消息。" },
  "portal.reply": { ar: "رد", en: "Reply", tr: "Yanıtla", zh: "回复" },
  "portal.replyPlaceholder": { ar: "اكتب ردّك…", en: "Write your reply…", tr: "Yanıtınızı yazın…", zh: "输入您的回复…" },
  "portal.you": { ar: "أنت", en: "You", tr: "Siz", zh: "您" },
  "portal.admin": { ar: "الإدارة", en: "Management", tr: "Yönetim", zh: "管理层" },
  "portal.closedNotice": { ar: "هذه المحادثة مغلقة.", en: "This thread is closed.", tr: "Bu konuşma kapalı.", zh: "此会话已关闭。" },
  "portal.back": { ar: "رجوع", en: "Back", tr: "Geri", zh: "返回" },

  // ----- القوالب (المحرّر) -----
  "tpl.title": { ar: "قوالب المراسلة الداخلية", en: "Internal message templates", tr: "Dahili mesaj şablonları", zh: "内部消息模板" },
  "tpl.subtitle": { ar: "قوالب جاهزة بأربع لغات لتسريع المراسلة. تعديلات الإدارة تتجاوز القوالب المدمجة.", en: "Ready templates in four languages. Admin edits override the built-in ones.", tr: "Dört dilde hazır şablonlar. Yönetici düzenlemeleri yerleşik olanları geçersiz kılar.", zh: "四种语言的现成模板。管理员的编辑会覆盖内置模板。" },
  "tpl.varsHint": { ar: "المتغيّرات المتاحة: {{fullName}}", en: "Available variables: {{fullName}}", tr: "Kullanılabilir değişkenler: {{fullName}}", zh: "可用变量：{{fullName}}" },
  "tpl.subject": { ar: "الموضوع", en: "Subject", tr: "Konu", zh: "主题" },
  "tpl.save": { ar: "حفظ", en: "Save", tr: "Kaydet", zh: "保存" },
  "tpl.saved": { ar: "تم الحفظ", en: "Saved", tr: "Kaydedildi", zh: "已保存" },
  "tpl.sourceDb": { ar: "محرّر", en: "edited", tr: "düzenlenmiş", zh: "已编辑" },
  "tpl.sourceBuiltin": { ar: "مدمج", en: "built-in", tr: "yerleşik", zh: "内置" },

  // ----- أسماء القوالب المدمجة -----
  "tpl.name.welcome": { ar: "رسالة ترحيب", en: "Welcome", tr: "Hoş geldiniz", zh: "欢迎" },
  "tpl.name.document_request": { ar: "طلب مستندات", en: "Document request", tr: "Belge talebi", zh: "文件请求" },
  "tpl.name.contract_followup": { ar: "متابعة عقد", en: "Contract follow-up", tr: "Sözleşme takibi", zh: "合同跟进" },
  "tpl.name.meeting_invite": { ar: "دعوة اجتماع", en: "Meeting invitation", tr: "Toplantı daveti", zh: "会议邀请" },
  "tpl.name.general_notice": { ar: "إشعار عام", en: "General notice", tr: "Genel bildirim", zh: "通用通知" },

  // ----- مشترك -----
  "common.actionFailed": { ar: "تعذّر تنفيذ الإجراء.", en: "Action failed.", tr: "İşlem başarısız.", zh: "操作失败。" },
  "common.back": { ar: "رجوع", en: "Back", tr: "Geri", zh: "返回" },

  // ----- تسميات الفئات -----
  "cat.general": { ar: "عام", en: "General", tr: "Genel", zh: "通用" },
  "cat.documents": { ar: "مستندات", en: "Documents", tr: "Belgeler", zh: "文件" },
  "cat.contract": { ar: "عقد", en: "Contract", tr: "Sözleşme", zh: "合同" },
  "cat.meeting": { ar: "اجتماع", en: "Meeting", tr: "Toplantı", zh: "会议" },
  "cat.notice": { ar: "إشعار", en: "Notice", tr: "Bildirim", zh: "通知" },
  "cat.financial": { ar: "مالي", en: "Financial", tr: "Finansal", zh: "财务" },
  "cat.other": { ar: "أخرى", en: "Other", tr: "Diğer", zh: "其他" },

  // ----- تسميات الحالات -----
  "status.OPEN": { ar: "مفتوحة", en: "Open", tr: "Açık", zh: "进行中" },
  "status.REPLIED": { ar: "ردّ المستلم", en: "Replied", tr: "Yanıtlandı", zh: "已回复" },
  "status.CLOSED": { ar: "مغلقة", en: "Closed", tr: "Kapalı", zh: "已关闭" },

  // ----- تسميات الأدوار -----
  "role.AMBASSADOR": { ar: "سفير استثمار", en: "Investment Ambassador", tr: "Yatırım Elçisi", zh: "投资大使" },
  "role.ASSET_OWNER_AGENT": { ar: "وكيل صاحب أصل", en: "Asset Owner Agent", tr: "Varlık Sahibi Temsilcisi", zh: "资产所有者代理" },
  "role.PROJECT_OWNER": { ar: "صاحب أصل / مشروع", en: "Asset / Project Owner", tr: "Varlık / Proje Sahibi", zh: "资产/项目所有者" },
  "role.INVESTOR": { ar: "مستثمر", en: "Investor", tr: "Yatırımcı", zh: "投资者" },
  // الجمع (لمنتقي الفئة)
  "rolePlural.AMBASSADOR": { ar: "سفراء الاستثمار", en: "Investment Ambassadors", tr: "Yatırım Elçileri", zh: "投资大使" },
  "rolePlural.ASSET_OWNER_AGENT": { ar: "وكلاء أصحاب الأصول", en: "Asset Owner Agents", tr: "Varlık Sahibi Temsilcileri", zh: "资产所有者代理" },
  "rolePlural.PROJECT_OWNER": { ar: "أصحاب الأصول", en: "Asset Owners", tr: "Varlık Sahipleri", zh: "资产所有者" },
  "rolePlural.INVESTOR": { ar: "المستثمرون", en: "Investors", tr: "Yatırımcılar", zh: "投资者" },
};

export function tm(locale: Locale, key: string): string {
  const row = M[key];
  if (!row) return key;
  return row[locale] ?? row.ar;
}
