// نصوص واجهة قسم «وجهات الاستثمار» الثابتة (غير المخزّنة في قاعدة البيانات):
// مسار التنقّل، عناوين افتراضية للأقسام، أزرار، ونموذج التواصل — بأربع لغات.
// محتوى الصفحات نفسه (العناوين والنقاط والأسئلة) يأتي من قاعدة البيانات لكل لغة.
// وحدة بيانات خالصة (تُستورد في الخادم والعميل) — لا تعتمد على next/headers.
import type { Locale } from "@/lib/i18n";

export interface DestUi {
  breadcrumbHome: string;
  hub: string;
  hubLead: string;
  hubMetaDesc: string;
  hubEmpty: string;
  explore: string;
  contactCta: string;
  whyInvest: string;
  keySectors: string;
  opportunityTypes: string;
  investorNotes: string;
  faqTitle: string;
  oppsTitlePrefix: string; // يُلحق به اسم الدولة
  oppsEmpty: string;
  oppView: string;
  disclaimerTitle: string;
  disclaimerDefault: string;
  // النموذج
  formTitle: string;
  fName: string;
  fEmail: string;
  fPhone: string;
  fCountry: string;
  fInvestorType: string;
  typeIndividual: string;
  typeCompany: string;
  typeFund: string;
  fInterestCountry: string;
  fSector: string;
  fSize: string;
  fMessage: string;
  fSubmit: string;
  fSubmitting: string;
  fSuccess: string;
  fError: string;
  selectPlaceholder: string;
  optional: string;
}

export const DEST_UI: Record<Locale, DestUi> = {
  ar: {
    breadcrumbHome: "الرئيسية",
    hub: "وجهات الاستثمار",
    hubLead:
      "معلومات أولية ومنظّمة عن بيئة الاستثمار في عدّة دول ومناطق، تساعدك على فهم الفرص المتاحة عبر منصة البركة بارتنرز.",
    hubMetaDesc:
      "استكشف وجهات الاستثمار عبر البركة بارتنرز: تركيا وسوريا والاتحاد الأوروبي وقبرص ومصر والأردن — معلومات أولية وفرص استثمارية في كل دولة.",
    hubEmpty: "لا توجد وجهات منشورة حالياً.",
    explore: "استكشف الفرص",
    contactCta: "تواصل معنا",
    whyInvest: "لماذا الاستثمار في هذه الدولة؟",
    keySectors: "القطاعات الاستثمارية الواعدة",
    opportunityTypes: "أنواع الفرص الاستثمارية المتاحة",
    investorNotes: "معلومات أولية للمستثمر",
    faqTitle: "أسئلة شائعة",
    oppsTitlePrefix: "فرص استثمارية متاحة في",
    oppsEmpty:
      "لا توجد فرص منشورة حالياً في هذه الدولة. يمكنكم التواصل معنا لمعرفة الفرص قيد المراجعة.",
    oppView: "عرض التفاصيل",
    disclaimerTitle: "تنبيه",
    disclaimerDefault:
      "المعلومات الواردة في هذه الصفحة هي معلومات عامة وأولية لأغراض تعريفية فقط، ولا تشكل استشارة قانونية أو مالية أو ضريبية. يجب على المستثمر الحصول على استشارة متخصصة قبل اتخاذ أي قرار استثماري.",
    formTitle: "هل ترغب بدراسة فرص استثمارية في هذه الدولة؟",
    fName: "الاسم",
    fEmail: "البريد الإلكتروني",
    fPhone: "رقم الهاتف / واتساب",
    fCountry: "دولتك",
    fInvestorType: "نوع المستثمر",
    typeIndividual: "فرد",
    typeCompany: "شركة",
    typeFund: "صندوق",
    fInterestCountry: "الدولة التي تهتم بها",
    fSector: "القطاع المطلوب",
    fSize: "حجم الاستثمار التقريبي",
    fMessage: "رسالتك",
    fSubmit: "إرسال الطلب",
    fSubmitting: "جارٍ الإرسال...",
    fSuccess: "تم استلام طلبك. سيتواصل معك فريق البركة بارتنرز قريباً.",
    fError: "تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى.",
    selectPlaceholder: "اختر...",
    optional: "(اختياري)",
  },
  en: {
    breadcrumbHome: "Home",
    hub: "Investment Destinations",
    hubLead:
      "Preliminary, structured information about the investment environment across several countries and regions, to help you understand the opportunities available through Baraka Partners.",
    hubMetaDesc:
      "Explore investment destinations with Baraka Partners: Turkey, Syria, the European Union, Cyprus, Egypt and Jordan — preliminary insights and investment opportunities in each country.",
    hubEmpty: "No destinations are published yet.",
    explore: "Explore opportunities",
    contactCta: "Contact us",
    whyInvest: "Why invest in this country?",
    keySectors: "Promising investment sectors",
    opportunityTypes: "Types of available opportunities",
    investorNotes: "Preliminary notes for investors",
    faqTitle: "Frequently asked questions",
    oppsTitlePrefix: "Investment opportunities in",
    oppsEmpty:
      "There are no published opportunities in this country yet. Contact us to learn about opportunities currently under review.",
    oppView: "View details",
    disclaimerTitle: "Disclaimer",
    disclaimerDefault:
      "The information on this page is general and preliminary, for informational purposes only, and does not constitute legal, financial, or tax advice. Investors should obtain specialized advice before making any investment decision.",
    formTitle: "Would you like to explore investment opportunities in this country?",
    fName: "Name",
    fEmail: "Email",
    fPhone: "Phone / WhatsApp",
    fCountry: "Your country",
    fInvestorType: "Investor type",
    typeIndividual: "Individual",
    typeCompany: "Company",
    typeFund: "Fund",
    fInterestCountry: "Country of interest",
    fSector: "Sector of interest",
    fSize: "Approximate investment size",
    fMessage: "Your message",
    fSubmit: "Send request",
    fSubmitting: "Sending...",
    fSuccess: "Your request has been received. The Baraka Partners team will contact you soon.",
    fError: "Could not send the request. Please try again.",
    selectPlaceholder: "Select...",
    optional: "(optional)",
  },
  tr: {
    breadcrumbHome: "Ana Sayfa",
    hub: "Yatırım Destinasyonları",
    hubLead:
      "Birkaç ülke ve bölgedeki yatırım ortamı hakkında ön bilgiler — Baraka Partners aracılığıyla mevcut fırsatları anlamanıza yardımcı olur.",
    hubMetaDesc:
      "Baraka Partners ile yatırım destinasyonlarını keşfedin: Türkiye, Suriye, Avrupa Birliği, Kıbrıs, Mısır ve Ürdün — her ülkede ön bilgiler ve yatırım fırsatları.",
    hubEmpty: "Henüz yayınlanmış destinasyon yok.",
    explore: "Fırsatları keşfet",
    contactCta: "Bize ulaşın",
    whyInvest: "Bu ülkede neden yatırım yapmalı?",
    keySectors: "Gelecek vaat eden yatırım sektörleri",
    opportunityTypes: "Mevcut fırsat türleri",
    investorNotes: "Yatırımcılar için ön notlar",
    faqTitle: "Sıkça sorulan sorular",
    oppsTitlePrefix: "Yatırım fırsatları:",
    oppsEmpty:
      "Bu ülkede henüz yayınlanmış fırsat yok. İncelemedeki fırsatlar hakkında bilgi almak için bizimle iletişime geçin.",
    oppView: "Ayrıntıları gör",
    disclaimerTitle: "Uyarı",
    disclaimerDefault:
      "Bu sayfadaki bilgiler genel ve ön niteliktedir, yalnızca bilgilendirme amaçlıdır ve hukuki, mali veya vergisel danışmanlık teşkil etmez. Yatırımcılar herhangi bir yatırım kararı vermeden önce uzman danışmanlık almalıdır.",
    formTitle: "Bu ülkede yatırım fırsatlarını değerlendirmek ister misiniz?",
    fName: "Ad Soyad",
    fEmail: "E-posta",
    fPhone: "Telefon / WhatsApp",
    fCountry: "Ülkeniz",
    fInvestorType: "Yatırımcı türü",
    typeIndividual: "Bireysel",
    typeCompany: "Şirket",
    typeFund: "Fon",
    fInterestCountry: "İlgilendiğiniz ülke",
    fSector: "İlgilendiğiniz sektör",
    fSize: "Yaklaşık yatırım büyüklüğü",
    fMessage: "Mesajınız",
    fSubmit: "Talebi gönder",
    fSubmitting: "Gönderiliyor...",
    fSuccess: "Talebiniz alındı. Baraka Partners ekibi en kısa sürede sizinle iletişime geçecek.",
    fError: "Talep gönderilemedi. Lütfen tekrar deneyin.",
    selectPlaceholder: "Seçin...",
    optional: "(isteğe bağlı)",
  },
  zh: {
    breadcrumbHome: "首页",
    hub: "投资目的地",
    hubLead:
      "关于多个国家和地区投资环境的初步、结构化信息，帮助您了解通过 Baraka Partners 可获得的投资机会。",
    hubMetaDesc:
      "通过 Baraka Partners 探索投资目的地：土耳其、叙利亚、欧盟、塞浦路斯、埃及和约旦——每个国家的初步信息与投资机会。",
    hubEmpty: "暂无已发布的目的地。",
    explore: "探索机会",
    contactCta: "联系我们",
    whyInvest: "为什么在该国投资？",
    keySectors: "有前景的投资行业",
    opportunityTypes: "可参与的机会类型",
    investorNotes: "投资者初步须知",
    faqTitle: "常见问题",
    oppsTitlePrefix: "投资机会：",
    oppsEmpty:
      "该国目前暂无已发布的机会。欢迎联系我们了解正在审核中的机会。",
    oppView: "查看详情",
    disclaimerTitle: "免责声明",
    disclaimerDefault:
      "本页信息为一般性初步信息，仅供参考，不构成法律、财务或税务建议。投资者在做出任何投资决定前应寻求专业咨询。",
    formTitle: "您是否希望了解该国的投资机会？",
    fName: "姓名",
    fEmail: "电子邮箱",
    fPhone: "电话 / WhatsApp",
    fCountry: "您所在的国家",
    fInvestorType: "投资者类型",
    typeIndividual: "个人",
    typeCompany: "公司",
    typeFund: "基金",
    fInterestCountry: "您感兴趣的国家",
    fSector: "感兴趣的行业",
    fSize: "大致投资规模",
    fMessage: "您的留言",
    fSubmit: "提交请求",
    fSubmitting: "提交中...",
    fSuccess: "我们已收到您的请求，Baraka Partners 团队将尽快与您联系。",
    fError: "提交失败，请重试。",
    selectPlaceholder: "请选择...",
    optional: "（选填）",
  },
};

export function destUi(locale: Locale): DestUi {
  return DEST_UI[locale] ?? DEST_UI.en;
}
