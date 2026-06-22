/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toVersion } from "@/lib/opportunity";
import { localizeOppVersion, localizeOppSector, localizeOppCountry, parseOppTranslations } from "@/lib/opp-i18n";
import { coverOrIllustrative } from "@/lib/sector-image";
import { getLocale } from "@/lib/i18n-server";
import { localeHref, shouldLocalizePath, isLocale, DEFAULT_LOCALE, dir } from "@/lib/i18n";
import { pageMetadata, clampDescription, organizationLd, websiteLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getDestinationCards, destPath } from "@/lib/destinations";
import { HOME_X } from "@/lib/home-extra";
import HomeQuickForm from "./HomeQuickForm";

export const dynamic = "force-dynamic";

// صور القطاعات (بترتيب C.sectors) من مكتبة صور القطاعات.
const SECTOR_IMAGES = [
  "/destinations/sectors/realestate.jpg",
  "/destinations/sectors/industry.jpg",
  "/destinations/sectors/agriculture.jpg",
  "/destinations/sectors/food.jpg",
  "/destinations/sectors/energy.jpg",
  "/destinations/sectors/tourism.jpg",
  "/destinations/sectors/logistics.jpg",
  "/destinations/sectors/technology.jpg",
];

function fmtRange(min: bigint | null, max: bigint | null, cur: string) {
  if (!min && !max) return null;
  const f = (n: bigint) => Number(n).toLocaleString("en-US");
  return `${min ? f(min) : "?"} – ${max ? f(max) : "?"} ${cur}`;
}

// ===== محتوى الصفحة متعدّد اللغات =====
const C = {
  ar: {
    brand: "شركاء البركة",
    brandSub: "BARAKA PARTNERS",
    heroTag: "منصة استثمارية تديرها شركة عهد البركة",
    heroH1a: "نربط", heroH1gold: "رأس المال الدولي", heroH1b: "بالفرص الحقيقية المدروسة",
    heroLead: "منصة استثمار وتشغيل تربط رأس المال الجاد بالفرص الواعدة في عدة دول وقطاعات، وتدعم المستثمرين وأصحاب المشاريع عبر مسار منظم يشمل هيكلة الشراكات، إدارة المشاريع، وتوفير مشغلين محترفين قادرين على نقل الخبرة وتحويل الفرص إلى مشاريع قابلة للنمو والتنفيذ.",
    heroBtn1: "أنا مستثمر — استعرض الفرص", heroBtn2: "لديّ فرصة أو أصل استثماري",
    trust: [
      { n: "+8", l: "قطاعات استثمارية" },
      { n: "عالمي", l: "نطاق دولي للفرص" },
      { n: "100%", l: "سرية وحوكمة" },
      { n: "USD", l: "عملة موحدة للتقييم" },
    ],
    pathsKicker: "مساران واضحان",
    pathsTitle: "أينما كان موقعك في الصفقة، نحن نمهّد الطريق",
    invTitle: "للمستثمرين",
    invDesc: "فرص مؤهّلة ومصنّفة بعناية، معروضة بطريقة مختصرة وآمنة. تستعرض ما يناسب اهتماماتك وتتقدم بطلب الاطلاع على التفاصيل الكاملة.",
    invList: ["فرص مدروسة ومراجَعة قبل العرض", "فلترة حسب القطاع والدولة وحجم الاستثمار", "تفاصيل كاملة بعد اعتماد طلبك", "تواصل وإدارة العلاقة عبر فريق متخصص"],
    invBtn: "سجّل كمستثمر",
    ownTitle: "لأصحاب الفرص والمشاريع",
    ownDesc: "تملك أرضاً أو مصنعاً أو شركة قائمة أو مشروع توسع؟ نساعدك على تحويل فرصتك إلى ملف استثماري احترافي وعرضها على المستثمرين المناسبين.",
    ownList: ["تأهيل الفرصة وإعداد ملفها الاستثماري", "وصول إلى شبكة مستثمرين دوليين", "حماية كاملة لبياناتك وهويتك", "متابعة الصفقة حتى مرحلة التفاوض"],
    ownBtn: "قدّم فرصتك",
    howKicker: "رحلة بسيطة وموثوقة", howTitle: "كيف تعمل المنصة", howSub: "من الفكرة إلى الشراكة، خطوات واضحة تحفظ حقوق الجميع.",
    steps: [
      { h: "التسجيل والتأهيل", p: "سجّل حسابك كمستثمر أو صاحب فرصة، وقدّم بياناتك ليبدأ فريقنا بمراجعتها." },
      { h: "الإعداد والتصنيف", p: "نراجع الفرص ونصنّف جاهزيتها، ونعدّ لها ملفاً استثمارياً مختصراً وآمناً." },
      { h: "الربط والاهتمام", p: "نعرض الفرص على المستثمرين المناسبين، وتُبدي اهتمامك بما يلائم استراتيجيتك." },
      { h: "التفاوض والإغلاق", p: "بعد اعتماد الطلب تُكشف التفاصيل، ونرافقك حتى مرحلة التفاوض وإتمام الصفقة." },
    ],
    oppsKicker: "مختارات من الفرص", oppsTitle: "فرص استثمارية متاحة الآن", oppsSub: "عرض مختصر للفرص المؤهلة. سجّل دخولك للاطلاع على المزيد من التفاصيل.",
    oppStatus: "منشورة", oppRangeLabel: "نطاق الاستثمار المطلوب", oppInterest: "إبداء اهتمام ←", oppsAll: "استعرض جميع الفرص", oppsEmpty: "فرص جديدة قيد الإعداد — سجّل لتكون أول من يطّلع عليها.",
    secKicker: "قطاعات متنوعة", secTitle: "نستقبل الفرص في أبرز القطاعات الاستثمارية",
    sectors: ["العقار والتطوير", "الصناعة والمصانع", "الزراعة والأراضي", "الصناعات الغذائية", "الطاقة المتجددة", "السياحة والفنادق", "اللوجستيات", "التكنولوجيا والفنتك"],
    confTitleA: "السرية والحوكمة",
    confP: "نحن لا نعرض فرصاً فقط، بل ندير علاقة قائمة على الثقة. تبقى التفاصيل الحساسة محمية حتى تكتمل شروط الجدية والاعتماد، حمايةً لحقوق أصحاب المشاريع والمستثمرين معاً.",
    confBtn: "تعرّف على نهجنا",
    conf: [
      { h: "عرض مختصر آمن", p: "تظهر الفرصة بشكل مجهّل دون كشف الهوية أو الموقع الدقيق." },
      { h: "اتفاقية لكل فرصة", p: "تُكشف التفاصيل الكاملة بعد توقيع اتفاقية السرية الخاصة بالفرصة." },
      { h: "عرض داخل المنصة", p: "الملفات الحساسة تُشاهَد داخل المنصة فقط لحماية المحتوى." },
      { h: "مراجعة بشرية", p: "كل فرصة تُراجَع وتُؤهَّل من فريقنا قبل عرضها على المستثمرين." },
    ],
    ctaTitle: "ابدأ رحلتك مع شركاء البركة", ctaSub: "انضم إلى منصة تجمع بين الجدية والاحترافية والثقة.", ctaBtn1: "سجّل كمستثمر", ctaBtn2: "قدّم فرصتك الاستثمارية",
    faqKicker: "أسئلة شائعة", faqTitle: "إجابات على أكثر ما يُسأل",
    faq: [
      { q: "هل عرض فرصتي يعني كشف بياناتي للجميع؟", a: "لا. تبقى بياناتك وهويتك محمية، ولا يظهر للعامة سوى عرض مختصر ومجهّل. التفاصيل تُكشف فقط ضمن إطار محكوم وبعد استيفاء شروط السرية." },
      { q: "من أي الدول تقبلون الفرص والمستثمرين؟", a: "نستقبل الفرص الاستثمارية والمستثمرين من مختلف الدول، ضمن القطاعات المعتمدة لدينا، مع تقييم موحّد بالدولار الأمريكي." },
      { q: "كيف أبدأ كمستثمر؟", a: "أنشئ حسابك، استعرض الفرص المختصرة المتاحة، وأبدِ اهتمامك بما يناسبك. بعد مراجعة طلبك تُفتح لك التفاصيل الكاملة." },
      { q: "هل تشمل المنصة قطاعات محددة؟", a: "نعم، نركّز على قطاعات العقار والصناعة والزراعة والصناعات الغذائية والطاقة والسياحة واللوجستيات والتكنولوجيا." },
    ],
  },
  en: {
    brand: "Baraka Partners",
    brandSub: "BARAKA PARTNERS",
    heroTag: "An investment platform managed by Ahd Al-Baraka",
    heroH1a: "Connecting", heroH1gold: "global capital", heroH1b: "to vetted, real opportunities",
    heroLead: "An investment and operations platform that connects serious capital with promising opportunities across multiple countries and sectors, and supports investors and project owners through a structured process spanning partnership structuring, project management, and the provision of professional operators capable of transferring expertise and turning opportunities into scalable, executable projects.",
    heroBtn1: "I'm an investor — browse opportunities", heroBtn2: "I have an opportunity or asset",
    trust: [
      { n: "8+", l: "Investment sectors" },
      { n: "Global", l: "International deal reach" },
      { n: "100%", l: "Confidentiality & governance" },
      { n: "USD", l: "Unified valuation currency" },
    ],
    pathsKicker: "Two clear paths",
    pathsTitle: "Wherever you stand in the deal, we pave the way",
    invTitle: "For investors",
    invDesc: "Carefully qualified and classified opportunities, presented in a concise, secure way. Review what fits your interests and request full details.",
    invList: ["Opportunities vetted before listing", "Filter by sector, country, and deal size", "Full details after your request is approved", "Relationship managed by a dedicated team"],
    invBtn: "Sign up as an investor",
    ownTitle: "For owners & projects",
    ownDesc: "Own land, a factory, an operating company, or an expansion project? We help turn your opportunity into a professional investment dossier and present it to the right investors.",
    ownList: ["Qualify the opportunity and prepare its dossier", "Reach a network of international investors", "Full protection of your data and identity", "Deal follow-up through the negotiation stage"],
    ownBtn: "Submit your opportunity",
    howKicker: "A simple, trusted journey", howTitle: "How the platform works", howSub: "From idea to partnership — clear steps that protect everyone's rights.",
    steps: [
      { h: "Register & qualify", p: "Create your account as an investor or owner and submit your details for our team to review." },
      { h: "Prepare & classify", p: "We review opportunities, classify their readiness, and prepare a concise, secure dossier." },
      { h: "Match & interest", p: "We present opportunities to the right investors, and you express interest in what fits your strategy." },
      { h: "Negotiate & close", p: "After approval the details are revealed, and we accompany you through negotiation and closing." },
    ],
    oppsKicker: "Selected opportunities", oppsTitle: "Opportunities available now", oppsSub: "A concise view of qualified opportunities. Log in for more details.",
    oppStatus: "Published", oppRangeLabel: "Investment range", oppInterest: "Express interest →", oppsAll: "Browse all opportunities", oppsEmpty: "New opportunities are being prepared — sign up to be first to see them.",
    secKicker: "Diverse sectors", secTitle: "We accept opportunities across leading sectors",
    sectors: ["Real estate", "Industry & factories", "Agriculture & land", "Food industries", "Renewable energy", "Tourism & hotels", "Logistics", "Technology & fintech"],
    confTitleA: "Confidentiality & governance",
    confP: "We don't just list opportunities — we manage a relationship built on trust. Sensitive details stay protected until seriousness and approval are confirmed, safeguarding the rights of owners and investors alike.",
    confBtn: "Learn about our approach",
    conf: [
      { h: "Secure concise view", p: "The opportunity appears anonymized, without revealing identity or exact location." },
      { h: "An agreement per opportunity", p: "Full details are revealed after signing the opportunity's confidentiality agreement." },
      { h: "In-platform viewing", p: "Sensitive files are viewed only inside the platform to protect the content." },
      { h: "Human review", p: "Every opportunity is reviewed and qualified by our team before it reaches investors." },
    ],
    ctaTitle: "Start your journey with Baraka Partners", ctaSub: "Join a platform that combines seriousness, professionalism, and trust.", ctaBtn1: "Sign up as an investor", ctaBtn2: "Submit your opportunity",
    faqKicker: "FAQ", faqTitle: "Answers to the most asked questions",
    faq: [
      { q: "Does listing my opportunity mean exposing my data to everyone?", a: "No. Your data and identity stay protected, and the public sees only a concise, anonymized view. Details are revealed only within a governed framework after confidentiality terms are met." },
      { q: "Which countries do you accept opportunities and investors from?", a: "We welcome opportunities and investors from many countries, within our approved sectors, with a unified valuation in US dollars." },
      { q: "How do I start as an investor?", a: "Create your account, browse the concise opportunities available, and express interest in what suits you. After review, full details open up to you." },
      { q: "Does the platform focus on specific sectors?", a: "Yes — real estate, industry, agriculture, food, energy, tourism, logistics, and technology." },
    ],
  },
  zh: {
    brand: "巴拉卡合伙人",
    brandSub: "BARAKA PARTNERS",
    heroTag: "由 Ahd Al-Baraka 公司运营的投资平台",
    heroH1a: "连接", heroH1gold: "国际资本", heroH1b: "与经过审核的真实机会",
    heroLead: "一个投资与运营平台，将有诚意的资本与多个国家和行业中富有前景的机会对接，并通过规范化的流程为投资者和项目方提供支持——涵盖合作架构设计、项目管理，以及引入能够传递经验、将机会转化为可成长、可落地项目的专业运营方。",
    heroBtn1: "我是投资者 — 浏览机会", heroBtn2: "我有项目或投资资产",
    trust: [
      { n: "8+", l: "投资领域" },
      { n: "全球", l: "国际机会覆盖" },
      { n: "100%", l: "保密与治理" },
      { n: "USD", l: "统一估值货币" },
    ],
    pathsKicker: "两条清晰路径",
    pathsTitle: "无论您处于交易的哪一方，我们都为您铺路",
    invTitle: "面向投资者",
    invDesc: "精心筛选并分类的机会，以简洁、安全的方式呈现。浏览符合您兴趣的内容，并申请查看完整详情。",
    invList: ["上线前已审核的机会", "按行业、国家和投资规模筛选", "申请通过后查看完整详情", "由专业团队管理关系"],
    invBtn: "注册为投资者",
    ownTitle: "面向项目方",
    ownDesc: "拥有土地、工厂、运营中的公司或扩张项目？我们帮助您将机会转化为专业的投资档案，并呈现给合适的投资者。",
    ownList: ["对机会进行资格审核并准备档案", "触达国际投资者网络", "全面保护您的数据与身份", "跟进交易直至谈判阶段"],
    ownBtn: "提交您的机会",
    howKicker: "简单而可信的流程", howTitle: "平台如何运作", howSub: "从构想到合作——清晰的步骤，保障各方权益。",
    steps: [
      { h: "注册与审核", p: "以投资者或项目方身份创建账户，并提交资料供我们团队审核。" },
      { h: "准备与分类", p: "我们审核机会、评估其成熟度，并准备简洁、安全的投资档案。" },
      { h: "匹配与意向", p: "我们将机会呈现给合适的投资者，您可对符合策略的机会表达意向。" },
      { h: "谈判与成交", p: "申请通过后揭示详情，我们陪伴您完成谈判与交易。" },
    ],
    oppsKicker: "精选机会", oppsTitle: "当前可投资的机会", oppsSub: "合格机会的简要展示。登录以查看更多详情。",
    oppStatus: "已发布", oppRangeLabel: "所需投资区间", oppInterest: "表达意向 →", oppsAll: "浏览全部机会", oppsEmpty: "新机会正在准备中——立即注册，第一时间获取。",
    secKicker: "多元领域", secTitle: "我们接受各主要投资领域的机会",
    sectors: ["房地产与开发", "工业与工厂", "农业与土地", "食品工业", "可再生能源", "旅游与酒店", "物流", "科技与金融科技"],
    confTitleA: "保密与治理",
    confP: "我们不只是展示机会，而是经营一段建立在信任之上的关系。在确认认真意向与审核通过之前，敏感信息始终受到保护，以保障项目方与投资者双方的权益。",
    confBtn: "了解我们的方式",
    conf: [
      { h: "安全的简要展示", p: "机会以匿名方式呈现，不泄露身份或精确位置。" },
      { h: "每个机会一份协议", p: "签署该机会的保密协议后，方可获得完整详情。" },
      { h: "平台内查看", p: "敏感文件仅在平台内查看，以保护内容。" },
      { h: "人工审核", p: "每个机会在呈现给投资者前，都经过我们团队的审核与资格认定。" },
    ],
    ctaTitle: "与巴拉卡合伙人开启您的旅程", ctaSub: "加入一个兼具认真、专业与信任的平台。", ctaBtn1: "注册为投资者", ctaBtn2: "提交您的投资机会",
    faqKicker: "常见问题", faqTitle: "最常被问到的问题解答",
    faq: [
      { q: "展示我的机会是否意味着向所有人公开我的数据？", a: "不会。您的数据与身份始终受保护，公众仅能看到简要、匿名的展示。详情仅在受治理的框架内、且满足保密条件后才会揭示。" },
      { q: "你们接受来自哪些国家的机会和投资者？", a: "我们欢迎来自多个国家的机会与投资者，涵盖我们认可的领域，并以美元进行统一估值。" },
      { q: "作为投资者我该如何开始？", a: "创建账户，浏览可用的简要机会，并对适合您的机会表达意向。审核后，完整详情将向您开放。" },
      { q: "平台是否专注于特定领域？", a: "是的——房地产、工业、农业、食品、能源、旅游、物流与科技。" },
    ],
  },
  tr: {
    brand: "Baraka Partners",
    brandSub: "BARAKA PARTNERS",
    heroTag: "Ahd Al-Baraka şirketi tarafından işletilen bir yatırım platformu",
    heroH1a: "Uluslararası sermayeyi", heroH1gold: "gerçek, incelenmiş fırsatlara", heroH1b: "bağlıyoruz",
    heroLead: "Ciddi sermayeyi farklı ülke ve sektörlerdeki gelecek vaat eden fırsatlarla buluşturan; yatırımcıları ve proje sahiplerini ortaklık yapılandırması, proje yönetimi ve uzmanlık aktararak fırsatları büyümeye ve uygulamaya hazır projelere dönüştürebilen profesyonel işletmecilerin sağlanmasını kapsayan yapılandırılmış bir süreçle destekleyen bir yatırım ve işletme platformu.",
    heroBtn1: "Yatırımcıyım — fırsatları incele", heroBtn2: "Bir fırsatım ya da varlığım var",
    trust: [
      { n: "8+", l: "Yatırım sektörü" },
      { n: "Küresel", l: "Uluslararası erişim" },
      { n: "100%", l: "Gizlilik ve yönetişim" },
      { n: "USD", l: "Birleşik değerleme birimi" },
    ],
    pathsKicker: "İki net yol",
    pathsTitle: "İşlemin neresinde olursanız olun, yolu biz açarız",
    invTitle: "Yatırımcılar için",
    invDesc: "Özenle nitelendirilmiş ve sınıflandırılmış fırsatlar, kısa ve güvenli bir şekilde sunulur. İlginize uyanları inceleyin ve tüm ayrıntılar için talepte bulunun.",
    invList: ["Listelenmeden önce incelenen fırsatlar", "Sektör, ülke ve yatırım büyüklüğüne göre filtreleme", "Talebiniz onaylandıktan sonra tüm ayrıntılar", "Özel bir ekip tarafından ilişki yönetimi"],
    invBtn: "Yatırımcı olarak kaydol",
    ownTitle: "Fırsat ve proje sahipleri için",
    ownDesc: "Araziniz, fabrikanız, faaliyetteki bir şirketiniz veya genişleme projeniz mi var? Fırsatınızı profesyonel bir yatırım dosyasına dönüştürüp doğru yatırımcılara sunmanıza yardımcı oluyoruz.",
    ownList: ["Fırsatı niteleyip dosyasını hazırlama", "Uluslararası yatırımcı ağına erişim", "Verilerinizin ve kimliğinizin tam korunması", "Müzakere aşamasına kadar takip"],
    ownBtn: "Fırsatınızı sunun",
    howKicker: "Basit ve güvenilir bir yolculuk", howTitle: "Platform nasıl çalışır", howSub: "Fikirden ortaklığa — herkesin haklarını koruyan net adımlar.",
    steps: [
      { h: "Kayıt ve niteleme", p: "Yatırımcı veya sahip olarak hesabınızı oluşturun ve ekibimizin incelemesi için bilgilerinizi gönderin." },
      { h: "Hazırlık ve sınıflandırma", p: "Fırsatları inceler, hazırlık düzeyini sınıflandırır ve kısa, güvenli bir dosya hazırlarız." },
      { h: "Eşleştirme ve ilgi", p: "Fırsatları doğru yatırımcılara sunarız ve stratejinize uyanlara ilgi gösterirsiniz." },
      { h: "Müzakere ve kapanış", p: "Onaydan sonra ayrıntılar açıklanır ve müzakere ile kapanışa kadar size eşlik ederiz." },
    ],
    oppsKicker: "Seçkin fırsatlar", oppsTitle: "Şu anda mevcut fırsatlar", oppsSub: "Nitelikli fırsatların kısa görünümü. Daha fazla ayrıntı için giriş yapın.",
    oppStatus: "Yayında", oppRangeLabel: "Talep edilen yatırım aralığı", oppInterest: "İlgi göster →", oppsAll: "Tüm fırsatları incele", oppsEmpty: "Yeni fırsatlar hazırlanıyor — ilk görenlerden olmak için kaydolun.",
    secKicker: "Çeşitli sektörler", secTitle: "Başlıca yatırım sektörlerindeki fırsatları kabul ediyoruz",
    sectors: ["Gayrimenkul ve geliştirme", "Sanayi ve fabrikalar", "Tarım ve arazi", "Gıda sanayii", "Yenilenebilir enerji", "Turizm ve oteller", "Lojistik", "Teknoloji ve fintek"],
    confTitleA: "Gizlilik ve yönetişim",
    confP: "Yalnızca fırsat sunmuyoruz; güvene dayalı bir ilişki yönetiyoruz. Ciddiyet ve onay teyit edilene kadar hassas ayrıntılar korunur; böylece hem sahiplerin hem de yatırımcıların hakları güvence altına alınır.",
    confBtn: "Yaklaşımımızı öğrenin",
    conf: [
      { h: "Güvenli kısa görünüm", p: "Fırsat, kimlik veya kesin konum açıklanmadan anonim olarak görünür." },
      { h: "Her fırsata bir sözleşme", p: "Tüm ayrıntılar, fırsata özel gizlilik sözleşmesi imzalandıktan sonra açıklanır." },
      { h: "Platform içi görüntüleme", p: "Hassas dosyalar içeriği korumak için yalnızca platform içinde görüntülenir." },
      { h: "İnsan incelemesi", p: "Her fırsat yatırımcılara sunulmadan önce ekibimizce incelenir ve nitelendirilir." },
    ],
    ctaTitle: "Baraka Partners ile yolculuğunuza başlayın", ctaSub: "Ciddiyeti, profesyonelliği ve güveni birleştiren bir platforma katılın.", ctaBtn1: "Yatırımcı olarak kaydol", ctaBtn2: "Yatırım fırsatınızı sunun",
    faqKicker: "Sıkça sorulan sorular", faqTitle: "En çok sorulan soruların yanıtları",
    faq: [
      { q: "Fırsatımı sunmak verilerimi herkese açmak anlamına mı gelir?", a: "Hayır. Verileriniz ve kimliğiniz korunur; kamuya yalnızca kısa, anonim bir görünüm sunulur. Ayrıntılar yalnızca yönetilen bir çerçevede ve gizlilik koşulları karşılandıktan sonra açıklanır." },
      { q: "Hangi ülkelerden fırsat ve yatırımcı kabul ediyorsunuz?", a: "Onaylı sektörlerimiz kapsamında, birçok ülkeden fırsat ve yatırımcıyı ABD doları cinsinden birleşik bir değerlemeyle kabul ediyoruz." },
      { q: "Yatırımcı olarak nasıl başlarım?", a: "Hesabınızı oluşturun, mevcut kısa fırsatları inceleyin ve size uyanlara ilgi gösterin. İnceleme sonrası tüm ayrıntılar size açılır." },
      { q: "Platform belirli sektörlere mi odaklanıyor?", a: "Evet — gayrimenkul, sanayi, tarım, gıda, enerji, turizm, lojistik ve teknoloji." },
    ],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const c = C[locale] ?? C.ar;
  return pageMetadata({
    locale,
    path: "",
    title: `${c.brand} | ${c.heroTag}`,
    description: clampDescription(c.heroLead),
  });
}

export default async function Home() {
  const locale = await getLocale();
  const c = C[locale] ?? C.ar;
  const cx = HOME_X[locale] ?? HOME_X.ar;
  const d = dir(locale);
  const destCards = (await getDestinationCards(locale)).slice(0, 6);
  const lh = (p: string) => (shouldLocalizePath(p) ? localeHref(locale, p) : p);
  const homeLd = [organizationLd(), websiteLd()];

  const opps = await prisma.opportunity.findMany({
    where: { state: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { id: true, sector: true, country: true, currency: true, investmentMin: true, investmentMax: true, publicVersion: true, translations: true },
  });
  const featured = opps.map((o) => {
    const otr = parseOppTranslations(o.translations);
    const pv = localizeOppVersion(toVersion(o.publicVersion), otr, locale);
    const localSector = localizeOppSector(o.sector, otr, locale);
    return {
      id: o.id,
      title: pv?.displayTitle || localSector,
      summary: pv?.summary || "",
      sector: localSector,
      country: localizeOppCountry(o.country, otr, locale),
      range: fmtRange(o.investmentMin, o.investmentMax, o.currency),
      imageUrl: coverOrIllustrative(pv?.imageUrl, `${o.sector} ${toVersion(o.publicVersion)?.displayTitle ?? ""}`),
    };
  });

  const TRACK_IMAGES = ["/how-it-works/investors.jpg", "/about/about-realestate.jpg"];

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={homeLd} />
      <PublicHeader />
      <main dir={d} className="bg-[#f7f1e7] text-[#171717]">
        {/* HERO */}
        <section className="relative min-h-[92vh] overflow-hidden">
          <div className="absolute inset-0">
            <img src="/home/hero.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/95 via-black/72 to-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(215,181,109,0.36),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.10),transparent_30%)]" />
          </div>
          <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-6 py-24">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex rounded-full border border-[#d7b56d]/50 bg-white/10 px-5 py-2 text-sm font-black text-[#e8cf91] backdrop-blur">
                {c.heroTag}
              </div>
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
                {c.heroH1a} <span className="text-[#d7b56d]">{c.heroH1gold}</span>
                <span className="mt-3 block">{c.heroH1b}</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-9 text-white/80 md:text-xl">{c.heroLead}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href={lh("/opportunities")} className="rounded-full bg-[#d7b56d] px-8 py-4 text-sm font-black text-[#171717] shadow-xl transition hover:-translate-y-1 hover:bg-[#e5c77d]">
                  {c.heroBtn1}
                </Link>
                <Link href={lh("/submit-opportunity")} className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                  {c.heroBtn2}
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/35 backdrop-blur-xl">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-5 md:grid-cols-4">
              {c.trust.map((it) => (
                <div key={it.l} className="px-4">
                  <div className="text-2xl font-black text-[#d7b56d]">{it.n}</div>
                  <div className="mt-1 text-sm font-semibold text-white/75">{it.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TWO TRACKS */}
        <section className="mx-auto -mt-12 max-w-7xl px-6">
          <div className="relative z-10 grid gap-8 lg:grid-cols-2">
            {[
              { title: c.invTitle, desc: c.invDesc, list: c.invList, btn: c.invBtn, href: "/register", img: TRACK_IMAGES[0], gold: false },
              { title: c.ownTitle, desc: c.ownDesc, list: c.ownList, btn: c.ownBtn, href: "/submit-opportunity", img: TRACK_IMAGES[1], gold: true },
            ].map((tk) => (
              <div key={tk.title} className="group overflow-hidden rounded-[2.5rem] border border-white/50 bg-white shadow-2xl transition hover:-translate-y-2">
                <div className="relative h-72 overflow-hidden">
                  <img src={tk.img} alt={tk.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <h2 className="absolute bottom-7 right-7 left-7 text-3xl font-black text-white">{tk.title}</h2>
                </div>
                <div className="p-8">
                  <p className="text-lg leading-9 text-[#555]">{tk.desc}</p>
                  <div className="mt-7 grid gap-3">
                    {tk.list.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-black text-[#d7b56d]">✓</span>
                        <span className="text-[#444]">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={lh(tk.href)} className={`mt-8 inline-flex rounded-full px-7 py-3 text-sm font-black transition ${tk.gold ? "bg-[#d7b56d] text-[#171717] hover:bg-[#e5c77d]" : "bg-[#171717] text-white hover:bg-[#2b2b2b]"}`}>
                    {tk.btn}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT / VALUE */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black text-[#a67c28]">{cx.valueKicker}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
              {cx.valueTitle1}
              <span className="block text-[#a67c28]">{cx.valueTitle2}</span>
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-9 text-[#4d4d4d]">
              <p>{cx.valuePara1}</p>
              <p>{cx.valuePara2}</p>
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={lh("/about")} className="rounded-full bg-[#171717] px-8 py-4 text-sm font-black text-white transition hover:bg-[#2b2b2b]">{cx.valueBtnAbout}</Link>
              <Link href={lh("/how-it-works")} className="rounded-full border border-[#d7b56d] bg-white px-8 py-4 text-sm font-black text-[#171717] transition hover:bg-[#fff8e8]">{cx.valueBtnHow}</Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-8 -top-8 h-60 w-60 rounded-full bg-[#d7b56d]/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.8rem] shadow-2xl">
              <img src="/about/about-meeting.jpg" alt="" loading="lazy" className="h-[560px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-8 right-8 left-8 rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl">
                <h3 className="text-2xl font-black text-[#d7b56d]">{cx.valueCardTitle}</h3>
                <p className="mt-3 leading-8 text-white/80">{cx.valueCardText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED OPPORTUNITIES */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black text-[#a67c28]">{c.oppsKicker}</p>
                <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{c.oppsTitle}</h2>
                <p className="mt-5 max-w-3xl text-lg leading-9 text-[#555]">{c.oppsSub}</p>
              </div>
              <Link href={lh("/opportunities")} className="w-fit rounded-full bg-[#171717] px-7 py-3 text-sm font-black text-white transition hover:bg-[#2b2b2b]">{c.oppsAll}</Link>
            </div>
            {featured.length > 0 ? (
              <div className="grid gap-8 lg:grid-cols-3">
                {featured.map((item) => (
                  <article key={item.id} className="group overflow-hidden rounded-[2.5rem] border border-[#e3d5bd] bg-[#f7f1e7] shadow-sm transition hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative h-72 overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute top-5 right-5 flex gap-2">
                        <span className="rounded-full bg-[#d7b56d] px-4 py-1 text-xs font-black text-[#171717]">{item.country}</span>
                        <span className="rounded-full bg-white/15 px-4 py-1 text-xs font-black text-white backdrop-blur">{item.sector}</span>
                      </div>
                    </div>
                    <div className="p-7">
                      <h3 className="text-2xl font-black leading-tight">{item.title}</h3>
                      <p className="mt-4 leading-8 text-[#555] line-clamp-3">{item.summary || "—"}</p>
                      <div className="mt-6 rounded-2xl border border-[#e3d5bd] bg-white p-4">
                        <div className="text-xs font-bold text-[#777]">{c.oppRangeLabel}</div>
                        <div className="mt-1 text-xl font-black text-[#a67c28]">{item.range ? `${item.range.replace(" USD", "")} $` : "—"}</div>
                      </div>
                      <Link href={lh(`/opportunities/${item.id}`)} className="mt-6 inline-flex text-sm font-black text-[#171717] underline decoration-[#d7b56d] decoration-2 underline-offset-8">{c.oppInterest}</Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-[#cbb98f] bg-[#f7f1e7] p-10 text-center text-[#555]">{c.oppsEmpty}</div>
            )}
          </div>
        </section>

        {/* DESTINATIONS */}
        {destCards.length > 0 && (
          <section className="relative overflow-hidden bg-[#171717] py-24 text-white">
            <div className="absolute inset-0 opacity-20">
              <img src="/about/about-map.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-[#171717]/88" />
            <div className="relative mx-auto max-w-7xl px-6">
              <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-black text-[#d7b56d]">{cx.destKicker}</p>
                  <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{cx.destTitle}</h2>
                  <p className="mt-5 max-w-3xl text-lg leading-9 text-white/70">{cx.destSub}</p>
                </div>
                <Link href={lh("/investment-destinations")} className="w-fit rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/20">{cx.destBtn}</Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {destCards.map(({ dest, tr }) => (
                  <Link key={dest.id} href={destPath(locale, tr.slug)} className="group relative h-64 overflow-hidden rounded-[2rem] border border-white/10 bg-white/10">
                    <img src={dest.featuredImage || `/destinations/${dest.countryKey}.jpg`} alt={tr.h1Title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-6 right-6 left-6">
                      <div className="mb-4 h-1 w-14 rounded-full bg-[#d7b56d]" />
                      <h3 className="text-3xl font-black">{tr.countryName || tr.h1Title}</h3>
                      <p className="mt-2 text-sm text-white/70">{cx.destCardSub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* HOW IT WORKS */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 text-center">
            <p className="text-sm font-black text-[#a67c28]">{c.howKicker}</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-tight md:text-5xl">{c.howTitle}</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-9 text-[#555]">{c.howSub}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {c.steps.map((step, i) => (
              <div key={step.h} className="rounded-[2rem] border border-[#e3d5bd] bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl">
                <div className="mb-7 text-6xl font-black text-[#d7b56d]">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-2xl font-black">{step.h}</h3>
                <p className="mt-5 leading-8 text-[#555]">{step.p}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href={lh("/how-it-works")} className="inline-flex rounded-full bg-[#171717] px-8 py-4 text-sm font-black text-white transition hover:bg-[#2b2b2b]">{cx.valueBtnHow}</Link>
          </div>
        </section>

        {/* SECTORS */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-black text-[#a67c28]">{c.secKicker}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{c.secTitle}</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.sectors.map((sector, i) => (
                <div key={sector} className="group relative h-60 overflow-hidden rounded-[2rem] border border-[#e3d5bd] bg-black shadow-sm">
                  <img src={SECTOR_IMAGES[i]} alt={sector} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 right-6 left-6">
                    <div className="mb-4 h-1 w-14 rounded-full bg-[#d7b56d]" />
                    <h3 className="text-xl font-black text-white">{sector}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GOVERNANCE */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2.8rem] shadow-2xl">
            <img src="/about/about-governance.jpg" alt="" loading="lazy" className="h-[560px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute bottom-8 right-8 left-8 rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl">
              <h3 className="text-2xl font-black text-[#d7b56d]">{cx.govCardTitle}</h3>
              <p className="mt-3 leading-8 text-white/80">{cx.govCardText}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-[#a67c28]">{c.confTitleA}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
              {cx.govTitle1}
              <span className="block text-[#a67c28]">{cx.govTitle2}</span>
            </h2>
            <p className="mt-6 text-lg leading-9 text-[#555]">{c.confP}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {c.conf.map((item) => (
                <div key={item.h} className="rounded-3xl border border-[#e3d5bd] bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-black">{item.h}</h3>
                  <p className="mt-3 leading-7 text-[#666]">{item.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUICK CONTACT */}
        <section className="bg-[#171717] py-24 text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black text-[#d7b56d]">{cx.contactKicker}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{cx.contactTitle}</h2>
              <p className="mt-6 text-lg leading-9 text-white/70">{cx.contactSub}</p>
              <div className="mt-9 grid gap-4">
                {cx.contactChips.map((item) => (
                  <div key={item} className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">{item}</div>
                ))}
              </div>
            </div>
            <HomeQuickForm locale={locale} />
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-6 py-24">
          <div className="mb-12 text-center">
            <p className="text-sm font-black text-[#a67c28]">{c.faqKicker}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{c.faqTitle}</h2>
          </div>
          <div className="space-y-4">
            {c.faq.map((faq) => (
              <details key={faq.q} className="group rounded-3xl border border-[#e3d5bd] bg-white p-6 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black">
                  {faq.q}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171717] text-[#d7b56d] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-5 leading-8 text-[#555]">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 pb-24">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[#171717] px-8 py-20 text-center text-white shadow-2xl">
            <div className="absolute inset-0 opacity-25">
              <img src="/about/about-cta.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-[#171717]/75" />
            <div className="relative">
              <p className="text-sm font-black text-[#d7b56d]">{c.brand}</p>
              <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-tight md:text-5xl">{c.ctaTitle}</h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/75">{c.ctaSub}</p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/register" className="rounded-full bg-[#d7b56d] px-9 py-4 text-sm font-black text-[#171717] transition hover:-translate-y-1 hover:bg-[#e5c77d]">{c.ctaBtn1}</Link>
                <Link href={lh("/submit-opportunity")} className="rounded-full border border-white/25 bg-white/10 px-9 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">{c.ctaBtn2}</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
