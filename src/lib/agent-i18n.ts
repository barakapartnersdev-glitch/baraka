// نصوص واجهة قسم «وكلاء أصحاب الأصول» — المحتوى التعريفي للصفحة العامة، وواجهة
// النموذج (wizard)، ولوحة الإدارة. بأربع لغات (الصينية ترجع للإنجليزية).
// وحدة بيانات خالصة (تُستورد في الخادم والعميل) — لا تعتمد على next/headers.
//
// محتوى النموذج نفسه (حقول الأقسام الخمسة) في src/lib/agent-form.ts،
// والتصنيفات والحالات في src/lib/agent.ts.
import type { Locale } from "@/lib/i18n";

export interface AgentUi {
  // SEO
  metaTitle: string;
  metaDescription: string;

  // الصفحة العامة
  navLabel: string;
  heroEyebrow: string;
  h1: string;
  intro: string;
  whoTitle: string;
  whoBody: string;
  whoNote: string;
  assetTypesTitle: string;
  assetTypesSub: string;
  howTitle: string;
  howSteps: string[];
  legalTitle: string;
  legalPoints: string[];
  ctaStart: string;
  applyEyebrow: string;
  applyTitle: string;
  applySub: string;

  // واجهة النموذج (wizard)
  sectionWord: string;
  ofWord: string;
  next: string;
  back: string;
  submit: string;
  submitting: string;
  uploadFile: string;
  uploading: string;
  remove: string;
  filesStepTitle: string;
  filesHint: string;
  filesOptional: string;
  requiredError: string;
  consentError: string;
  genericError: string;
  rateError: string;
  nameError: string;
  emailError: string;
  phoneError: string;
  successTitle: string;
  successBody: string;

  // لوحة الإدارة — القائمة
  listTitle: string;
  listSub: string;
  pendingSuffix: string;
  colName: string;
  colCountry: string;
  colCity: string;
  colPhone: string;
  colEmail: string;
  colProfType: string;
  colAssetTypes: string;
  colDate: string;
  colStatus: string;
  colAssigned: string;
  colLastContact: string;
  colActions: string;
  view: string;
  empty: string;

  // لوحة الإدارة — التفاصيل
  back2: string;
  secPersonal: string;
  secProfessional: string;
  secRelationship: string;
  secCoverage: string;
  secExperience: string;
  secCapabilities: string;
  secLinks: string;
  secConsents: string;
  secFiles: string;
  secInternalNotes: string;
  secActivity: string;

  fNationality: string;
  fResidence: string;
  fCity: string;
  fPhone: string;
  fWhatsapp: string;
  fEmail: string;
  fPreferredLang: string;
  fProfType: string;
  fRelationship: string;
  fAssetTypes: string;
  fRegions: string;
  fExpYears: string;
  fExpDesc: string;
  fPrevDeals: string;
  fPrevDealsDesc: string;

  capProvideInfo: string;
  capContactOwner: string;
  capArrangeMeeting: string;
  capProvideDocs: string;
  capOwnerWants: string;
  capOwnerPermission: string;

  ackAccuracy: string;
  ackNoRepresentation: string;
  ackPrivacy: string;
  ackContact: string;
  ackOwnerConsent: string;

  linkLinkedin: string;
  linkWebsite: string;
  linkCompany: string;

  changeStatus: string;
  assignAdmin: string;
  unassigned: string;
  save: string;
  saved: string;
  notesLabel: string;
  saveNotes: string;
  rejectionReasonLabel: string;
  none: string;
  registeredAt: string;
  lastContactLabel: string;
  noFiles: string;
  noActivity: string;
  actionFailed: string;
}

const AR: AgentUi = {
  metaTitle: "وكلاء أصحاب الأصول | بركة بارتنرز",
  metaDescription:
    "انضم إلى بركة بارتنرز كوكيل لأصحاب الأصول وساهم في ربط المشاريع العقارية والاستثمارية التي تحتاج إلى تمويل أو شراكة مع مستثمرين مناسبين.",

  navLabel: "وكلاء أصحاب الأصول",
  heroEyebrow: "شراكة وتعاون",
  h1: "كن وكيلاً لأصحاب الأصول مع بركة بارتنرز",
  intro:
    "إذا كنت تمتلك علاقات مباشرة مع أصحاب أصول عقارية أو مشاريع قائمة أو متعثرة تحتاج إلى تمويل أو شراكة أو إعادة تشغيل، يمكنك التعاون مع بركة بارتنرز من خلال تقديم هذه الفرص بشكل منظم ومهني ليتم تقييمها وعرضها على المستثمرين المناسبين وفق ضوابط المنصة.",
  whoTitle: "من هو وكيل صاحب الأصل؟",
  whoBody:
    "وكيل صاحب الأصل هو شخص لديه علاقة موثوقة مع مالك أصل أو مشروع، ويمكنه تزويد بركة بارتنرز بمعلومات أولية عن الأصل، والتنسيق مع المالك، ومتابعة عملية التقييم والتواصل بطريقة احترافية من خلال المنصة.",
  whoNote:
    "لا يمثّل الوكيل بركة بارتنرز رسمياً إلا بعد الموافقة عليه وتوقيع اتفاق تعاون واضح.",
  assetTypesTitle: "أنواع الأصول والفرص المقبولة",
  assetTypesSub: "نستقبل مجموعة واسعة من الأصول والفرص القابلة للتمويل أو الشراكة أو التطوير.",
  howTitle: "طريقة العمل",
  howSteps: [
    "يقوم الوكيل بتسجيل بياناته من خلال النموذج.",
    "تراجع الإدارة بيانات الوكيل وخبرته وعلاقاته.",
    "في حال الموافقة الأولية، يتم التواصل معه عبر نظام المراسلات الداخلي.",
    "يُطلب منه معلومات إضافية أو مستندات داعمة عند الحاجة.",
    "في حال قبوله، يُرسَل اتفاق تعاون أو عقد إلكتروني للتوقيع.",
    "بعد التفعيل، يحصل الوكيل على حساب خاص داخل المنصة.",
    "يتمكّن الوكيل من رفع الأصول أو الفرص التي لديه.",
    "تقيّم إدارة بركة بارتنرز كل أصل قبل عرضه على المستثمرين.",
    "تُحفظ حقوق الوكيل وفق الاتفاق الموقّع وبحسب مساهمته الفعلية.",
  ],
  legalTitle: "ملاحظات قانونية وتنظيمية",
  legalPoints: [
    "تقديم الطلب لا يعني قبول الوكيل.",
    "لا يملك الوكيل صفة رسمية لتمثيل بركة بارتنرز قبل توقيع عقد أو اتفاق تعاون.",
    "لبركة بارتنرز الحق في قبول أو رفض أي طلب دون التزام.",
    "لا يُعتمد أي أصل أو فرصة إلا بعد التحقق والمراجعة.",
    "تُحدَّد أي حقوق أو عمولات للوكيل فقط بموجب اتفاق مكتوب ومعتمد.",
    "يُمنع تقديم أصول أو فرص دون علم أو موافقة صاحب العلاقة.",
    "يجب احترام السرّية وعدم مشاركة معلومات حسّاسة خارج النظام.",
  ],
  ctaStart: "ابدأ التسجيل",
  applyEyebrow: "نموذج التسجيل",
  applyTitle: "سجّل كوكيل لصاحب أصل",
  applySub: "خمس خطوات قصيرة. تُراجع الإدارة طلبك وتتواصل معك.",

  sectionWord: "القسم",
  ofWord: "من",
  next: "التالي",
  back: "السابق",
  submit: "إرسال الطلب",
  submitting: "جارٍ الإرسال...",
  uploadFile: "رفع ملف",
  uploading: "جارٍ الرفع...",
  remove: "حذف",
  filesStepTitle: "الملفات الداعمة والإقرار",
  filesHint: "الملفات المسموحة: PDF, DOC, DOCX, JPG, PNG — حتى 10 ميجابايت لكل ملف.",
  filesOptional: "رفع الملفات اختياري، لكنه يعزّز طلبك (سيرة ذاتية، بروفايل شركة، إثبات خبرة أو تفويض).",
  requiredError: "يرجى تعبئة الحقول الإلزامية المميّزة بالأحمر.",
  consentError: "يرجى الموافقة على جميع الإقرارات الإلزامية قبل الإرسال.",
  genericError: "تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى.",
  rateError: "لقد أرسلت طلباً للتو. انتظر قليلاً قبل المحاولة مجدداً.",
  nameError: "يرجى كتابة الاسم الكامل (٣ أحرف على الأقل).",
  emailError: "يرجى إدخال بريد إلكتروني صحيح.",
  phoneError: "يرجى إدخال رقم هاتف صحيح.",
  successTitle: "تم استلام طلبك بنجاح",
  successBody:
    "تم استلام طلبكم بنجاح. ستقوم إدارة بركة بارتنرز بمراجعة البيانات والتواصل معكم من خلال النظام الداخلي أو عبر بيانات التواصل المقدمة.",

  listTitle: "وكلاء أصحاب الأصول",
  listSub: "طلبات الانضمام كوكيل لصاحب أصل ومتابعة حالتها.",
  pendingSuffix: "طلب جديد بانتظار المراجعة.",
  colName: "الاسم",
  colCountry: "الدولة",
  colCity: "المدينة",
  colPhone: "الهاتف",
  colEmail: "البريد",
  colProfType: "الصفة المهنية",
  colAssetTypes: "أنواع الأصول",
  colDate: "تاريخ التسجيل",
  colStatus: "الحالة",
  colAssigned: "المسؤول",
  colLastContact: "آخر تواصل",
  colActions: "إجراءات",
  view: "عرض",
  empty: "لا طلبات بعد.",

  back2: "→ كل الوكلاء",
  secPersonal: "البيانات الشخصية وبيانات التواصل",
  secProfessional: "الصفة المهنية",
  secRelationship: "نوع العلاقة بأصحاب الأصول",
  secCoverage: "أنواع الأصول والمناطق المغطّاة",
  secExperience: "الخبرة",
  secCapabilities: "القدرة على توفير المعلومات",
  secLinks: "روابط مهنية",
  secConsents: "الإقرارات والموافقات",
  secFiles: "الملفات المرفوعة",
  secInternalNotes: "ملاحظات الإدارة الداخلية",
  secActivity: "سجل النشاط",

  fNationality: "الجنسية",
  fResidence: "دولة الإقامة",
  fCity: "المدينة",
  fPhone: "رقم الهاتف",
  fWhatsapp: "واتساب",
  fEmail: "البريد الإلكتروني",
  fPreferredLang: "لغة التواصل المفضّلة",
  fProfType: "الصفة المهنية",
  fRelationship: "نوع العلاقة",
  fAssetTypes: "أنواع الأصول التي يمكن توفيرها",
  fRegions: "الدول/المناطق المغطّاة",
  fExpYears: "سنوات الخبرة",
  fExpDesc: "وصف الخبرات السابقة",
  fPrevDeals: "سبق التوسّط في صفقات استثمارية؟",
  fPrevDealsDesc: "أمثلة على صفقات سابقة",

  capProvideInfo: "توفير معلومات أولية عن الأصل",
  capContactOwner: "التواصل مباشرة مع مالك الأصل",
  capArrangeMeeting: "ترتيب اجتماع مع المالك",
  capProvideDocs: "توفير مستندات أولية عند الحاجة",
  capOwnerWants: "لدى المالك رغبة حقيقية في التمويل/البيع/الشراكة",
  capOwnerPermission: "لديه تفويض أو موافقة أولية من المالك",

  ackAccuracy: "إقرار بصحّة المعلومات المقدّمة",
  ackNoRepresentation: "إقرار بعدم تمثيل بركة بارتنرز رسمياً قبل الموافقة والتعاقد",
  ackPrivacy: "الموافقة على سياسة الخصوصية",
  ackContact: "الموافقة على مراجعة البيانات والتواصل",
  ackOwnerConsent: "تعهّد بعدم رفع أي أصل دون موافقة صاحب العلاقة",

  linkLinkedin: "LinkedIn",
  linkWebsite: "الموقع الإلكتروني",
  linkCompany: "صفحة الشركة",

  changeStatus: "تغيير الحالة",
  assignAdmin: "المسؤول الداخلي",
  unassigned: "غير مُسنَد",
  save: "حفظ",
  saved: "تم الحفظ.",
  notesLabel: "ملاحظات الإدارة الداخلية",
  saveNotes: "حفظ الملاحظات",
  rejectionReasonLabel: "سبب الرفض (داخلي)",
  none: "—",
  registeredAt: "تاريخ التسجيل",
  lastContactLabel: "آخر تواصل",
  noFiles: "لا ملفات مرفوعة.",
  noActivity: "لا نشاط مسجّل بعد.",
  actionFailed: "تعذّر تنفيذ الإجراء.",
};

const EN: AgentUi = {
  metaTitle: "Asset Owner Agents | Baraka Partners",
  metaDescription:
    "Join Baraka Partners as an Asset Owner Agent and help connect real estate assets, existing projects, and financing opportunities with suitable investors.",

  navLabel: "Asset Owner Agents",
  heroEyebrow: "Partnership & cooperation",
  h1: "Become an Asset Owner Agent with Baraka Partners",
  intro:
    "If you have direct relationships with owners of real estate assets, existing projects, or distressed projects requiring financing, partnership, or restructuring, you can cooperate with Baraka Partners by submitting these opportunities in a professional and organized way for evaluation and potential presentation to suitable investors.",
  whoTitle: "Who is an Asset Owner Agent?",
  whoBody:
    "An Asset Owner Agent is someone with a trusted relationship to an asset or project owner, who can provide Baraka Partners with initial information about the asset, coordinate with the owner, and follow the evaluation and communication process professionally through the platform.",
  whoNote:
    "An agent does not officially represent Baraka Partners until approved and a clear cooperation agreement is signed.",
  assetTypesTitle: "Accepted asset and opportunity types",
  assetTypesSub: "We welcome a wide range of assets and opportunities open to financing, partnership, or development.",
  howTitle: "How it works",
  howSteps: [
    "The agent registers their details through the form.",
    "Management reviews the agent's details, experience, and relationships.",
    "On preliminary approval, we contact them via the internal messaging system.",
    "Additional information or supporting documents are requested when needed.",
    "If accepted, a cooperation agreement or electronic contract is sent to sign.",
    "After activation, the agent receives a dedicated account on the platform.",
    "The agent can upload the assets or opportunities they have.",
    "Baraka Partners evaluates each asset before presenting it to investors.",
    "The agent's rights are preserved per the signed agreement and actual contribution.",
  ],
  legalTitle: "Legal & regulatory notes",
  legalPoints: [
    "Submitting an application does not mean the agent is accepted.",
    "An agent has no official capacity to represent Baraka Partners before signing a contract or cooperation agreement.",
    "Baraka Partners reserves the right to accept or reject any application without obligation.",
    "No asset or opportunity is approved before verification and review.",
    "Any agent rights or commissions are defined solely by a written, approved agreement.",
    "Submitting assets or opportunities without the relevant party's knowledge or consent is prohibited.",
    "Confidentiality must be respected; sensitive information must not be shared outside the system.",
  ],
  ctaStart: "Start application",
  applyEyebrow: "Application form",
  applyTitle: "Apply as an Asset Owner Agent",
  applySub: "Five short steps. Management reviews your application and contacts you.",

  sectionWord: "Step",
  ofWord: "of",
  next: "Next",
  back: "Back",
  submit: "Submit application",
  submitting: "Submitting...",
  uploadFile: "Upload file",
  uploading: "Uploading...",
  remove: "Remove",
  filesStepTitle: "Supporting files & consent",
  filesHint: "Allowed files: PDF, DOC, DOCX, JPG, PNG — up to 10 MB each.",
  filesOptional: "Uploading files is optional but strengthens your application (CV, company profile, proof of experience or authorization).",
  requiredError: "Please complete the required fields highlighted in red.",
  consentError: "Please accept all required acknowledgements before submitting.",
  genericError: "Could not submit the application. Please try again.",
  rateError: "You just submitted an application. Please wait a moment before trying again.",
  nameError: "Please enter your full name (at least 3 characters).",
  emailError: "Please enter a valid email address.",
  phoneError: "Please enter a valid phone number.",
  successTitle: "Your application has been received",
  successBody:
    "Your application has been received successfully. Baraka Partners management will review your information and contact you through the internal messaging system or the contact details provided.",

  listTitle: "Asset Owner Agents",
  listSub: "Asset owner agent applications and their status.",
  pendingSuffix: "new application(s) awaiting review.",
  colName: "Name",
  colCountry: "Country",
  colCity: "City",
  colPhone: "Phone",
  colEmail: "Email",
  colProfType: "Professional type",
  colAssetTypes: "Asset types",
  colDate: "Registered",
  colStatus: "Status",
  colAssigned: "Assignee",
  colLastContact: "Last contact",
  colActions: "Actions",
  view: "View",
  empty: "No applications yet.",

  back2: "← All agents",
  secPersonal: "Personal & contact details",
  secProfessional: "Professional capacity",
  secRelationship: "Relationship with asset owners",
  secCoverage: "Covered asset types & regions",
  secExperience: "Experience",
  secCapabilities: "Ability to provide information",
  secLinks: "Professional links",
  secConsents: "Acknowledgements & consents",
  secFiles: "Uploaded files",
  secInternalNotes: "Internal admin notes",
  secActivity: "Activity log",

  fNationality: "Nationality",
  fResidence: "Country of residence",
  fCity: "City",
  fPhone: "Phone",
  fWhatsapp: "WhatsApp",
  fEmail: "Email",
  fPreferredLang: "Preferred contact language",
  fProfType: "Professional type",
  fRelationship: "Relationship type",
  fAssetTypes: "Asset types they can provide",
  fRegions: "Covered regions",
  fExpYears: "Years of experience",
  fExpDesc: "Description of prior experience",
  fPrevDeals: "Previously brokered investment deals?",
  fPrevDealsDesc: "Examples of prior deals",

  capProvideInfo: "Can provide initial information about the asset",
  capContactOwner: "Can contact the asset owner directly",
  capArrangeMeeting: "Can arrange a meeting with the owner",
  capProvideDocs: "Can provide initial documents when needed",
  capOwnerWants: "Owner has genuine intent to finance/sell/partner",
  capOwnerPermission: "Has authorization or initial consent from the owner",

  ackAccuracy: "Confirms the information provided is accurate",
  ackNoRepresentation: "Acknowledges not representing Baraka Partners officially before approval and contracting",
  ackPrivacy: "Accepts the privacy policy",
  ackContact: "Consents to review of their data and being contacted",
  ackOwnerConsent: "Undertakes not to submit any asset without the relevant party's consent",

  linkLinkedin: "LinkedIn",
  linkWebsite: "Website",
  linkCompany: "Company page",

  changeStatus: "Change status",
  assignAdmin: "Assignee",
  unassigned: "Unassigned",
  save: "Save",
  saved: "Saved.",
  notesLabel: "Internal admin notes",
  saveNotes: "Save notes",
  rejectionReasonLabel: "Rejection reason (internal)",
  none: "—",
  registeredAt: "Registered",
  lastContactLabel: "Last contact",
  noFiles: "No files uploaded.",
  noActivity: "No activity logged yet.",
  actionFailed: "Could not complete the action.",
};

const TR: AgentUi = {
  metaTitle: "Varlık Sahibi Temsilcileri | Baraka Partners",
  metaDescription:
    "Gayrimenkul, proje ve yatırım varlık sahipleriyle ilişkisi olan temsilciler için Baraka Partners iş birliği başvuru sayfası.",

  navLabel: "Varlık Sahibi Temsilcileri",
  heroEyebrow: "Ortaklık ve iş birliği",
  h1: "Baraka Partners ile Varlık Sahibi Temsilcisi Olun",
  intro:
    "Gayrimenkul varlıkları, mevcut projeleri veya finansman, ortaklık ya da yeniden yapılandırma ihtiyacı olan projelerin sahipleriyle doğrudan ilişkilere sahipseniz, bu fırsatları Baraka Partners'a profesyonel ve düzenli şekilde sunarak yatırımcılarla buluşturulmasına katkı sağlayabilirsiniz.",
  whoTitle: "Varlık Sahibi Temsilcisi kimdir?",
  whoBody:
    "Varlık Sahibi Temsilcisi, bir varlık veya proje sahibiyle güvenilir bir ilişkisi olan; Baraka Partners'a varlık hakkında ön bilgi sağlayabilen, sahiple koordinasyon kurabilen ve değerlendirme ile iletişim sürecini platform üzerinden profesyonelce yürütebilen kişidir.",
  whoNote:
    "Temsilci, onaylanmadan ve açık bir iş birliği sözleşmesi imzalanmadan önce Baraka Partners'ı resmî olarak temsil etmez.",
  assetTypesTitle: "Kabul edilen varlık ve fırsat türleri",
  assetTypesSub: "Finansman, ortaklık veya geliştirmeye açık geniş bir varlık ve fırsat yelpazesini kabul ediyoruz.",
  howTitle: "Nasıl çalışır",
  howSteps: [
    "Temsilci, bilgilerini form aracılığıyla kaydeder.",
    "Yönetim, temsilcinin bilgilerini, deneyimini ve ilişkilerini inceler.",
    "Ön onay durumunda dahili mesajlaşma sistemi üzerinden iletişime geçilir.",
    "Gerektiğinde ek bilgi veya destekleyici belgeler istenir.",
    "Kabul edilirse imza için bir iş birliği sözleşmesi veya elektronik sözleşme gönderilir.",
    "Aktivasyondan sonra temsilci, platformda özel bir hesap edinir.",
    "Temsilci, elindeki varlıkları veya fırsatları yükleyebilir.",
    "Baraka Partners, her varlığı yatırımcılara sunmadan önce değerlendirir.",
    "Temsilcinin hakları, imzalanan sözleşmeye ve fiili katkısına göre korunur.",
  ],
  legalTitle: "Yasal ve düzenleyici notlar",
  legalPoints: [
    "Başvuru yapmak, temsilcinin kabul edildiği anlamına gelmez.",
    "Bir sözleşme veya iş birliği anlaşması imzalanmadan önce temsilcinin Baraka Partners'ı temsil etme resmî yetkisi yoktur.",
    "Baraka Partners, herhangi bir başvuruyu yükümlülük olmaksızın kabul veya reddetme hakkını saklı tutar.",
    "Hiçbir varlık veya fırsat, doğrulama ve inceleme yapılmadan onaylanmaz.",
    "Temsilciye ait her türlü hak veya komisyon yalnızca yazılı ve onaylı bir sözleşmeyle belirlenir.",
    "İlgili tarafın bilgisi veya onayı olmadan varlık ya da fırsat sunmak yasaktır.",
    "Gizliliğe uyulmalı; hassas bilgiler sistem dışında paylaşılmamalıdır.",
  ],
  ctaStart: "Başvuruya Başla",
  applyEyebrow: "Başvuru formu",
  applyTitle: "Varlık Sahibi Temsilcisi Olarak Başvur",
  applySub: "Beş kısa adım. Yönetim başvurunuzu inceler ve sizinle iletişime geçer.",

  sectionWord: "Adım",
  ofWord: "/",
  next: "İleri",
  back: "Geri",
  submit: "Başvuruyu Gönder",
  submitting: "Gönderiliyor...",
  uploadFile: "Dosya Yükle",
  uploading: "Yükleniyor...",
  remove: "Kaldır",
  filesStepTitle: "Destekleyici dosyalar ve onay",
  filesHint: "İzin verilen dosyalar: PDF, DOC, DOCX, JPG, PNG — her biri en fazla 10 MB.",
  filesOptional: "Dosya yüklemek isteğe bağlıdır ancak başvurunuzu güçlendirir (özgeçmiş, şirket profili, deneyim veya yetki belgesi).",
  requiredError: "Lütfen kırmızıyla işaretlenen zorunlu alanları doldurun.",
  consentError: "Lütfen göndermeden önce tüm zorunlu onayları kabul edin.",
  genericError: "Başvuru gönderilemedi. Lütfen tekrar deneyin.",
  rateError: "Az önce bir başvuru gönderdiniz. Lütfen tekrar denemeden önce biraz bekleyin.",
  nameError: "Lütfen tam adınızı girin (en az 3 karakter).",
  emailError: "Lütfen geçerli bir e-posta adresi girin.",
  phoneError: "Lütfen geçerli bir telefon numarası girin.",
  successTitle: "Başvurunuz alındı",
  successBody:
    "Başvurunuz başarıyla alınmıştır. Baraka Partners yönetimi bilgilerinizi inceleyecek ve sizinle dahili iletişim sistemi veya sağladığınız iletişim bilgileri üzerinden iletişime geçecektir.",

  listTitle: "Varlık Sahibi Temsilcileri",
  listSub: "Varlık sahibi temsilcisi başvuruları ve durumları.",
  pendingSuffix: "yeni başvuru incelenmeyi bekliyor.",
  colName: "Ad",
  colCountry: "Ülke",
  colCity: "Şehir",
  colPhone: "Telefon",
  colEmail: "E-posta",
  colProfType: "Mesleki sıfat",
  colAssetTypes: "Varlık türleri",
  colDate: "Kayıt tarihi",
  colStatus: "Durum",
  colAssigned: "Sorumlu",
  colLastContact: "Son iletişim",
  colActions: "İşlemler",
  view: "Görüntüle",
  empty: "Henüz başvuru yok.",

  back2: "← Tüm temsilciler",
  secPersonal: "Kişisel ve iletişim bilgileri",
  secProfessional: "Mesleki sıfat",
  secRelationship: "Varlık sahipleriyle ilişki türü",
  secCoverage: "Kapsanan varlık türleri ve bölgeler",
  secExperience: "Deneyim",
  secCapabilities: "Bilgi sağlama imkânı",
  secLinks: "Mesleki bağlantılar",
  secConsents: "Onaylar ve muvafakatler",
  secFiles: "Yüklenen dosyalar",
  secInternalNotes: "Dahili yönetim notları",
  secActivity: "Etkinlik günlüğü",

  fNationality: "Uyruk",
  fResidence: "İkamet ülkesi",
  fCity: "Şehir",
  fPhone: "Telefon",
  fWhatsapp: "WhatsApp",
  fEmail: "E-posta",
  fPreferredLang: "Tercih edilen iletişim dili",
  fProfType: "Mesleki sıfat",
  fRelationship: "İlişki türü",
  fAssetTypes: "Sağlayabileceği varlık türleri",
  fRegions: "Kapsanan bölgeler",
  fExpYears: "Deneyim yılı",
  fExpDesc: "Önceki deneyimlerin açıklaması",
  fPrevDeals: "Daha önce yatırım anlaşmalarına aracılık edildi mi?",
  fPrevDealsDesc: "Önceki anlaşma örnekleri",

  capProvideInfo: "Varlık hakkında ön bilgi sağlayabilir",
  capContactOwner: "Varlık sahibiyle doğrudan iletişim kurabilir",
  capArrangeMeeting: "Sahiple görüşme ayarlayabilir",
  capProvideDocs: "Gerektiğinde ön belgeler sağlayabilir",
  capOwnerWants: "Sahibin finansman/satış/ortaklık konusunda gerçek niyeti var",
  capOwnerPermission: "Sahipten yetki veya ön onayı var",

  ackAccuracy: "Sağlanan bilgilerin doğru olduğunu onaylar",
  ackNoRepresentation: "Onay ve sözleşme öncesinde Baraka Partners'ı resmî temsil etmediğini kabul eder",
  ackPrivacy: "Gizlilik politikasını kabul eder",
  ackContact: "Verilerinin incelenmesine ve iletişime geçilmesine onay verir",
  ackOwnerConsent: "İlgili tarafın onayı olmadan varlık sunmamayı taahhüt eder",

  linkLinkedin: "LinkedIn",
  linkWebsite: "Web sitesi",
  linkCompany: "Şirket sayfası",

  changeStatus: "Durumu değiştir",
  assignAdmin: "Sorumlu",
  unassigned: "Atanmamış",
  save: "Kaydet",
  saved: "Kaydedildi.",
  notesLabel: "Dahili yönetim notları",
  saveNotes: "Notları kaydet",
  rejectionReasonLabel: "Ret nedeni (dahili)",
  none: "—",
  registeredAt: "Kayıt tarihi",
  lastContactLabel: "Son iletişim",
  noFiles: "Yüklenen dosya yok.",
  noActivity: "Henüz etkinlik kaydı yok.",
  actionFailed: "İşlem tamamlanamadı.",
};

export const AGENT_UI: Record<Locale, AgentUi> = { ar: AR, en: EN, tr: TR, zh: EN };

export function agentUi(locale: Locale): AgentUi {
  return AGENT_UI[locale] ?? EN;
}
