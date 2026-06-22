// نصوص إطار التصميم الفاخر لصفحة «تسجيل الدخول» — أربع لغات.
import type { Locale } from "@/lib/i18n";

export interface LoginExtra {
  visualBadge: string;
  visualH1a: string;
  visualGold: string;
  visualLead: string;
  benefits: string[];
  formH2: string;
  formLead: string;
  securityNotice: string;
  ownerQ: string;
  ownerCreate: string;
  stats: [string, string][];
  mobileTitle: string;
  mobileSub: string;
}

const ar: LoginExtra = {
  visualBadge: "بوابة الدخول الآمنة",
  visualH1a: "تابع فرصك",
  visualGold: "من داخل منصة البركة بارتنرز",
  visualLead:
    "سجّل الدخول للوصول إلى حسابك، متابعة الفرص، طلب التفاصيل، وإدارة تواصلك مع فريق المنصة ضمن مسار منظّم وسري.",
  benefits: [
    "الوصول إلى الفرص المؤهلة بعد الاعتماد",
    "متابعة طلبات الاهتمام والتفاصيل",
    "حماية بيانات المستثمر وصاحب الفرصة",
    "تواصل منظّم مع فريق البركة بارتنرز",
  ],
  formH2: "تسجيل الدخول",
  formLead: "أدخل بياناتك للوصول إلى حسابك ومتابعة الفرص الاستثمارية.",
  securityNotice:
    "تنبيه أمني: لا تشارك بيانات الدخول مع أي طرف. فريق البركة بارتنرز لا يطلب كلمة المرور عبر الهاتف أو الرسائل.",
  ownerQ: "صاحب مشروع أو أصل؟",
  ownerCreate: "إنشاء حساب صاحب فرصة",
  stats: [
    ["سرّية", "بيانات محمية"],
    ["اعتماد", "حسب نوع الحساب"],
    ["متابعة", "من داخل المنصة"],
  ],
  mobileTitle: "ادخل إلى حسابك",
  mobileSub: "تابع الفرص وطلباتك من داخل منصة البركة بارتنرز.",
};

const en: LoginExtra = {
  visualBadge: "Secure login gateway",
  visualH1a: "Follow your opportunities",
  visualGold: "from inside the Baraka Partners platform",
  visualLead:
    "Sign in to access your account, follow opportunities, request details, and manage your communication with the platform team within an organized, confidential path.",
  benefits: [
    "Access qualified opportunities after approval",
    "Track interest requests and details",
    "Protection of investor and opportunity-owner data",
    "Organized communication with the Baraka Partners team",
  ],
  formH2: "Sign in",
  formLead: "Enter your details to access your account and follow investment opportunities.",
  securityNotice:
    "Security notice: Never share your login details with anyone. The Baraka Partners team will never ask for your password by phone or message.",
  ownerQ: "Project or asset owner?",
  ownerCreate: "Create an opportunity-owner account",
  stats: [
    ["Confidentiality", "protected data"],
    ["Approval", "by account type"],
    ["Follow-up", "inside the platform"],
  ],
  mobileTitle: "Sign in to your account",
  mobileSub: "Follow opportunities and your requests from inside the Baraka Partners platform.",
};

const tr: LoginExtra = {
  visualBadge: "Güvenli giriş kapısı",
  visualH1a: "Fırsatlarınızı takip edin",
  visualGold: "Baraka Partners platformunun içinden",
  visualLead:
    "Hesabınıza erişmek, fırsatları takip etmek, ayrıntı istemek ve platform ekibiyle iletişiminizi düzenli ve gizli bir akışta yönetmek için giriş yapın.",
  benefits: [
    "Onaydan sonra nitelikli fırsatlara erişim",
    "İlgi taleplerini ve ayrıntıları takip",
    "Yatırımcı ve fırsat sahibi verilerinin korunması",
    "Baraka Partners ekibiyle düzenli iletişim",
  ],
  formH2: "Giriş yap",
  formLead: "Hesabınıza erişmek ve yatırım fırsatlarını takip etmek için bilgilerinizi girin.",
  securityNotice:
    "Güvenlik uyarısı: Giriş bilgilerinizi kimseyle paylaşmayın. Baraka Partners ekibi şifrenizi telefonla veya mesajla asla istemez.",
  ownerQ: "Proje veya varlık sahibi mi?",
  ownerCreate: "Fırsat sahibi hesabı oluştur",
  stats: [
    ["Gizlilik", "korunan veriler"],
    ["Onay", "hesap türüne göre"],
    ["Takip", "platform içinden"],
  ],
  mobileTitle: "Hesabınıza giriş yapın",
  mobileSub: "Fırsatları ve taleplerinizi Baraka Partners platformunun içinden takip edin.",
};

const zh: LoginExtra = {
  visualBadge: "安全登录入口",
  visualH1a: "跟进您的机会",
  visualGold: "在 Baraka Partners 平台内",
  visualLead:
    "登录以访问您的账户、跟进机会、索取详情，并在有序且保密的流程中管理您与平台团队的沟通。",
  benefits: [
    "获批后访问合格机会",
    "跟踪意向请求与详情",
    "保护投资者与机会方的数据",
    "与 Baraka Partners 团队的有序沟通",
  ],
  formH2: "登录",
  formLead: "输入您的信息以访问账户并跟进投资机会。",
  securityNotice:
    "安全提示：请勿与任何人分享您的登录信息。Baraka Partners 团队绝不会通过电话或短信索取您的密码。",
  ownerQ: "项目或资产所有者？",
  ownerCreate: "创建机会方账户",
  stats: [
    ["保密", "数据受保护"],
    ["审核", "按账户类型"],
    ["跟进", "在平台内"],
  ],
  mobileTitle: "登录您的账户",
  mobileSub: "在 Baraka Partners 平台内跟进机会与您的请求。",
};

export const LOGIN_X: Record<Locale, LoginExtra> = { ar, en, tr, zh };

export function loginX(locale: Locale): LoginExtra {
  return LOGIN_X[locale] ?? LOGIN_X.ar;
}
