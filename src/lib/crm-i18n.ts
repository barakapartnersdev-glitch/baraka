// تعدّد لغات نظام الـ CRM (إدارة العلاقات) — وحدة مستقلة عن قاموس الموقع العام.
// البنية تضع اللغات الأربع معاً لكل مفتاح حتى يستحيل أن تنقص ترجمة لغة.
// تُستورد في الواجهة والخادم. الاستخدام: tc(locale, "interest.cta").
import type { Locale } from "@/lib/i18n";

type Quad = { ar: string; en: string; tr: string; zh: string };

const M: Record<string, Quad> = {
  // ===== نموذج طلب الاهتمام بفرصة (عام) =====
  "interest.cta": {
    ar: "أنا مهتم بهذه الفرصة",
    en: "I'm Interested in This Opportunity",
    tr: "Bu Fırsatla İlgileniyorum",
    zh: "我对这个机会感兴趣",
  },
  "interest.formTitle": {
    ar: "طلب معلومات عن هذه الفرصة",
    en: "Request information about this opportunity",
    tr: "Bu fırsat hakkında bilgi isteyin",
    zh: "索取此机会的相关信息",
  },
  "interest.formSub": {
    ar: "أدخل بياناتك وسيتواصل معك فريق شركاء البركة لمتابعة اهتمامك بهذه الفرصة.",
    en: "Enter your details and the Baraka Partners team will contact you to follow up on your interest.",
    tr: "Bilgilerinizi girin; Baraka Partners ekibi ilginizi takip etmek için sizinle iletişime geçecektir.",
    zh: "请填写您的信息，Baraka Partners 团队将联系您跟进您的意向。",
  },

  // ===== حقول النماذج =====
  "field.fullName": { ar: "الاسم الكامل", en: "Full name", tr: "Ad soyad", zh: "全名" },
  "field.email": { ar: "البريد الإلكتروني", en: "Email", tr: "E-posta", zh: "电子邮箱" },
  "field.phone": { ar: "رقم الهاتف", en: "Phone number", tr: "Telefon numarası", zh: "电话号码" },
  "field.whatsapp": { ar: "واتساب", en: "WhatsApp", tr: "WhatsApp", zh: "WhatsApp" },
  "field.country": { ar: "الدولة", en: "Country", tr: "Ülke", zh: "国家" },
  "field.city": { ar: "المدينة", en: "City", tr: "Şehir", zh: "城市" },
  "field.company": { ar: "اسم الشركة", en: "Company name", tr: "Şirket adı", zh: "公司名称" },
  "field.senderRole": { ar: "صفة المرسل", en: "You are", tr: "Sıfatınız", zh: "您的身份" },
  "field.budget": {
    ar: "حجم الاستثمار المتوقع",
    en: "Expected investment size",
    tr: "Beklenen yatırım büyüklüğü",
    zh: "预期投资规模",
  },
  "field.prefContact": {
    ar: "طريقة التواصل المفضلة",
    en: "Preferred contact method",
    tr: "Tercih edilen iletişim yöntemi",
    zh: "首选联系方式",
  },
  "field.message": { ar: "رسالة أو ملاحظات", en: "Message or notes", tr: "Mesaj veya notlar", zh: "留言或备注" },
  "field.optional": { ar: "(اختياري)", en: "(optional)", tr: "(isteğe bağlı)", zh: "（可选）" },
  "opt.choose": { ar: "— اختر —", en: "— Select —", tr: "— Seçin —", zh: "— 请选择 —" },

  // ===== صفة المرسل (قيم موحّدة) =====
  "senderRole.investor": { ar: "مستثمر", en: "Investor", tr: "Yatırımcı", zh: "投资者" },
  "senderRole.investment_company": {
    ar: "شركة استثمار",
    en: "Investment company",
    tr: "Yatırım şirketi",
    zh: "投资公司",
  },
  "senderRole.broker": { ar: "وسيط", en: "Broker", tr: "Aracı", zh: "中介" },
  "senderRole.consultant": { ar: "مستشار", en: "Consultant", tr: "Danışman", zh: "顾问" },
  "senderRole.government": { ar: "جهة حكومية", en: "Government entity", tr: "Kamu kurumu", zh: "政府机构" },
  "senderRole.project_owner": { ar: "مالك المشروع", en: "Project owner", tr: "Proje sahibi", zh: "项目所有者" },
  "senderRole.partner": { ar: "شريك", en: "Partner", tr: "Ortak", zh: "合伙人" },
  "senderRole.legal_rep": { ar: "ممثل قانوني", en: "Legal representative", tr: "Yasal temsilci", zh: "法律代表" },
  "senderRole.other": { ar: "أخرى", en: "Other", tr: "Diğer", zh: "其他" },

  // ===== طريقة التواصل المفضلة =====
  "prefContact.whatsapp": { ar: "واتساب", en: "WhatsApp", tr: "WhatsApp", zh: "WhatsApp" },
  "prefContact.email": { ar: "بريد إلكتروني", en: "Email", tr: "E-posta", zh: "电子邮箱" },
  "prefContact.phone": { ar: "اتصال مباشر", en: "Phone call", tr: "Telefon görüşmesi", zh: "电话" },
  "prefContact.online_meeting": {
    ar: "اجتماع أونلاين",
    en: "Online meeting",
    tr: "Çevrimiçi toplantı",
    zh: "线上会议",
  },

  // ===== الموافقة والإرسال والرسائل =====
  "privacy.consent": {
    ar: "أوافق على سياسة الخصوصية ومعالجة بياناتي لغرض التواصل معي بخصوص هذا الطلب.",
    en: "I agree to the privacy policy and the processing of my data to be contacted about this request.",
    tr: "Gizlilik politikasını ve bu talep hakkında benimle iletişime geçilmesi için verilerimin işlenmesini kabul ediyorum.",
    zh: "我同意隐私政策，并同意处理我的数据以便就此请求与我联系。",
  },
  "submit": { ar: "إرسال الطلب", en: "Send request", tr: "Talebi gönder", zh: "发送请求" },
  "submitting": { ar: "جارٍ الإرسال...", en: "Sending...", tr: "Gönderiliyor...", zh: "正在发送…" },
  "success.title": {
    ar: "تم استلام طلبكم بنجاح",
    en: "Your request was received",
    tr: "Talebiniz alındı",
    zh: "已收到您的请求",
  },
  "success.body": {
    ar: "شكراً لتواصلكم مع شركاء البركة. سيقوم فريقنا بمراجعة طلبكم والتواصل معكم في أقرب وقت ممكن.",
    en: "Thank you for contacting Baraka Partners. Our team will review your request and get back to you as soon as possible.",
    tr: "Baraka Partners ile iletişime geçtiğiniz için teşekkür ederiz. Ekibimiz talebinizi inceleyip en kısa sürede size dönecektir.",
    zh: "感谢您联系 Baraka Partners。我们的团队将审核您的请求并尽快与您联系。",
  },
  "err.name": {
    ar: "يرجى إدخال الاسم الكامل (3 أحرف على الأقل).",
    en: "Please enter your full name (at least 3 characters).",
    tr: "Lütfen tam adınızı girin (en az 3 karakter).",
    zh: "请输入您的全名（至少 3 个字符）。",
  },
  "err.email": {
    ar: "يرجى إدخال بريد إلكتروني صحيح.",
    en: "Please enter a valid email address.",
    tr: "Lütfen geçerli bir e-posta adresi girin.",
    zh: "请输入有效的电子邮箱地址。",
  },
  "err.contact": {
    ar: "يرجى إدخال رقم هاتف أو واتساب للتواصل.",
    en: "Please enter a phone or WhatsApp number.",
    tr: "Lütfen bir telefon veya WhatsApp numarası girin.",
    zh: "请输入电话或 WhatsApp 号码。",
  },
  "err.required": {
    ar: "يرجى تعبئة جميع الحقول الإلزامية.",
    en: "Please complete all required fields.",
    tr: "Lütfen tüm zorunlu alanları doldurun.",
    zh: "请填写所有必填字段。",
  },
  "err.privacy": {
    ar: "يجب الموافقة على سياسة الخصوصية للمتابعة.",
    en: "You must accept the privacy policy to continue.",
    tr: "Devam etmek için gizlilik politikasını kabul etmelisiniz.",
    zh: "您必须同意隐私政策才能继续。",
  },
  "err.generic": {
    ar: "تعذّر إرسال الطلب. حاول مرة أخرى.",
    en: "Could not send the request. Please try again.",
    tr: "Talep gönderilemedi. Lütfen tekrar deneyin.",
    zh: "无法发送请求，请重试。",
  },
  "err.rate": {
    ar: "لقد أرسلت طلباً للتو. انتظر قليلاً قبل إرسال طلب آخر.",
    en: "You just sent a request. Please wait a moment before sending another.",
    tr: "Az önce bir talep gönderdiniz. Yenisini göndermeden önce biraz bekleyin.",
    zh: "您刚刚发送了一个请求，请稍候再发送。",
  },

  // ===== أنواع الطلبات =====
  "leadType.INVESTOR_INTEREST": {
    ar: "اهتمام بفرصة",
    en: "Opportunity interest",
    tr: "Fırsat ilgisi",
    zh: "机会意向",
  },
  "leadType.OPPORTUNITY_SUBMISSION": {
    ar: "تقديم فرصة",
    en: "Opportunity submission",
    tr: "Fırsat başvurusu",
    zh: "机会提交",
  },
  "leadType.CONTACT": { ar: "تواصل عام", en: "General contact", tr: "Genel iletişim", zh: "一般联系" },
  "leadType.HOME_QUICK": {
    ar: "نموذج سريع",
    en: "Quick form",
    tr: "Hızlı form",
    zh: "快速表单",
  },

  // ===== حالات الطلب =====
  "crmStatus.NEW": { ar: "جديد", en: "New", tr: "Yeni", zh: "新" },
  "crmStatus.UNDER_REVIEW": { ar: "قيد المراجعة", en: "Under review", tr: "İnceleniyor", zh: "审核中" },
  "crmStatus.CONTACTED": { ar: "تم التواصل الأولي", en: "Contacted", tr: "İletişim kuruldu", zh: "已联系" },
  "crmStatus.AWAITING_REPLY": {
    ar: "بانتظار رد المرسل",
    en: "Awaiting reply",
    tr: "Yanıt bekleniyor",
    zh: "等待回复",
  },
  "crmStatus.QUALIFIED": { ar: "مؤهل", en: "Qualified", tr: "Nitelikli", zh: "合格" },
  "crmStatus.NOT_QUALIFIED": { ar: "غير مؤهل", en: "Not qualified", tr: "Niteliksiz", zh: "不合格" },
  "crmStatus.NEEDS_INFO": {
    ar: "يحتاج معلومات إضافية",
    en: "Needs more info",
    tr: "Daha fazla bilgi gerekli",
    zh: "需补充信息",
  },
  "crmStatus.FILE_SENT": {
    ar: "تم إرسال ملف الفرصة",
    en: "Opportunity file sent",
    tr: "Fırsat dosyası gönderildi",
    zh: "已发送机会资料",
  },
  "crmStatus.NDA_SIGNED": {
    ar: "تم توقيع NDA/NCNDA",
    en: "NDA/NCNDA signed",
    tr: "NDA/NCNDA imzalandı",
    zh: "已签署 NDA/NCNDA",
  },
  "crmStatus.MEETING_SCHEDULED": {
    ar: "تم ترتيب اجتماع",
    en: "Meeting scheduled",
    tr: "Toplantı planlandı",
    zh: "已安排会议",
  },
  "crmStatus.NEGOTIATING": { ar: "قيد التفاوض", en: "Negotiating", tr: "Görüşülüyor", zh: "洽谈中" },
  "crmStatus.CLOSED_WON": { ar: "مغلق بنجاح", en: "Closed — won", tr: "Kapandı — kazanıldı", zh: "成交关闭" },
  "crmStatus.CLOSED_LOST": {
    ar: "مغلق بدون نتيجة",
    en: "Closed — lost",
    tr: "Kapandı — kaybedildi",
    zh: "未成交关闭",
  },
  // مسار أصحاب الفرص
  "crmStatus.AWAITING_DOCS": {
    ar: "بانتظار الوثائق",
    en: "Awaiting documents",
    tr: "Belgeler bekleniyor",
    zh: "等待文件",
  },
  "crmStatus.PRELIM_ACCEPTED": {
    ar: "مقبول مبدئياً",
    en: "Preliminarily accepted",
    tr: "Ön kabul edildi",
    zh: "初步接受",
  },
  "crmStatus.REJECTED": { ar: "مرفوض", en: "Rejected", tr: "Reddedildi", zh: "已拒绝" },
  "crmStatus.PREP_PROFILE": {
    ar: "قيد إعداد ملف استثماري",
    en: "Preparing profile",
    tr: "Profil hazırlanıyor",
    zh: "准备投资资料中",
  },
  "crmStatus.READY_TO_PUBLISH": {
    ar: "جاهز للنشر",
    en: "Ready to publish",
    tr: "Yayına hazır",
    zh: "可发布",
  },
  "crmStatus.PUBLISHED": { ar: "منشور", en: "Published", tr: "Yayınlandı", zh: "已发布" },
  "crmStatus.ARCHIVED": { ar: "مؤرشف", en: "Archived", tr: "Arşivlendi", zh: "已归档" },
  "crmStatus.SPAM": { ar: "مشتبه به (سبام)", en: "Potential spam", tr: "Olası spam", zh: "疑似垃圾信息" },

  // ===== درجة الأهمية =====
  "crmPriority.VERY_HIGH": { ar: "عالية جداً", en: "Very high", tr: "Çok yüksek", zh: "非常高" },
  "crmPriority.HIGH": { ar: "عالية", en: "High", tr: "Yüksek", zh: "高" },
  "crmPriority.MEDIUM": { ar: "متوسطة", en: "Medium", tr: "Orta", zh: "中" },
  "crmPriority.LOW": { ar: "منخفضة", en: "Low", tr: "Düşük", zh: "低" },

  // ===== اللغات =====
  "lang.ar": { ar: "العربية", en: "Arabic", tr: "Arapça", zh: "阿拉伯语" },
  "lang.en": { ar: "الإنجليزية", en: "English", tr: "İngilizce", zh: "英语" },
  "lang.tr": { ar: "التركية", en: "Turkish", tr: "Türkçe", zh: "土耳其语" },
  "lang.zh": { ar: "الصينية", en: "Chinese", tr: "Çince", zh: "中文" },

  // ===== الأقسام الداخلية =====
  "dept.investor_relations": {
    ar: "علاقات المستثمرين",
    en: "Investor relations",
    tr: "Yatırımcı ilişkileri",
    zh: "投资者关系",
  },
  "dept.opp_review": { ar: "مراجعة الفرص", en: "Opportunity review", tr: "Fırsat incelemesi", zh: "机会审核" },
  "dept.legal": { ar: "الإدارة القانونية", en: "Legal", tr: "Hukuk", zh: "法务" },
  "dept.finance": { ar: "الإدارة المالية", en: "Finance", tr: "Finans", zh: "财务" },
  "dept.content": { ar: "إعداد الملفات", en: "Content / profiling", tr: "Dosya hazırlama", zh: "资料编制" },
  "dept.management": { ar: "الإدارة العليا", en: "Senior management", tr: "Üst yönetim", zh: "高级管理层" },

  // ===== أنواع الملاحظات =====
  "noteType.internal_note": { ar: "ملاحظة داخلية", en: "Internal note", tr: "Dahili not", zh: "内部备注" },
  "noteType.call_log": { ar: "تسجيل اتصال", en: "Call log", tr: "Arama kaydı", zh: "通话记录" },
  "noteType.whatsapp_log": { ar: "تسجيل واتساب", en: "WhatsApp log", tr: "WhatsApp kaydı", zh: "WhatsApp 记录" },
  "noteType.email_log": { ar: "تسجيل بريد", en: "Email log", tr: "E-posta kaydı", zh: "邮件记录" },
  "noteType.meeting_log": { ar: "تسجيل اجتماع", en: "Meeting log", tr: "Toplantı kaydı", zh: "会议记录" },

  // ===== لوحة الإدارة: القائمة =====
  "nav.crm": { ar: "إدارة الاتصالات", en: "Communications CRM", tr: "İletişim CRM", zh: "沟通 CRM" },
  "admin.title": { ar: "إدارة العلاقات (CRM)", en: "Investor Relations CRM", tr: "Yatırımcı İlişkileri CRM", zh: "投资者关系 CRM" },
  "admin.sub": {
    ar: "كل طلب أو رسالة وردت من نماذج الموقع — للتصنيف والإسناد والمتابعة.",
    en: "Every request or message from the site forms — to classify, assign, and follow up.",
    tr: "Site formlarından gelen her talep veya mesaj — sınıflandırma, atama ve takip için.",
    zh: "来自网站表单的每条请求或消息——用于分类、分配和跟进。",
  },
  "admin.col.date": { ar: "التاريخ", en: "Date", tr: "Tarih", zh: "日期" },
  "admin.col.name": { ar: "الاسم", en: "Name", tr: "Ad", zh: "姓名" },
  "admin.col.type": { ar: "النوع", en: "Type", tr: "Tür", zh: "类型" },
  "admin.col.contact": { ar: "التواصل", en: "Contact", tr: "İletişim", zh: "联系方式" },
  "admin.col.country": { ar: "الدولة", en: "Country", tr: "Ülke", zh: "国家" },
  "admin.col.opp": { ar: "الفرصة", en: "Opportunity", tr: "Fırsat", zh: "机会" },
  "admin.col.status": { ar: "الحالة", en: "Status", tr: "Durum", zh: "状态" },
  "admin.col.priority": { ar: "الأهمية", en: "Priority", tr: "Öncelik", zh: "优先级" },
  "admin.col.assigned": { ar: "المسؤول", en: "Assignee", tr: "Sorumlu", zh: "负责人" },
  "admin.col.lang": { ar: "اللغة", en: "Lang", tr: "Dil", zh: "语言" },
  "admin.col.score": { ar: "التقييم", en: "Score", tr: "Puan", zh: "评分" },
  "admin.empty": {
    ar: "لا توجد طلبات مطابقة.",
    en: "No matching leads.",
    tr: "Eşleşen talep yok.",
    zh: "没有匹配的记录。",
  },
  "admin.unassigned": { ar: "غير مُسند", en: "Unassigned", tr: "Atanmamış", zh: "未分配" },
  "admin.searchPh": {
    ar: "بحث بالاسم أو البريد أو الهاتف أو الشركة...",
    en: "Search by name, email, phone, or company...",
    tr: "Ad, e-posta, telefon veya şirkete göre ara...",
    zh: "按姓名、邮箱、电话或公司搜索…",
  },
  "admin.search": { ar: "بحث", en: "Search", tr: "Ara", zh: "搜索" },
  "admin.filterType": { ar: "كل الأنواع", en: "All types", tr: "Tüm türler", zh: "所有类型" },
  "admin.filterStatus": { ar: "كل الحالات", en: "All statuses", tr: "Tüm durumlar", zh: "所有状态" },
  "admin.filterLang": { ar: "كل اللغات", en: "All languages", tr: "Tüm diller", zh: "所有语言" },
  "admin.unreadOnly": { ar: "غير المقروء فقط", en: "Unread only", tr: "Yalnızca okunmamış", zh: "仅未读" },
  "admin.apply": { ar: "تطبيق", en: "Apply", tr: "Uygula", zh: "应用" },
  "admin.clear": { ar: "مسح الفلاتر", en: "Clear filters", tr: "Filtreleri temizle", zh: "清除筛选" },
  "admin.newBadge": { ar: "جديد", en: "New", tr: "Yeni", zh: "新" },
  "admin.total": { ar: "إجمالي", en: "Total", tr: "Toplam", zh: "合计" },

  // ===== لوحة الإدارة: التفاصيل =====
  "detail.back": { ar: "→ كل الطلبات", en: "← All leads", tr: "← Tüm talepler", zh: "← 所有记录" },
  "detail.contactInfo": { ar: "معلومات التواصل", en: "Contact information", tr: "İletişim bilgileri", zh: "联系信息" },
  "detail.message": { ar: "الرسالة", en: "Message", tr: "Mesaj", zh: "留言" },
  "detail.noMessage": { ar: "لا توجد رسالة.", en: "No message.", tr: "Mesaj yok.", zh: "无留言。" },
  "detail.relatedOpp": { ar: "الفرصة المرتبطة", en: "Related opportunity", tr: "İlgili fırsat", zh: "相关机会" },
  "detail.viewOpp": { ar: "فتح الفرصة في لوحة الإدارة", en: "Open opportunity in admin", tr: "Fırsatı yönetimde aç", zh: "在管理后台打开机会" },
  "detail.meta": { ar: "بيانات تقنية", en: "Technical metadata", tr: "Teknik veriler", zh: "技术信息" },
  "detail.activity": { ar: "سجل النشاط", en: "Activity log", tr: "Etkinlik kaydı", zh: "活动日志" },
  "detail.notes": { ar: "الملاحظات والمتابعة", en: "Notes & follow-up", tr: "Notlar ve takip", zh: "备注与跟进" },
  "detail.source": { ar: "مصدر الطلب", en: "Source", tr: "Kaynak", zh: "来源" },
  "detail.createdAt": { ar: "تاريخ الإرسال", en: "Submitted at", tr: "Gönderim tarihi", zh: "提交时间" },
  "detail.score": { ar: "درجة الجدية", en: "Lead score", tr: "Potansiyel puanı", zh: "线索评分" },
  "detail.ip": { ar: "عنوان IP", en: "IP address", tr: "IP adresi", zh: "IP 地址" },
  "detail.ua": { ar: "متصفّح المستخدم", en: "User agent", tr: "Kullanıcı aracısı", zh: "用户代理" },
  "detail.openWhatsapp": { ar: "فتح محادثة واتساب", en: "Open WhatsApp chat", tr: "WhatsApp sohbeti aç", zh: "打开 WhatsApp 对话" },
  "detail.sendEmail": { ar: "إرسال بريد", en: "Send email", tr: "E-posta gönder", zh: "发送邮件" },
  "detail.status": { ar: "الحالة", en: "Status", tr: "Durum", zh: "状态" },
  "detail.priority": { ar: "درجة الأهمية", en: "Priority", tr: "Öncelik", zh: "优先级" },
  "detail.assignTo": { ar: "إسناد إلى", en: "Assign to", tr: "Şuna ata", zh: "分配给" },
  "detail.department": { ar: "القسم الداخلي", en: "Department", tr: "Departman", zh: "部门" },
  "detail.unassigned": { ar: "غير مُسند", en: "Unassigned", tr: "Atanmamış", zh: "未分配" },
  "detail.noDept": { ar: "بدون قسم", en: "No department", tr: "Departman yok", zh: "无部门" },
  "detail.markRead": { ar: "تعليم كمقروء", en: "Mark as read", tr: "Okundu işaretle", zh: "标记为已读" },
  "detail.markUnread": { ar: "تعليم كغير مقروء", en: "Mark as unread", tr: "Okunmadı işaretle", zh: "标记为未读" },
  "detail.markSpam": { ar: "تعليم كسبام", en: "Mark as spam", tr: "Spam işaretle", zh: "标记为垃圾" },
  "detail.unmarkSpam": { ar: "إلغاء تعليم السبام", en: "Unmark spam", tr: "Spam işaretini kaldır", zh: "取消垃圾标记" },
  "detail.addNote": { ar: "إضافة ملاحظة", en: "Add a note", tr: "Not ekle", zh: "添加备注" },
  "detail.notePh": {
    ar: "اكتب ملاحظة داخلية أو نتيجة اتصال...",
    en: "Write an internal note or call outcome...",
    tr: "Dahili bir not veya arama sonucu yazın...",
    zh: "写下内部备注或通话结果…",
  },
  "detail.noteType": { ar: "نوع الملاحظة", en: "Note type", tr: "Not türü", zh: "备注类型" },
  "detail.saveNote": { ar: "حفظ الملاحظة", en: "Save note", tr: "Notu kaydet", zh: "保存备注" },
  "detail.saving": { ar: "جارٍ الحفظ...", en: "Saving...", tr: "Kaydediliyor...", zh: "保存中…" },
  "detail.noNotes": { ar: "لا ملاحظات بعد.", en: "No notes yet.", tr: "Henüz not yok.", zh: "暂无备注。" },
  "detail.noActivity": { ar: "لا نشاط مسجّل بعد.", en: "No activity logged yet.", tr: "Henüz etkinlik yok.", zh: "暂无活动记录。" },
  "detail.spamBadge": { ar: "سبام محتمل", en: "Potential spam", tr: "Olası spam", zh: "疑似垃圾" },
  "detail.actionFailed": { ar: "تعذّر تنفيذ الإجراء.", en: "Could not complete the action.", tr: "İşlem tamamlanamadı.", zh: "操作无法完成。" },

  // ===== سجل النشاط: أنواع الإجراءات =====
  "act.created": { ar: "ورد الطلب", en: "Lead created", tr: "Talep oluşturuldu", zh: "记录已创建" },
  "act.status_change": { ar: "تغيير الحالة", en: "Status changed", tr: "Durum değişti", zh: "状态已更改" },
  "act.priority_change": { ar: "تغيير الأهمية", en: "Priority changed", tr: "Öncelik değişti", zh: "优先级已更改" },
  "act.assigned": { ar: "إسناد", en: "Assigned", tr: "Atandı", zh: "已分配" },
  "act.unassigned": { ar: "إلغاء الإسناد", en: "Unassigned", tr: "Atama kaldırıldı", zh: "已取消分配" },
  "act.note_added": { ar: "إضافة ملاحظة", en: "Note added", tr: "Not eklendi", zh: "已添加备注" },
  "act.read": { ar: "فتح/قراءة الطلب", en: "Marked read", tr: "Okundu işaretlendi", zh: "已标记已读" },
  "act.spam_on": { ar: "تعليم كسبام", en: "Marked spam", tr: "Spam işaretlendi", zh: "标记为垃圾" },
  "act.spam_off": { ar: "إلغاء السبام", en: "Spam removed", tr: "Spam kaldırıldı", zh: "取消垃圾标记" },
  "act.followup_scheduled": { ar: "جدولة متابعة", en: "Follow-up scheduled", tr: "Takip planlandı", zh: "已安排跟进" },
  "act.followup_done": { ar: "إنجاز متابعة", en: "Follow-up completed", tr: "Takip tamamlandı", zh: "跟进已完成" },

  // ===== بريد التأكيد للعميل =====
  "email.confirmSubject": {
    ar: "تم استلام طلبك — شركاء البركة",
    en: "We received your request — Baraka Partners",
    tr: "Talebinizi aldık — Baraka Partners",
    zh: "我们已收到您的请求 — Baraka Partners",
  },
  "email.confirmGreeting": { ar: "مرحباً", en: "Hello", tr: "Merhaba", zh: "您好" },
  "email.confirmBody": {
    ar: "شكراً لتواصلكم مع شركاء البركة. تم استلام طلبكم بنجاح، وسيقوم فريقنا بمراجعته والتواصل معكم في أقرب وقت ممكن.",
    en: "Thank you for contacting Baraka Partners. Your request has been received, and our team will review it and contact you as soon as possible.",
    tr: "Baraka Partners ile iletişime geçtiğiniz için teşekkür ederiz. Talebiniz alınmıştır; ekibimiz inceleyip en kısa sürede sizinle iletişime geçecektir.",
    zh: "感谢您联系 Baraka Partners。我们已收到您的请求，团队将进行审核并尽快与您联系。",
  },
  "email.confirmSignature": {
    ar: "فريق شركاء البركة",
    en: "The Baraka Partners team",
    tr: "Baraka Partners ekibi",
    zh: "Baraka Partners 团队",
  },

  // ===== التقارير والإحصاءات (§18) =====
  "reports.nav": { ar: "التقارير", en: "Reports", tr: "Raporlar", zh: "报告" },
  "reports.title": { ar: "تقارير وإحصاءات الـ CRM", en: "CRM reports & analytics", tr: "CRM raporları ve analizler", zh: "CRM 报告与分析" },
  "reports.sub": {
    ar: "نظرة شاملة على الطلبات الواردة وأدائها.",
    en: "An overview of incoming leads and their performance.",
    tr: "Gelen taleplere ve performanslarına genel bakış.",
    zh: "对来访线索及其表现的概览。",
  },
  "reports.backToList": { ar: "→ قائمة الطلبات", en: "← Leads list", tr: "← Talep listesi", zh: "← 线索列表" },
  "reports.total": { ar: "إجمالي الطلبات", en: "Total leads", tr: "Toplam talep", zh: "线索总数" },
  "reports.investors": { ar: "طلبات المستثمرين", en: "Investor leads", tr: "Yatırımcı talepleri", zh: "投资者线索" },
  "reports.owners": { ar: "طلبات أصحاب الفرص", en: "Opportunity owner leads", tr: "Fırsat sahibi talepleri", zh: "机会方线索" },
  "reports.new": { ar: "طلبات جديدة", en: "New leads", tr: "Yeni talepler", zh: "新线索" },
  "reports.qualified": { ar: "مؤهلة", en: "Qualified", tr: "Nitelikli", zh: "合格" },
  "reports.closedWon": { ar: "مغلقة بنجاح", en: "Closed won", tr: "Kazanılan", zh: "成交" },
  "reports.unassigned": { ar: "بلا مسؤول", en: "Unassigned", tr: "Atanmamış", zh: "未分配" },
  "reports.overdue": { ar: "متابعات متأخرة", en: "Overdue follow-ups", tr: "Geciken takipler", zh: "逾期跟进" },
  "reports.spam": { ar: "مشتبه بها (سبام)", en: "Potential spam", tr: "Olası spam", zh: "疑似垃圾" },
  "reports.byStatus": { ar: "حسب الحالة", en: "By status", tr: "Duruma göre", zh: "按状态" },
  "reports.byCountry": { ar: "أكثر الدول", en: "Top countries", tr: "En çok ülke", zh: "热门国家" },
  "reports.bySector": { ar: "أكثر القطاعات", en: "Top sectors", tr: "En çok sektör", zh: "热门行业" },
  "reports.byLang": { ar: "حسب اللغة", en: "By language", tr: "Dile göre", zh: "按语言" },
  "reports.byAssignee": { ar: "حسب الموظف", en: "By assignee", tr: "Sorumluya göre", zh: "按负责人" },
  "reports.topOpps": { ar: "أعلى الفرص جذباً", en: "Most-requested opportunities", tr: "En çok talep edilen fırsatlar", zh: "最受关注的机会" },
  "reports.count": { ar: "العدد", en: "Count", tr: "Adet", zh: "数量" },
  "reports.none": { ar: "لا بيانات.", en: "No data.", tr: "Veri yok.", zh: "暂无数据。" },

  // ===== المتابعات (§4.5 / §8) =====
  "followups.nav": { ar: "المتابعات", en: "Follow-ups", tr: "Takipler", zh: "跟进" },
  "followups.title": { ar: "المتابعات المجدولة", en: "Scheduled follow-ups", tr: "Planlanmış takipler", zh: "已安排的跟进" },
  "followups.sub": {
    ar: "كل المتابعات القادمة والمتأخّرة عبر الطلبات.",
    en: "All upcoming and overdue follow-ups across leads.",
    tr: "Tüm yaklaşan ve geciken takipler.",
    zh: "所有即将到期和逾期的跟进。",
  },
  "followups.empty": { ar: "لا متابعات مجدولة.", en: "No scheduled follow-ups.", tr: "Planlanmış takip yok.", zh: "暂无已安排的跟进。" },
  "followups.add": { ar: "جدولة متابعة", en: "Schedule a follow-up", tr: "Takip planla", zh: "安排跟进" },
  "followups.when": { ar: "الموعد", en: "When", tr: "Ne zaman", zh: "时间" },
  "followups.type": { ar: "النوع", en: "Type", tr: "Tür", zh: "类型" },
  "followups.notesPh": { ar: "ملاحظة المتابعة (اختياري)...", en: "Follow-up note (optional)...", tr: "Takip notu (isteğe bağlı)...", zh: "跟进备注（可选）…" },
  "followups.schedule": { ar: "جدولة", en: "Schedule", tr: "Planla", zh: "安排" },
  "followups.lead": { ar: "الطلب", en: "Lead", tr: "Talep", zh: "线索" },
  "followups.assignee": { ar: "المسؤول", en: "Assignee", tr: "Sorumlu", zh: "负责人" },
  "followups.status": { ar: "الحالة", en: "Status", tr: "Durum", zh: "状态" },
  "followups.overdue": { ar: "متأخّرة", en: "Overdue", tr: "Gecikmiş", zh: "逾期" },
  "followups.upcoming": { ar: "قادمة", en: "Upcoming", tr: "Yaklaşan", zh: "即将到期" },
  "followups.markDone": { ar: "تم", en: "Mark done", tr: "Tamamlandı", zh: "标记完成" },
  "followups.pending": { ar: "قيد الانتظار", en: "Pending", tr: "Beklemede", zh: "待处理" },
  "followups.done": { ar: "منجزة", en: "Done", tr: "Tamamlandı", zh: "已完成" },
  "followups.section": { ar: "المتابعات", en: "Follow-ups", tr: "Takipler", zh: "跟进" },
  "followups.noneOnLead": { ar: "لا متابعات على هذا الطلب.", en: "No follow-ups on this lead.", tr: "Bu talepte takip yok.", zh: "此线索暂无跟进。" },

  // أنواع المتابعة
  "followupType.call": { ar: "اتصال", en: "Call", tr: "Arama", zh: "通话" },
  "followupType.email": { ar: "بريد", en: "Email", tr: "E-posta", zh: "邮件" },
  "followupType.whatsapp": { ar: "واتساب", en: "WhatsApp", tr: "WhatsApp", zh: "WhatsApp" },
  "followupType.online_meeting": { ar: "اجتماع أونلاين", en: "Online meeting", tr: "Çevrimiçi toplantı", zh: "线上会议" },
  "followupType.document_request": { ar: "طلب وثائق", en: "Document request", tr: "Belge talebi", zh: "索取文件" },
  "followupType.internal_review": { ar: "مراجعة داخلية", en: "Internal review", tr: "Dahili inceleme", zh: "内部审查" },

  // ===== نموذج تقديم فرصة استثمارية (§2 ثانياً) =====
  "submitOpp.title": { ar: "اعرض فرصتك الاستثمارية على شركاء البركة", en: "Present your opportunity to Baraka Partners", tr: "Fırsatınızı Baraka Partners'a sunun", zh: "向 Baraka Partners 推介您的投资机会" },
  "submitOpp.sub": {
    ar: "أدخل بيانات مشروعك وسيراجعها فريقنا بسرّية. الحقول السرّية تبقى للإدارة ولا تُنشر.",
    en: "Submit your project details for confidential review by our team. Sensitive fields stay with management and are not published.",
    tr: "Proje bilgilerinizi ekibimizin gizli incelemesi için gönderin. Hassas alanlar yönetimde kalır ve yayınlanmaz.",
    zh: "提交您的项目信息，由我们的团队进行保密审核。敏感字段仅供管理层使用，不会公开。",
  },
  "submitOpp.projectType": { ar: "نوع الفرصة", en: "Opportunity type", tr: "Fırsat türü", zh: "机会类型" },
  "submitOpp.projectCountry": { ar: "دولة المشروع", en: "Project country", tr: "Proje ülkesi", zh: "项目所在国" },
  "submitOpp.projectCity": { ar: "مدينة المشروع", en: "Project city", tr: "Proje şehri", zh: "项目所在城市" },
  "submitOpp.amount": { ar: "حجم الاستثمار المطلوب", en: "Required investment amount", tr: "Gerekli yatırım tutarı", zh: "所需投资额" },
  "submitOpp.feasibility": { ar: "هل توجد دراسة جدوى؟", en: "Is there a feasibility study?", tr: "Fizibilite çalışması var mı?", zh: "是否有可行性研究？" },
  "submitOpp.licensing": { ar: "هل توجد وثائق ملكية أو ترخيص؟", en: "Ownership or licensing documents?", tr: "Mülkiyet veya lisans belgeleri var mı?", zh: "是否有产权或许可文件？" },
  "submitOpp.desc": { ar: "وصف مختصر للمشروع", en: "Short project description", tr: "Kısa proje açıklaması", zh: "项目简要说明" },

  // أنواع الفرص (قطاعات المشروع)
  "projType.industrial": { ar: "صناعية", en: "Industrial", tr: "Sanayi", zh: "工业" },
  "projType.agricultural": { ar: "زراعية", en: "Agricultural", tr: "Tarım", zh: "农业" },
  "projType.real_estate": { ar: "عقارية", en: "Real estate", tr: "Gayrimenkul", zh: "房地产" },
  "projType.tourism": { ar: "سياحية", en: "Tourism", tr: "Turizm", zh: "旅游" },
  "projType.energy": { ar: "طاقة", en: "Energy", tr: "Enerji", zh: "能源" },
  "projType.logistics": { ar: "لوجستية", en: "Logistics", tr: "Lojistik", zh: "物流" },
  "projType.food": { ar: "غذائية", en: "Food", tr: "Gıda", zh: "食品" },
  "projType.tech": { ar: "تقنية", en: "Technology", tr: "Teknoloji", zh: "科技" },
  "projType.other": { ar: "أخرى", en: "Other", tr: "Diğer", zh: "其他" },

  // إجابات نعم/لا
  "yn.yes": { ar: "نعم", en: "Yes", tr: "Evet", zh: "是" },
  "yn.no": { ar: "لا", en: "No", tr: "Hayır", zh: "否" },
  "yn.in_progress": { ar: "قيد الإعداد", en: "In progress", tr: "Hazırlanıyor", zh: "准备中" },
  "yn.partial": { ar: "جزئياً", en: "Partial", tr: "Kısmen", zh: "部分" },
};

export function tc(locale: Locale, key: string): string {
  const entry = M[key];
  if (!entry) return key;
  return entry[locale] ?? entry.ar ?? key;
}

// قائمة المفاتيح المتاحة (للتحقق/الاختبار عند الحاجة)
export const CRM_I18N_KEYS = Object.keys(M);
