// نصوص إطار التصميم الفاخر لصفحة «تواصل معنا» — أربع لغات.
// النموذج نفسه يبقى في ContactForm (محتواه عبر crm-i18n/contact-i18n).
import type { Locale } from "@/lib/i18n";

export interface ContactExtra {
  heroBadge: string;
  heroH1a: string;
  heroGold: string;
  heroLead: string;
  heroBtn1: string;
  heroBtn2: string;
  stats: [string, string][];
  reasons: { title: string; text: string }[];
  sideTitle: string;
  sideText: string;
  sideChecklistTitle: string;
  checklist: string[];
  sideEmailLabel: string;
  formKicker: string;
  formH2: string;
  formLead: string;
  ctaKicker: string;
  ctaH2: string;
  ctaLead: string;
}

const ar: ContactExtra = {
  heroBadge: "تواصل مع البركة بارتنرز",
  heroH1a: "دعنا نعرف هدفك",
  heroGold: "ونوجّهك إلى المسار المناسب",
  heroLead:
    "سواء كنت مستثمرًا، صاحب أصل، شركة تشغيل، أو جهة تبحث عن شراكة، املأ النموذج بدقة ليتم توجيه طلبك للفريق المختص.",
  heroBtn1: "أرسل طلبك الآن",
  heroBtn2: "كيف تعمل المنصة؟",
  stats: [
    ["طلب واضح", "حقول تساعد على تقييم الجدية"],
    ["توجيه صحيح", "حسب نوع الطلب والقطاع"],
    ["سرّية", "حماية بيانات التواصل"],
    ["متابعة", "من الفريق المختص"],
  ],
  reasons: [
    { title: "مستثمر يبحث عن فرصة", text: "لمن يرغب بدراسة فرص استثمارية مؤهلة حسب الدولة أو القطاع أو حجم الاستثمار." },
    { title: "صاحب فرصة أو أصل", text: "لمن يملك مشروعًا، أرضًا، مصنعًا، شركة، أو أصلًا يحتاج إلى مستثمر أو شريك تشغيل." },
    { title: "شركة تشغيل أو إدارة", text: "لمن يمتلك خبرة تشغيلية ويرغب بالتوسع إلى أسواق أو مشاريع جديدة." },
    { title: "شراكة استراتيجية", text: "للمكاتب، الشركات، المستشارين، أو الجهات التي ترغب ببناء تعاون طويل الأمد." },
  ],
  sideTitle: "لا ترسل رسالة عامة",
  sideText: "اكتب طلبك بوضوح: من أنت، ماذا تريد، وفي أي دولة أو قطاع.",
  sideChecklistTitle: "قبل أن ترسل الطلب",
  checklist: [
    "حدّد نوع الطلب بدقة.",
    "اذكر الدولة والقطاع بوضوح.",
    "اكتب حجم الاستثمار أو طبيعة الأصل.",
    "لا تضع معلومات حساسة جدًا في الرسالة الأولى.",
    "كلما كان طلبك أوضح، كانت المتابعة أسرع.",
  ],
  sideEmailLabel: "أو راسلنا مباشرة",
  formKicker: "نموذج التواصل",
  formH2: "أرسل طلبك إلى الفريق المختص",
  formLead: "املأ البيانات بشكل واضح ومباشر، وسيتم توجيه طلبك إلى الفريق المناسب.",
  ctaKicker: "البركة بارتنرز",
  ctaH2: "الطلب الواضح يحصل على متابعة أسرع",
  ctaLead: "اكتب بياناتك بجدية، وحدّد نوع الطلب، الدولة، القطاع، وحجم الفرصة أو الاستثمار.",
};

const en: ContactExtra = {
  heroBadge: "Contact Baraka Partners",
  heroH1a: "Tell us your goal",
  heroGold: "and we'll guide you to the right path",
  heroLead:
    "Whether you're an investor, an asset owner, an operating company, or seeking a partnership, fill in the form accurately so your request reaches the right team.",
  heroBtn1: "Send your request",
  heroBtn2: "How it works?",
  stats: [
    ["A clear request", "fields that help gauge seriousness"],
    ["Right routing", "by request type and sector"],
    ["Confidentiality", "your contact data protected"],
    ["Follow-up", "by the right team"],
  ],
  reasons: [
    { title: "Investor seeking an opportunity", text: "For those wanting to study qualified opportunities by country, sector, or investment size." },
    { title: "Opportunity or asset owner", text: "For those who own a project, land, factory, company, or asset that needs an investor or operating partner." },
    { title: "Operating or management company", text: "For those with operational expertise looking to expand into new markets or projects." },
    { title: "Strategic partnership", text: "For offices, companies, consultants, or entities wanting to build long-term cooperation." },
  ],
  sideTitle: "Don't send a generic message",
  sideText: "Write your request clearly: who you are, what you want, and in which country or sector.",
  sideChecklistTitle: "Before you send",
  checklist: [
    "Specify the request type precisely.",
    "State the country and sector clearly.",
    "Note the investment size or the nature of the asset.",
    "Don't put highly sensitive information in the first message.",
    "The clearer your request, the faster the follow-up.",
  ],
  sideEmailLabel: "Or email us directly",
  formKicker: "Contact form",
  formH2: "Send your request to the right team",
  formLead: "Fill in your details clearly and directly, and your request will be routed to the right team.",
  ctaKicker: "Baraka Partners",
  ctaH2: "A clear request gets a faster follow-up",
  ctaLead: "Write your details seriously, and specify the request type, country, sector, and the size of the opportunity or investment.",
};

const tr: ContactExtra = {
  heroBadge: "Baraka Partners ile iletişime geçin",
  heroH1a: "Hedefinizi bizimle paylaşın",
  heroGold: "sizi doğru yola yönlendirelim",
  heroLead:
    "İster yatırımcı, ister varlık sahibi, ister işletme şirketi olun ya da ortaklık arıyor olun, talebinizin doğru ekibe ulaşması için formu eksiksiz doldurun.",
  heroBtn1: "Talebinizi gönderin",
  heroBtn2: "Nasıl çalışır?",
  stats: [
    ["Net bir talep", "ciddiyeti ölçmeye yardımcı alanlar"],
    ["Doğru yönlendirme", "talep türü ve sektöre göre"],
    ["Gizlilik", "iletişim verileriniz korunur"],
    ["Takip", "ilgili ekip tarafından"],
  ],
  reasons: [
    { title: "Fırsat arayan yatırımcı", text: "Ülke, sektör veya yatırım büyüklüğüne göre nitelikli fırsatları değerlendirmek isteyenler için." },
    { title: "Fırsat veya varlık sahibi", text: "Yatırımcı veya işletme ortağı arayan bir projeye, araziye, fabrikaya, şirkete ya da varlığa sahip olanlar için." },
    { title: "İşletme veya yönetim şirketi", text: "Yeni pazarlara veya projelere açılmak isteyen operasyonel deneyime sahip olanlar için." },
    { title: "Stratejik ortaklık", text: "Uzun vadeli iş birliği kurmak isteyen ofisler, şirketler, danışmanlar veya kurumlar için." },
  ],
  sideTitle: "Genel bir mesaj göndermeyin",
  sideText: "Talebinizi net yazın: kim olduğunuz, ne istediğiniz ve hangi ülke veya sektörde.",
  sideChecklistTitle: "Göndermeden önce",
  checklist: [
    "Talep türünü tam olarak belirtin.",
    "Ülke ve sektörü açıkça belirtin.",
    "Yatırım büyüklüğünü veya varlığın niteliğini yazın.",
    "İlk mesaja çok hassas bilgileri koymayın.",
    "Talebiniz ne kadar net olursa, takip o kadar hızlı olur.",
  ],
  sideEmailLabel: "Ya da doğrudan e-posta gönderin",
  formKicker: "İletişim formu",
  formH2: "Talebinizi ilgili ekibe gönderin",
  formLead: "Bilgilerinizi net ve doğrudan doldurun; talebiniz uygun ekibe yönlendirilecek.",
  ctaKicker: "Baraka Partners",
  ctaH2: "Net bir talep daha hızlı takip alır",
  ctaLead: "Bilgilerinizi ciddiyetle yazın; talep türünü, ülkeyi, sektörü ve fırsat ya da yatırım büyüklüğünü belirtin.",
};

const zh: ContactExtra = {
  heroBadge: "联系 Baraka Partners",
  heroH1a: "告诉我们您的目标",
  heroGold: "我们将为您指引正确的方向",
  heroLead:
    "无论您是投资者、资产所有者、运营公司，还是正在寻求合作伙伴，请准确填写表单，以便您的请求转交给相应团队。",
  heroBtn1: "立即发送请求",
  heroBtn2: "平台如何运作？",
  stats: [
    ["清晰的请求", "便于评估认真度的字段"],
    ["正确分流", "按请求类型和行业"],
    ["保密", "保护您的联系信息"],
    ["跟进", "由相应团队负责"],
  ],
  reasons: [
    { title: "寻找机会的投资者", text: "适合希望按国家、行业或投资规模研究合格机会的人士。" },
    { title: "机会或资产所有者", text: "适合拥有需要投资者或运营伙伴的项目、土地、工厂、公司或资产的人士。" },
    { title: "运营或管理公司", text: "适合具备运营经验、希望拓展至新市场或新项目的公司。" },
    { title: "战略合作", text: "适合希望建立长期合作的事务所、公司、顾问或机构。" },
  ],
  sideTitle: "请勿发送笼统的信息",
  sideText: "请清楚写明：您是谁、您想要什么、在哪个国家或行业。",
  sideChecklistTitle: "发送之前",
  checklist: [
    "准确指明请求类型。",
    "明确说明国家和行业。",
    "写明投资规模或资产性质。",
    "请勿在首条信息中放入高度敏感的信息。",
    "您的请求越清晰，跟进就越快。",
  ],
  sideEmailLabel: "或直接发送邮件给我们",
  formKicker: "联系表单",
  formH2: "将您的请求发送给相应团队",
  formLead: "请清晰、直接地填写信息，您的请求将被转交给合适的团队。",
  ctaKicker: "Baraka Partners",
  ctaH2: "清晰的请求会获得更快的跟进",
  ctaLead: "请认真填写您的信息，并指明请求类型、国家、行业以及机会或投资规模。",
};

export const CONTACT_X: Record<Locale, ContactExtra> = { ar, en, tr, zh };

export function contactX(locale: Locale): ContactExtra {
  return CONTACT_X[locale] ?? CONTACT_X.ar;
}
