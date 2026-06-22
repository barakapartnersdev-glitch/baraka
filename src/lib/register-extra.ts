// نصوص إطار التصميم الفاخر لصفحة «تسجيل مستثمر» — أربع لغات.
// تُستخدم في الصفحة (خادم) والنموذج (عميل). الحقول الأساسية تبقى عبر t() العام.
import type { Locale } from "@/lib/i18n";

export interface RegisterExtra {
  visualBadge: string;
  visualH1a: string;
  visualGold: string;
  visualLead: string;
  stats: [string, string][];
  formKicker: string;
  formH2: string;
  formLead: string;
  secAccount: string;
  secType: string;
  secProfile: string;
  secPassword: string;
  fieldCountry: string;
  fieldRange: string;
  fieldSector: string;
  selectPlaceholder: string;
  typeIndividualDesc: string;
  typeCompanyDesc: string;
  typeFundDesc: string;
  investmentRanges: string[];
  sectors: string[];
  consent: string;
  note: string;
}

const ar: RegisterExtra = {
  visualBadge: "تسجيل مستثمر جديد",
  visualH1a: "ادخل إلى شبكة",
  visualGold: "الفرص الاستثمارية المؤهلة",
  visualLead:
    "أنشئ حسابك ليتم مراجعة طلبك من الإدارة، وبعد الاعتماد يمكنك الوصول إلى تفاصيل أوسع للفرص الاستثمارية المناسبة.",
  stats: [
    ["سرّية", "عرض متدرّج"],
    ["مراجعة", "اعتماد إداري"],
    ["فرص", "حسب القطاع والدولة"],
  ],
  formKicker: "طلب اعتماد مستثمر",
  formH2: "سجّل بياناتك بدقة",
  formLead: "جميع الحقول إلزامية. الحسابات غير الواضحة أو الناقصة لا تعطي انطباعاً جدّياً.",
  secAccount: "1. بيانات الحساب",
  secType: "2. نوع المستثمر",
  secProfile: "3. الملف الاستثماري",
  secPassword: "4. كلمة المرور",
  fieldCountry: "الدولة",
  fieldRange: "حجم الاستثمار المتوقع",
  fieldSector: "القطاع المفضّل",
  selectPlaceholder: "اختر من القائمة",
  typeIndividualDesc: "للمستثمرين الأفراد وأصحاب الملاءة المالية الباحثين عن فرص مختارة.",
  typeCompanyDesc: "للشركات التجارية، الصناعية، العقارية أو التشغيلية التي تبحث عن توسع أو شراكة.",
  typeFundDesc: "للصناديق، الشركات القابضة، المكاتب العائلية، والجهات الاستثمارية المنظّمة.",
  investmentRanges: [
    "أقل من 100 ألف دولار",
    "100 ألف – 500 ألف دولار",
    "500 ألف – 1 مليون دولار",
    "1 – 5 مليون دولار",
    "5 – 20 مليون دولار",
    "أكثر من 20 مليون دولار",
  ],
  sectors: [
    "العقار والتطوير",
    "الصناعة",
    "الزراعة",
    "الصناعات الغذائية",
    "الطاقة",
    "السياحة",
    "اللوجستيات",
    "التكنولوجيا",
    "فرص متعددة",
  ],
  consent:
    "أوافق على سياسة الخصوصية ومعالجة بياناتي لغرض مراجعة طلب التسجيل والتواصل معي بخصوص الفرص الاستثمارية.",
  note: "إنشاء الحساب لا يعني القبول التلقائي. يتم اعتماد المستثمر من الإدارة قبل فتح التفاصيل الكاملة للفرص.",
};

const en: RegisterExtra = {
  visualBadge: "New investor registration",
  visualH1a: "Enter the network of",
  visualGold: "qualified investment opportunities",
  visualLead:
    "Create your account so management can review your request; after approval you gain access to fuller details of suitable investment opportunities.",
  stats: [
    ["Confidentiality", "graduated disclosure"],
    ["Review", "management approval"],
    ["Opportunities", "by sector and country"],
  ],
  formKicker: "Investor approval request",
  formH2: "Register your details accurately",
  formLead: "All fields are required. Unclear or incomplete accounts don't give a serious impression.",
  secAccount: "1. Account details",
  secType: "2. Investor type",
  secProfile: "3. Investment profile",
  secPassword: "4. Password",
  fieldCountry: "Country",
  fieldRange: "Expected investment size",
  fieldSector: "Preferred sector",
  selectPlaceholder: "Select from the list",
  typeIndividualDesc: "For individual investors and high-net-worth individuals seeking selected opportunities.",
  typeCompanyDesc: "For commercial, industrial, real-estate, or operating companies seeking expansion or partnership.",
  typeFundDesc: "For funds, holding companies, family offices, and organized investment entities.",
  investmentRanges: [
    "Under $100K",
    "$100K – $500K",
    "$500K – $1M",
    "$1M – $5M",
    "$5M – $20M",
    "Over $20M",
  ],
  sectors: [
    "Real estate & development",
    "Industry",
    "Agriculture",
    "Food industries",
    "Energy",
    "Tourism",
    "Logistics",
    "Technology",
    "Multiple sectors",
  ],
  consent:
    "I agree to the privacy policy and the processing of my data to review my registration and contact me about investment opportunities.",
  note: "Creating an account does not mean automatic acceptance. Investors are approved by management before full opportunity details are unlocked.",
};

const tr: RegisterExtra = {
  visualBadge: "Yeni yatırımcı kaydı",
  visualH1a: "Şu ağa girin:",
  visualGold: "nitelikli yatırım fırsatları",
  visualLead:
    "Hesabınızı oluşturun, talebiniz yönetim tarafından incelensin; onaydan sonra uygun yatırım fırsatlarının daha geniş ayrıntılarına erişebilirsiniz.",
  stats: [
    ["Gizlilik", "kademeli paylaşım"],
    ["İnceleme", "yönetim onayı"],
    ["Fırsatlar", "sektör ve ülkeye göre"],
  ],
  formKicker: "Yatırımcı onay talebi",
  formH2: "Bilgilerinizi eksiksiz girin",
  formLead: "Tüm alanlar zorunludur. Belirsiz veya eksik hesaplar ciddi bir izlenim vermez.",
  secAccount: "1. Hesap bilgileri",
  secType: "2. Yatırımcı türü",
  secProfile: "3. Yatırım profili",
  secPassword: "4. Şifre",
  fieldCountry: "Ülke",
  fieldRange: "Beklenen yatırım büyüklüğü",
  fieldSector: "Tercih edilen sektör",
  selectPlaceholder: "Listeden seçin",
  typeIndividualDesc: "Seçkin fırsatlar arayan bireysel yatırımcılar ve yüksek varlıklı kişiler için.",
  typeCompanyDesc: "Genişleme veya ortaklık arayan ticari, sınai, gayrimenkul veya işletme şirketleri için.",
  typeFundDesc: "Fonlar, holdingler, aile ofisleri ve kurumsal yatırım kuruluşları için.",
  investmentRanges: [
    "100 bin doların altı",
    "100 bin – 500 bin dolar",
    "500 bin – 1 milyon dolar",
    "1 – 5 milyon dolar",
    "5 – 20 milyon dolar",
    "20 milyon dolardan fazla",
  ],
  sectors: [
    "Gayrimenkul ve geliştirme",
    "Sanayi",
    "Tarım",
    "Gıda sanayii",
    "Enerji",
    "Turizm",
    "Lojistik",
    "Teknoloji",
    "Birden çok sektör",
  ],
  consent:
    "Gizlilik politikasını ve kayıt talebimi incelemek ile yatırım fırsatları hakkında benimle iletişime geçmek amacıyla verilerimin işlenmesini kabul ediyorum.",
  note: "Hesap oluşturmak otomatik kabul anlamına gelmez. Fırsatların tüm ayrıntıları açılmadan önce yatırımcılar yönetim tarafından onaylanır.",
};

const zh: RegisterExtra = {
  visualBadge: "新投资者注册",
  visualH1a: "进入",
  visualGold: "合格投资机会网络",
  visualLead:
    "创建您的账户以便管理层审核您的请求；获批后您即可查看合适投资机会的更多详情。",
  stats: [
    ["保密", "分级披露"],
    ["审核", "管理层批准"],
    ["机会", "按行业和国家"],
  ],
  formKicker: "投资者审核申请",
  formH2: "请准确填写您的信息",
  formLead: "所有字段均为必填。不清晰或不完整的账户难以给人认真的印象。",
  secAccount: "1. 账户信息",
  secType: "2. 投资者类型",
  secProfile: "3. 投资概况",
  secPassword: "4. 密码",
  fieldCountry: "国家",
  fieldRange: "预期投资规模",
  fieldSector: "偏好行业",
  selectPlaceholder: "从列表中选择",
  typeIndividualDesc: "适合寻找精选机会的个人投资者及高净值人士。",
  typeCompanyDesc: "适合寻求扩张或合作的商业、工业、房地产或运营公司。",
  typeFundDesc: "适合基金、控股公司、家族办公室及有组织的投资机构。",
  investmentRanges: [
    "10 万美元以下",
    "10 万 – 50 万美元",
    "50 万 – 100 万美元",
    "100 万 – 500 万美元",
    "500 万 – 2000 万美元",
    "2000 万美元以上",
  ],
  sectors: [
    "房地产与开发",
    "工业",
    "农业",
    "食品工业",
    "能源",
    "旅游",
    "物流",
    "科技",
    "多个领域",
  ],
  consent: "我同意隐私政策，并同意为审核我的注册申请及就投资机会与我联系而处理我的数据。",
  note: "创建账户并不意味着自动通过。在解锁机会的完整详情之前，投资者需经管理层批准。",
};

export const REGISTER_X: Record<Locale, RegisterExtra> = { ar, en, tr, zh };

export function registerX(locale: Locale): RegisterExtra {
  return REGISTER_X[locale] ?? REGISTER_X.ar;
}
