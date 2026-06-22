// نصوص إطار التصميم الفاخر لصفحة «تسجيل صاحب مشروع/أصل» — أربع لغات.
import type { Locale } from "@/lib/i18n";

export interface OwnerRegisterExtra {
  visualBadge: string;
  visualH1a: string;
  visualGold: string;
  visualLead: string;
  benefits: string[];
  formKicker: string;
  formH2: string;
  formLead: string;
  secAccount: string;
  secType: string;
  secProject: string;
  secPassword: string;
  secConsent: string;
  fieldCity: string;
  fieldCountry: string;
  fieldLanguage: string;
  fieldAssetType: string;
  fieldProjectStage: string;
  fieldProjectCountry: string;
  fieldProjectCity: string;
  fieldInvestmentNeed: string;
  fieldSector: string;
  fieldDescription: string;
  descPlaceholder: string;
  selectPlaceholder: string;
  ownerTypes: { title: string; desc: string }[];
  assetTypes: string[];
  projectStages: string[];
  investmentNeeds: string[];
  languages: string[];
  consents: string[];
  note: string;
}

const ar: OwnerRegisterExtra = {
  visualBadge: "تسجيل صاحب مشروع أو أصل",
  visualH1a: "حوّل مشروعك",
  visualGold: "إلى فرصة استثمارية قابلة للدراسة",
  visualLead:
    "سجّل بياناتك ليتم اعتماد حسابك من الإدارة، ثم يمكنك تقديم مشروعك أو أصلك الاستثماري للمراجعة والعرض على المستثمرين المناسبين ضمن إطار من السرية والحوكمة.",
  benefits: [
    "تحويل مشروعك إلى ملف استثماري منظّم",
    "عرض الفرصة بسرية متدرّجة دون كشف البيانات الحساسة",
    "مراجعة الفرصة قبل عرضها على المستثمرين",
    "مطابقة المشروع مع مستثمرين أو مشغّلين مناسبين",
    "إمكانية دراسة نماذج شراكة أو إدارة أو تشغيل",
  ],
  formKicker: "طلب اعتماد صاحب فرصة",
  formH2: "سجّل بياناتك بوضوح",
  formLead:
    "جميع الحقول إلزامية. الحسابات الناقصة أو العامة لا تعطي انطباعاً جاداً، ولن تساعد الإدارة على تقييم الطلب.",
  secAccount: "1. بيانات الحساب",
  secType: "2. صفتك في الفرصة",
  secProject: "3. نبذة عن الفرصة",
  secPassword: "4. كلمة المرور",
  secConsent: "5. الإقرار والموافقة",
  fieldCity: "المدينة",
  fieldCountry: "الدولة",
  fieldLanguage: "لغة التواصل المفضّلة",
  fieldAssetType: "نوع المشروع أو الأصل",
  fieldProjectStage: "مرحلة المشروع",
  fieldProjectCountry: "دولة المشروع أو الأصل",
  fieldProjectCity: "مدينة المشروع أو الأصل",
  fieldInvestmentNeed: "حجم التمويل أو الاستثمار المطلوب",
  fieldSector: "القطاع",
  fieldDescription: "وصف مختصر للفرصة",
  descPlaceholder:
    "اكتب وصفاً واضحاً: ما هو المشروع؟ ما وضعه الحالي؟ ما المطلوب؟ هل تبحث عن بيع، شراكة، تمويل، إدارة أو تشغيل؟",
  selectPlaceholder: "اختر من القائمة",
  ownerTypes: [
    { title: "صاحب مشروع", desc: "لديك مشروع قائم أو قيد التطوير وتبحث عن مستثمر أو شريك استراتيجي." },
    { title: "صاحب أصل", desc: "تملك أرضاً، مصنعاً، عقاراً، فندقاً، شركة، أو أصلاً قابلاً للاستثمار." },
    { title: "ممثل مفوّض", desc: "تمثّل صاحب مشروع أو أصل ولديك تفويض أو علاقة مباشرة تسمح بتقديم الفرصة." },
  ],
  assetTypes: [
    "أرض أو عقار", "مصنع أو خط إنتاج", "شركة قائمة", "مشروع زراعي", "مشروع سياحي أو فندقي",
    "مشروع لوجستي", "مشروع تقني", "مشروع صناعي", "مشروع متعثر يحتاج إعادة تشغيل", "فرصة أخرى",
  ],
  projectStages: [
    "فكرة أولية", "مشروع قائم", "مشروع متوقف", "مشروع قيد التوسع",
    "أصل جاهز للبيع أو الشراكة", "يحتاج تمويلاً", "يحتاج مشغّلاً أو إدارة",
  ],
  investmentNeeds: [
    "أقل من 100 ألف دولار", "100 ألف – 500 ألف دولار", "500 ألف – 1 مليون دولار",
    "1 – 5 مليون دولار", "5 – 20 مليون دولار", "أكثر من 20 مليون دولار", "غير محدّد بعد",
  ],
  languages: ["العربية", "التركية", "الإنجليزية", "الصينية", "أخرى"],
  consents: [
    "أقرّ بأنني صاحب العلاقة أو ممثل مفوّض، وأن المعلومات المقدّمة صحيحة حسب علمي.",
    "أوافق على سياسة الخصوصية ومعالجة بياناتي لغرض مراجعة طلب التسجيل والتواصل معي بخصوص الفرصة.",
    "أفهم أن إنشاء الحساب لا يعني قبول الفرصة أو عرضها، وأن الإدارة تراجع الحساب والفرصة قبل الاعتماد.",
  ],
  note: "إنشاء الحساب لا يعني قبول المشروع أو عرضه على المستثمرين. يتم اعتماد الحساب والفرصة بعد مراجعة الإدارة.",
};

const en: OwnerRegisterExtra = {
  visualBadge: "Project or asset owner registration",
  visualH1a: "Turn your project",
  visualGold: "into a studyable investment opportunity",
  visualLead:
    "Register your details so management can approve your account; then you can submit your project or investable asset for review and presentation to suitable investors within a framework of confidentiality and governance.",
  benefits: [
    "Turn your project into an organized investment file",
    "Present the opportunity with graduated confidentiality, without exposing sensitive data",
    "Review of the opportunity before presenting it to investors",
    "Match the project with suitable investors or operators",
    "Explore partnership, management, or operating models",
  ],
  formKicker: "Opportunity owner approval request",
  formH2: "Register your details clearly",
  formLead:
    "All fields are required. Incomplete or generic accounts don't give a serious impression and won't help management evaluate the request.",
  secAccount: "1. Account details",
  secType: "2. Your role in the opportunity",
  secProject: "3. About the opportunity",
  secPassword: "4. Password",
  secConsent: "5. Declarations & consent",
  fieldCity: "City",
  fieldCountry: "Country",
  fieldLanguage: "Preferred contact language",
  fieldAssetType: "Type of project or asset",
  fieldProjectStage: "Project stage",
  fieldProjectCountry: "Project / asset country",
  fieldProjectCity: "Project / asset city",
  fieldInvestmentNeed: "Required financing or investment size",
  fieldSector: "Sector",
  fieldDescription: "Brief description of the opportunity",
  descPlaceholder:
    "Write a clear description: What is the project? Its current status? What's needed? Are you seeking a sale, partnership, financing, management, or operation?",
  selectPlaceholder: "Select from the list",
  ownerTypes: [
    { title: "Project owner", desc: "You have an existing or developing project and are seeking an investor or strategic partner." },
    { title: "Asset owner", desc: "You own land, a factory, real estate, a hotel, a company, or an investable asset." },
    { title: "Authorized representative", desc: "You represent a project/asset owner and have authorization or a direct relationship allowing you to present the opportunity." },
  ],
  assetTypes: [
    "Land or real estate", "Factory or production line", "Existing company", "Agricultural project", "Tourism or hotel project",
    "Logistics project", "Tech project", "Industrial project", "Distressed project needing restart", "Other opportunity",
  ],
  projectStages: [
    "Early idea", "Existing project", "Halted project", "Project under expansion",
    "Asset ready for sale or partnership", "Needs financing", "Needs an operator or management",
  ],
  investmentNeeds: [
    "Under $100K", "$100K – $500K", "$500K – $1M", "$1M – $5M", "$5M – $20M", "Over $20M", "Not yet defined",
  ],
  languages: ["Arabic", "Turkish", "English", "Chinese", "Other"],
  consents: [
    "I declare that I am the relevant party or an authorized representative, and that the information provided is accurate to the best of my knowledge.",
    "I agree to the privacy policy and the processing of my data to review my registration and contact me about the opportunity.",
    "I understand that creating an account does not mean the opportunity is accepted or presented, and that management reviews the account and opportunity before approval.",
  ],
  note: "Creating an account does not mean the project is accepted or presented to investors. The account and opportunity are approved after management review.",
};

const tr: OwnerRegisterExtra = {
  visualBadge: "Proje veya varlık sahibi kaydı",
  visualH1a: "Projenizi",
  visualGold: "incelenebilir bir yatırım fırsatına dönüştürün",
  visualLead:
    "Bilgilerinizi kaydedin ki hesabınız yönetim tarafından onaylansın; ardından projenizi veya yatırıma uygun varlığınızı, gizlilik ve yönetişim çerçevesinde incelenmek ve uygun yatırımcılara sunulmak üzere gönderebilirsiniz.",
  benefits: [
    "Projenizi düzenli bir yatırım dosyasına dönüştürün",
    "Fırsatı, hassas verileri açığa çıkarmadan kademeli gizlilikle sunun",
    "Yatırımcılara sunmadan önce fırsatın incelenmesi",
    "Projeyi uygun yatırımcı veya işletmecilerle eşleştirin",
    "Ortaklık, yönetim veya işletme modellerini değerlendirme imkânı",
  ],
  formKicker: "Fırsat sahibi onay talebi",
  formH2: "Bilgilerinizi net girin",
  formLead:
    "Tüm alanlar zorunludur. Eksik veya genel hesaplar ciddi bir izlenim vermez ve yönetimin talebi değerlendirmesine yardımcı olmaz.",
  secAccount: "1. Hesap bilgileri",
  secType: "2. Fırsattaki rolünüz",
  secProject: "3. Fırsat hakkında",
  secPassword: "4. Şifre",
  secConsent: "5. Beyanlar ve onay",
  fieldCity: "Şehir",
  fieldCountry: "Ülke",
  fieldLanguage: "Tercih edilen iletişim dili",
  fieldAssetType: "Proje veya varlık türü",
  fieldProjectStage: "Proje aşaması",
  fieldProjectCountry: "Proje / varlık ülkesi",
  fieldProjectCity: "Proje / varlık şehri",
  fieldInvestmentNeed: "Gereken finansman veya yatırım büyüklüğü",
  fieldSector: "Sektör",
  fieldDescription: "Fırsatın kısa açıklaması",
  descPlaceholder:
    "Net bir açıklama yazın: Proje nedir? Mevcut durumu nedir? Ne gerekiyor? Satış, ortaklık, finansman, yönetim veya işletme mi arıyorsunuz?",
  selectPlaceholder: "Listeden seçin",
  ownerTypes: [
    { title: "Proje sahibi", desc: "Mevcut veya gelişmekte olan bir projeniz var ve yatırımcı ya da stratejik ortak arıyorsunuz." },
    { title: "Varlık sahibi", desc: "Arazi, fabrika, gayrimenkul, otel, şirket veya yatırıma uygun bir varlığa sahipsiniz." },
    { title: "Yetkili temsilci", desc: "Bir proje/varlık sahibini temsil ediyorsunuz ve fırsatı sunmanıza izin veren yetki veya doğrudan ilişkiniz var." },
  ],
  assetTypes: [
    "Arazi veya gayrimenkul", "Fabrika veya üretim hattı", "Mevcut şirket", "Tarım projesi", "Turizm veya otel projesi",
    "Lojistik projesi", "Teknoloji projesi", "Sanayi projesi", "Yeniden başlatma gerektiren sorunlu proje", "Diğer fırsat",
  ],
  projectStages: [
    "Erken fikir", "Mevcut proje", "Durmuş proje", "Genişleme aşamasındaki proje",
    "Satış veya ortaklığa hazır varlık", "Finansman gerekiyor", "İşletmeci veya yönetim gerekiyor",
  ],
  investmentNeeds: [
    "100 bin doların altı", "100 bin – 500 bin dolar", "500 bin – 1 milyon dolar",
    "1 – 5 milyon dolar", "5 – 20 milyon dolar", "20 milyon dolardan fazla", "Henüz belirlenmedi",
  ],
  languages: ["Arapça", "Türkçe", "İngilizce", "Çince", "Diğer"],
  consents: [
    "İlgili taraf veya yetkili temsilci olduğumu ve verilen bilgilerin bildiğim kadarıyla doğru olduğunu beyan ederim.",
    "Gizlilik politikasını ve kayıt talebimi incelemek ile fırsat hakkında benimle iletişime geçmek amacıyla verilerimin işlenmesini kabul ediyorum.",
    "Hesap oluşturmanın fırsatın kabul edildiği veya sunulduğu anlamına gelmediğini, yönetimin onaydan önce hesabı ve fırsatı incelediğini anlıyorum.",
  ],
  note: "Hesap oluşturmak, projenin kabul edildiği veya yatırımcılara sunulduğu anlamına gelmez. Hesap ve fırsat, yönetim incelemesinden sonra onaylanır.",
};

const zh: OwnerRegisterExtra = {
  visualBadge: "项目或资产所有者注册",
  visualH1a: "将您的项目",
  visualGold: "转化为可供研究的投资机会",
  visualLead:
    "登记您的信息以便管理层批准您的账户；随后您即可在保密与治理框架内提交您的项目或可投资资产，供审核并向合适的投资者展示。",
  benefits: [
    "将您的项目转化为有条理的投资档案",
    "以分级保密方式展示机会，不泄露敏感数据",
    "在向投资者展示前对机会进行审核",
    "将项目与合适的投资者或运营方匹配",
    "可研究合作、管理或运营模式",
  ],
  formKicker: "机会方审核申请",
  formH2: "请清晰填写您的信息",
  formLead: "所有字段均为必填。不完整或笼统的账户难以给人认真的印象，也无助于管理层评估申请。",
  secAccount: "1. 账户信息",
  secType: "2. 您在机会中的身份",
  secProject: "3. 机会简介",
  secPassword: "4. 密码",
  secConsent: "5. 声明与同意",
  fieldCity: "城市",
  fieldCountry: "国家",
  fieldLanguage: "首选沟通语言",
  fieldAssetType: "项目或资产类型",
  fieldProjectStage: "项目阶段",
  fieldProjectCountry: "项目／资产所在国家",
  fieldProjectCity: "项目／资产所在城市",
  fieldInvestmentNeed: "所需融资或投资规模",
  fieldSector: "行业",
  fieldDescription: "机会简要描述",
  descPlaceholder: "请清晰描述：项目是什么？当前状况如何？需要什么？您是在寻求出售、合作、融资、管理还是运营？",
  selectPlaceholder: "从列表中选择",
  ownerTypes: [
    { title: "项目所有者", desc: "您拥有现有或在建项目，正在寻找投资者或战略伙伴。" },
    { title: "资产所有者", desc: "您拥有土地、工厂、房地产、酒店、公司或可投资资产。" },
    { title: "授权代表", desc: "您代表项目／资产所有者，并拥有授权或直接关系，可提交该机会。" },
  ],
  assetTypes: [
    "土地或房产", "工厂或生产线", "现有公司", "农业项目", "旅游或酒店项目",
    "物流项目", "科技项目", "工业项目", "需重启的困境项目", "其他机会",
  ],
  projectStages: [
    "初步构想", "现有项目", "停滞项目", "扩张中的项目",
    "可供出售或合作的资产", "需要融资", "需要运营方或管理",
  ],
  investmentNeeds: [
    "10 万美元以下", "10 万 – 50 万美元", "50 万 – 100 万美元",
    "100 万 – 500 万美元", "500 万 – 2000 万美元", "2000 万美元以上", "尚未确定",
  ],
  languages: ["阿拉伯语", "土耳其语", "英语", "中文", "其他"],
  consents: [
    "我声明我是相关方或授权代表，且所提供的信息据我所知属实。",
    "我同意隐私政策，并同意为审核我的注册申请及就该机会与我联系而处理我的数据。",
    "我理解创建账户并不意味着该机会已被接受或展示，管理层会在批准前审核账户与机会。",
  ],
  note: "创建账户并不意味着该项目已被接受或向投资者展示。账户与机会需经管理层审核后批准。",
};

export const OWNER_REGISTER_X: Record<Locale, OwnerRegisterExtra> = { ar, en, tr, zh };

export function ownerRegisterX(locale: Locale): OwnerRegisterExtra {
  return OWNER_REGISTER_X[locale] ?? OWNER_REGISTER_X.ar;
}
