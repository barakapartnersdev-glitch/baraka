import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toVersion } from "@/lib/opportunity";
import { localizeOppVersion, localizeOppSector, localizeOppCountry, parseOppTranslations } from "@/lib/opp-i18n";
import { getLocale } from "@/lib/i18n-server";
import { localeHref, shouldLocalizePath, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { pageMetadata, clampDescription, organizationLd, websiteLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import LocaleMenu from "@/components/LocaleMenu";
import Faq from "@/components/Faq";
import { getDestinationCards, destPath, flagSrc } from "@/lib/destinations";
import { destUi } from "@/lib/dest-i18n";
import HomeQuickForm from "./HomeQuickForm";

export const dynamic = "force-dynamic";

function fmtRange(min: bigint | null, max: bigint | null, cur: string) {
  if (!min && !max) return null;
  const f = (n: bigint) => Number(n).toLocaleString("en-US");
  return `${min ? f(min) : "?"} – ${max ? f(max) : "?"} ${cur}`;
}

// ===== محتوى الصفحة ثنائي اللغة =====
const C = {
  ar: {
    brand: "شركاء البركة",
    brandSub: "BARAKA PARTNERS",
    nav: { home: "الرئيسية", opps: "الفرص الاستثمارية", inv: "للمستثمرين", own: "لأصحاب الفرص", how: "كيف نعمل", contact: "اتصل بنا" },
    login: "تسجيل الدخول", signup: "إنشاء حساب",
    heroTag: "منصة استثمارية تديرها شركة عهد البركة",
    heroH1a: "نربط", heroH1gold: "رأس المال الدولي", heroH1b: "بالفرص الحقيقية المدروسة",
    heroLead: "منصة وسيطة موثوقة تجمع بين المستثمرين الجادين من مختلف الدول وأصحاب المشاريع والأصول الواعدة — ضمن إطار من الشفافية والحوكمة والسرية، لتحقيق المنفعة المشتركة لجميع الشركاء.",
    heroBtn1: "أنا مستثمر — استعرض الفرص", heroBtn2: "لديّ فرصة أو أصل استثماري",
    trust: [
      { n: "+8", l: "قطاعات استثمارية" },
      { n: "عالمي", l: "نطاق دولي للفرص" },
      { n: "100%", l: "سرية وحوكمة" },
      { n: "USD", l: "عملة موحدة للتقييم" },
    ],
    pathsKicker: "مساران واضحان",
    pathsTitle: "أينما كان موقعك في الصفقة، نحن نمهّد الطريق",
    pathsSub: "سواء كنت تبحث عن فرصة استثمارية مدروسة أو تملك مشروعاً واعداً يحتاج إلى شريك، تبدأ رحلتك من هنا.",
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
    sectors: [
      { e: "🏢", h: "العقار والتطوير" }, { e: "🏭", h: "الصناعة والمصانع" }, { e: "🌾", h: "الزراعة والأراضي" }, { e: "🍲", h: "الصناعات الغذائية" },
      { e: "⚡", h: "الطاقة المتجددة" }, { e: "🏨", h: "السياحة والفنادق" }, { e: "🚚", h: "اللوجستيات" }, { e: "💻", h: "التكنولوجيا والفنتك" },
    ],
    confTitleA: "السرية والحوكمة", confTitleGold: "في صميم عملنا",
    confP: "نحن لا نعرض فرصاً فقط، بل ندير علاقة قائمة على الثقة. تبقى التفاصيل الحساسة محمية حتى تكتمل شروط الجدية والاعتماد، حمايةً لحقوق أصحاب المشاريع والمستثمرين معاً.",
    confBtn: "تعرّف على نهجنا",
    conf: [
      { e: "🔒", h: "عرض مختصر آمن", p: "تظهر الفرصة بشكل مجهّل دون كشف الهوية أو الموقع الدقيق." },
      { e: "📝", h: "اتفاقية لكل فرصة", p: "تُكشف التفاصيل الكاملة بعد توقيع اتفاقية السرية الخاصة بالفرصة." },
      { e: "👁️", h: "عرض داخل المنصة", p: "الملفات الحساسة تُشاهَد داخل المنصة فقط لحماية المحتوى." },
      { e: "✅", h: "مراجعة بشرية", p: "كل فرصة تُراجَع وتُؤهَّل من فريقنا قبل عرضها على المستثمرين." },
    ],
    ctaTitle: "ابدأ رحلتك مع شركاء البركة", ctaSub: "انضم إلى منصة تجمع بين الجدية والاحترافية والثقة.", ctaBtn1: "سجّل كمستثمر", ctaBtn2: "قدّم فرصتك الاستثمارية",
    faqKicker: "أسئلة شائعة", faqTitle: "إجابات على أكثر ما يُسأل",
    faq: [
      { q: "هل عرض فرصتي يعني كشف بياناتي للجميع؟", a: "لا. تبقى بياناتك وهويتك محمية، ولا يظهر للعامة سوى عرض مختصر ومجهّل. التفاصيل تُكشف فقط ضمن إطار محكوم وبعد استيفاء شروط السرية." },
      { q: "من أي الدول تقبلون الفرص والمستثمرين؟", a: "نستقبل الفرص الاستثمارية والمستثمرين من مختلف الدول، ضمن القطاعات المعتمدة لدينا، مع تقييم موحّد بالدولار الأمريكي." },
      { q: "كيف أبدأ كمستثمر؟", a: "أنشئ حسابك، استعرض الفرص المختصرة المتاحة، وأبدِ اهتمامك بما يناسبك. بعد مراجعة طلبك تُفتح لك التفاصيل الكاملة." },
      { q: "هل تشمل المنصة قطاعات محددة؟", a: "نعم، نركّز على قطاعات العقار والصناعة والزراعة والصناعات الغذائية والطاقة والسياحة واللوجستيات والتكنولوجيا." },
    ],
    foot: { about: "منصة استثمارية تديرها شركة عهد البركة، تربط رأس المال الدولي بالفرص المدروسة ضمن إطار من الشفافية والحوكمة.", platform: "المنصة", users: "للمستخدمين", legal: "قانوني" },
    footPlatform: [["عن BarakaPartners", "/about"], ["الفرص الاستثمارية", "/opportunities"], ["كيف نعمل", "/how-it-works"], ["اتصل بنا", "/contact"]],
    footUsers: [["للمستثمرين", "/register"], ["لأصحاب الفرص", "/register/owner"], ["إنشاء حساب", "/register"], ["تسجيل الدخول", "/login"]],
    footLegal: [["الشروط والأحكام", "/about"], ["سياسة الخصوصية", "/about"], ["اتصل بنا", "/contact"]],
    rights: "© 2026 شركاء البركة — جميع الحقوق محفوظة لشركة عهد البركة",
  },
  en: {
    brand: "Baraka Partners",
    brandSub: "BARAKA PARTNERS",
    nav: { home: "Home", opps: "Opportunities", inv: "For investors", own: "For owners", how: "How it works", contact: "Contact" },
    login: "Log in", signup: "Sign up",
    heroTag: "An investment platform managed by Ahd Al-Baraka",
    heroH1a: "Connecting", heroH1gold: "global capital", heroH1b: "to vetted, real opportunities",
    heroLead: "A trusted intermediary platform bringing together serious investors from many countries with promising project owners and assets — within a framework of transparency, governance, and confidentiality, for the shared benefit of all partners.",
    heroBtn1: "I'm an investor — browse opportunities", heroBtn2: "I have an opportunity or asset",
    trust: [
      { n: "8+", l: "Investment sectors" },
      { n: "Global", l: "International deal reach" },
      { n: "100%", l: "Confidentiality & governance" },
      { n: "USD", l: "Unified valuation currency" },
    ],
    pathsKicker: "Two clear paths",
    pathsTitle: "Wherever you stand in the deal, we pave the way",
    pathsSub: "Whether you seek a vetted opportunity or own a promising project that needs a partner, your journey starts here.",
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
    sectors: [
      { e: "🏢", h: "Real estate" }, { e: "🏭", h: "Industry & factories" }, { e: "🌾", h: "Agriculture & land" }, { e: "🍲", h: "Food industries" },
      { e: "⚡", h: "Renewable energy" }, { e: "🏨", h: "Tourism & hotels" }, { e: "🚚", h: "Logistics" }, { e: "💻", h: "Technology & fintech" },
    ],
    confTitleA: "Confidentiality & governance", confTitleGold: "at the core of what we do",
    confP: "We don't just list opportunities — we manage a relationship built on trust. Sensitive details stay protected until seriousness and approval are confirmed, safeguarding the rights of owners and investors alike.",
    confBtn: "Learn about our approach",
    conf: [
      { e: "🔒", h: "Secure concise view", p: "The opportunity appears anonymized, without revealing identity or exact location." },
      { e: "📝", h: "An agreement per opportunity", p: "Full details are revealed after signing the opportunity's confidentiality agreement." },
      { e: "👁️", h: "In-platform viewing", p: "Sensitive files are viewed only inside the platform to protect the content." },
      { e: "✅", h: "Human review", p: "Every opportunity is reviewed and qualified by our team before it reaches investors." },
    ],
    ctaTitle: "Start your journey with Baraka Partners", ctaSub: "Join a platform that combines seriousness, professionalism, and trust.", ctaBtn1: "Sign up as an investor", ctaBtn2: "Submit your opportunity",
    faqKicker: "FAQ", faqTitle: "Answers to the most asked questions",
    faq: [
      { q: "Does listing my opportunity mean exposing my data to everyone?", a: "No. Your data and identity stay protected, and the public sees only a concise, anonymized view. Details are revealed only within a governed framework after confidentiality terms are met." },
      { q: "Which countries do you accept opportunities and investors from?", a: "We welcome opportunities and investors from many countries, within our approved sectors, with a unified valuation in US dollars." },
      { q: "How do I start as an investor?", a: "Create your account, browse the concise opportunities available, and express interest in what suits you. After review, full details open up to you." },
      { q: "Does the platform focus on specific sectors?", a: "Yes — real estate, industry, agriculture, food, energy, tourism, logistics, and technology." },
    ],
    foot: { about: "An investment platform managed by Ahd Al-Baraka, connecting global capital to vetted opportunities within a framework of transparency and governance.", platform: "Platform", users: "For users", legal: "Legal" },
    footPlatform: [["About BarakaPartners", "/about"], ["Opportunities", "/opportunities"], ["How it works", "/how-it-works"], ["Contact", "/contact"]],
    footUsers: [["For investors", "/register"], ["For owners", "/register/owner"], ["Sign up", "/register"], ["Log in", "/login"]],
    footLegal: [["Terms & conditions", "/about"], ["Privacy policy", "/about"], ["Contact", "/contact"]],
    rights: "© 2026 Baraka Partners — All rights reserved to Ahd Al-Baraka",
  },
  zh: {
    brand: "巴拉卡合伙人",
    brandSub: "BARAKA PARTNERS",
    nav: { home: "首页", opps: "投资机会", inv: "投资者", own: "项目方", how: "运作方式", contact: "联系我们" },
    login: "登录", signup: "注册",
    heroTag: "由 Ahd Al-Baraka 公司运营的投资平台",
    heroH1a: "连接", heroH1gold: "国际资本", heroH1b: "与经过审核的真实机会",
    heroLead: "一个值得信赖的中介平台，汇聚来自各国的认真投资者与有潜力的项目方和资产——在透明、治理与保密的框架内，为所有合作伙伴创造共同价值。",
    heroBtn1: "我是投资者 — 浏览机会", heroBtn2: "我有项目或投资资产",
    trust: [
      { n: "8+", l: "投资领域" },
      { n: "全球", l: "国际机会覆盖" },
      { n: "100%", l: "保密与治理" },
      { n: "USD", l: "统一估值货币" },
    ],
    pathsKicker: "两条清晰路径",
    pathsTitle: "无论您处于交易的哪一方，我们都为您铺路",
    pathsSub: "无论您在寻找经过审核的投资机会，还是拥有需要合作伙伴的优质项目，您的旅程都从这里开始。",
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
    sectors: [
      { e: "🏢", h: "房地产与开发" }, { e: "🏭", h: "工业与工厂" }, { e: "🌾", h: "农业与土地" }, { e: "🍲", h: "食品工业" },
      { e: "⚡", h: "可再生能源" }, { e: "🏨", h: "旅游与酒店" }, { e: "🚚", h: "物流" }, { e: "💻", h: "科技与金融科技" },
    ],
    confTitleA: "保密与治理", confTitleGold: "是我们工作的核心",
    confP: "我们不只是展示机会，而是经营一段建立在信任之上的关系。在确认认真意向与审核通过之前，敏感信息始终受到保护，以保障项目方与投资者双方的权益。",
    confBtn: "了解我们的方式",
    conf: [
      { e: "🔒", h: "安全的简要展示", p: "机会以匿名方式呈现，不泄露身份或精确位置。" },
      { e: "📝", h: "每个机会一份协议", p: "签署该机会的保密协议后，方可获得完整详情。" },
      { e: "👁️", h: "平台内查看", p: "敏感文件仅在平台内查看，以保护内容。" },
      { e: "✅", h: "人工审核", p: "每个机会在呈现给投资者前，都经过我们团队的审核与资格认定。" },
    ],
    ctaTitle: "与巴拉卡合伙人开启您的旅程", ctaSub: "加入一个兼具认真、专业与信任的平台。", ctaBtn1: "注册为投资者", ctaBtn2: "提交您的投资机会",
    faqKicker: "常见问题", faqTitle: "最常被问到的问题解答",
    faq: [
      { q: "展示我的机会是否意味着向所有人公开我的数据？", a: "不会。您的数据与身份始终受保护，公众仅能看到简要、匿名的展示。详情仅在受治理的框架内、且满足保密条件后才会揭示。" },
      { q: "你们接受来自哪些国家的机会和投资者？", a: "我们欢迎来自多个国家的机会与投资者，涵盖我们认可的领域，并以美元进行统一估值。" },
      { q: "作为投资者我该如何开始？", a: "创建账户，浏览可用的简要机会，并对适合您的机会表达意向。审核后，完整详情将向您开放。" },
      { q: "平台是否专注于特定领域？", a: "是的——房地产、工业、农业、食品、能源、旅游、物流与科技。" },
    ],
    foot: { about: "由 Ahd Al-Baraka 公司运营的投资平台，在透明与治理的框架内，将国际资本与经审核的机会相连接。", platform: "平台", users: "用户", legal: "法律" },
    footPlatform: [["关于 BarakaPartners", "/about"], ["投资机会", "/opportunities"], ["运作方式", "/how-it-works"], ["联系我们", "/contact"]],
    footUsers: [["投资者", "/register"], ["项目方", "/register/owner"], ["注册", "/register"], ["登录", "/login"]],
    footLegal: [["条款与条件", "/about"], ["隐私政策", "/about"], ["联系我们", "/contact"]],
    rights: "© 2026 巴拉卡合伙人 — Ahd Al-Baraka 公司版权所有",
  },
  tr: {
    brand: "Baraka Partners",
    brandSub: "BARAKA PARTNERS",
    nav: { home: "Ana sayfa", opps: "Fırsatlar", inv: "Yatırımcılar için", own: "Sahipler için", how: "Nasıl çalışır", contact: "İletişim" },
    login: "Giriş", signup: "Kayıt ol",
    heroTag: "Ahd Al-Baraka şirketi tarafından işletilen bir yatırım platformu",
    heroH1a: "Uluslararası sermayeyi", heroH1gold: "gerçek, incelenmiş fırsatlara", heroH1b: "bağlıyoruz",
    heroLead: "Farklı ülkelerden ciddi yatırımcıları, gelecek vaat eden proje sahipleri ve varlıklarla bir araya getiren güvenilir bir aracı platform — şeffaflık, yönetişim ve gizlilik çerçevesinde, tüm ortakların ortak yararı için.",
    heroBtn1: "Yatırımcıyım — fırsatları incele", heroBtn2: "Bir fırsatım ya da varlığım var",
    trust: [
      { n: "8+", l: "Yatırım sektörü" },
      { n: "Küresel", l: "Uluslararası erişim" },
      { n: "100%", l: "Gizlilik ve yönetişim" },
      { n: "USD", l: "Birleşik değerleme birimi" },
    ],
    pathsKicker: "İki net yol",
    pathsTitle: "İşlemin neresinde olursanız olun, yolu biz açarız",
    pathsSub: "İster incelenmiş bir yatırım fırsatı arıyor olun, ister ortak arayan umut vaat eden bir projeniz olsun, yolculuğunuz burada başlar.",
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
    sectors: [
      { e: "🏢", h: "Gayrimenkul ve geliştirme" }, { e: "🏭", h: "Sanayi ve fabrikalar" }, { e: "🌾", h: "Tarım ve arazi" }, { e: "🍲", h: "Gıda sanayii" },
      { e: "⚡", h: "Yenilenebilir enerji" }, { e: "🏨", h: "Turizm ve oteller" }, { e: "🚚", h: "Lojistik" }, { e: "💻", h: "Teknoloji ve fintek" },
    ],
    confTitleA: "Gizlilik ve yönetişim", confTitleGold: "işimizin merkezinde",
    confP: "Yalnızca fırsat sunmuyoruz; güvene dayalı bir ilişki yönetiyoruz. Ciddiyet ve onay teyit edilene kadar hassas ayrıntılar korunur; böylece hem sahiplerin hem de yatırımcıların hakları güvence altına alınır.",
    confBtn: "Yaklaşımımızı öğrenin",
    conf: [
      { e: "🔒", h: "Güvenli kısa görünüm", p: "Fırsat, kimlik veya kesin konum açıklanmadan anonim olarak görünür." },
      { e: "📝", h: "Her fırsata bir sözleşme", p: "Tüm ayrıntılar, fırsata özel gizlilik sözleşmesi imzalandıktan sonra açıklanır." },
      { e: "👁️", h: "Platform içi görüntüleme", p: "Hassas dosyalar içeriği korumak için yalnızca platform içinde görüntülenir." },
      { e: "✅", h: "İnsan incelemesi", p: "Her fırsat yatırımcılara sunulmadan önce ekibimizce incelenir ve nitelendirilir." },
    ],
    ctaTitle: "Baraka Partners ile yolculuğunuza başlayın", ctaSub: "Ciddiyeti, profesyonelliği ve güveni birleştiren bir platforma katılın.", ctaBtn1: "Yatırımcı olarak kaydol", ctaBtn2: "Yatırım fırsatınızı sunun",
    faqKicker: "Sıkça sorulan sorular", faqTitle: "En çok sorulan soruların yanıtları",
    faq: [
      { q: "Fırsatımı sunmak verilerimi herkese açmak anlamına mı gelir?", a: "Hayır. Verileriniz ve kimliğiniz korunur; kamuya yalnızca kısa, anonim bir görünüm sunulur. Ayrıntılar yalnızca yönetilen bir çerçevede ve gizlilik koşulları karşılandıktan sonra açıklanır." },
      { q: "Hangi ülkelerden fırsat ve yatırımcı kabul ediyorsunuz?", a: "Onaylı sektörlerimiz kapsamında, birçok ülkeden fırsat ve yatırımcıyı ABD doları cinsinden birleşik bir değerlemeyle kabul ediyoruz." },
      { q: "Yatırımcı olarak nasıl başlarım?", a: "Hesabınızı oluşturun, mevcut kısa fırsatları inceleyin ve size uyanlara ilgi gösterin. İnceleme sonrası tüm ayrıntılar size açılır." },
      { q: "Platform belirli sektörlere mi odaklanıyor?", a: "Evet — gayrimenkul, sanayi, tarım, gıda, enerji, turizm, lojistik ve teknoloji." },
    ],
    foot: { about: "Ahd Al-Baraka tarafından işletilen, uluslararası sermayeyi şeffaflık ve yönetişim çerçevesinde incelenmiş fırsatlara bağlayan bir yatırım platformu.", platform: "Platform", users: "Kullanıcılar", legal: "Yasal" },
    footPlatform: [["BarakaPartners hakkında", "/about"], ["Fırsatlar", "/opportunities"], ["Nasıl çalışır", "/how-it-works"], ["İletişim", "/contact"]],
    footUsers: [["Yatırımcılar için", "/register"], ["Sahipler için", "/register/owner"], ["Kayıt ol", "/register"], ["Giriş", "/login"]],
    footLegal: [["Şartlar ve koşullar", "/about"], ["Gizlilik politikası", "/about"], ["İletişim", "/contact"]],
    rights: "© 2026 Baraka Partners — Tüm hakları Ahd Al-Baraka'ya aittir",
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
  const du = destUi(locale);
  const destCards = (await getDestinationCards(locale)).slice(0, 6);
  const exploreDestTitle = ({
    ar: "استكشف وجهات الاستثمار",
    en: "Explore investment destinations",
    tr: "Yatırım destinasyonlarını keşfedin",
    zh: "探索投资目的地",
  } as const)[locale];
  // يُسبِق روابط المحتوى العام بادئة اللغة؛ روابط البوّابات/المصادقة تبقى كما هي.
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
      imageUrl: pv?.imageUrl ?? null,
    };
  });

  const btnGold = "inline-flex items-center justify-center rounded-[10px] bg-gradient-to-br from-gold to-gold-soft px-5 py-2.5 text-sm font-bold text-navy transition hover:brightness-110 hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";
  const btnGoldLg = "inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-soft px-7 py-4 text-base font-bold text-navy transition hover:brightness-110 hover:-translate-y-px";
  const btnGhostLg = "inline-flex items-center justify-center rounded-xl border border-white/30 px-7 py-4 text-base font-bold text-white transition hover:border-gold hover:text-gold";

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-[#1a2433]">
      <JsonLd data={homeLd} />
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 border-b border-gold/20 bg-navy/90 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href={lh("/")} className="flex shrink-0 items-center gap-2.5 text-white">
            <img src="/logo-mark.png" alt="Baraka Partners" width={40} height={40} className="h-10 w-10 shrink-0 rounded-[10px]" />
            <span className="flex flex-col items-start font-extrabold leading-tight">
              <span className="block">{c.brand}</span>
              <small className="block text-[10px] font-medium text-gold-soft">
                <span className="inline-block tracking-[0.15em]">{c.brandSub}</span>
              </small>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 whitespace-nowrap text-sm font-medium text-[#cdd6e4] xl:flex">
            <Link href={lh("/")} className="transition hover:text-gold">{c.nav.home}</Link>
            <Link href={lh("/opportunities")} className="transition hover:text-gold">{c.nav.opps}</Link>
            <Link href={lh("/investment-destinations")} className="transition hover:text-gold">{du.hub}</Link>
            <Link href="/register" className="transition hover:text-gold">{c.nav.inv}</Link>
            <Link href="/register/owner" className="transition hover:text-gold">{c.nav.own}</Link>
            <Link href={lh("/how-it-works")} className="transition hover:text-gold">{c.nav.how}</Link>
            <Link href={lh("/contact")} className="transition hover:text-gold">{c.nav.contact}</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <LocaleMenu locale={locale} />
            <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />
            <Link href="/login" className="hidden whitespace-nowrap rounded-[10px] border border-white/30 px-4 py-2.5 text-sm font-bold text-white transition hover:border-gold hover:text-gold sm:inline-flex">{c.login}</Link>
            <Link href="/register" className={`${btnGold} whitespace-nowrap`}>{c.signup}</Link>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-navy py-24 text-white sm:py-32">
        {/* صورة أفق المدينة المالية ليلاً مع تكبير سينمائي بطيء */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="hero-zoom h-full w-full bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1920&q=70)" }}
          />
        </div>
        {/* طبقات تعتيم كحلية لقراءة النص + توهّج ذهبي */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/65" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/40 to-transparent" />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 85% 18%, rgba(201,162,75,.22), transparent 45%), radial-gradient(circle at 12% 92%, rgba(201,162,75,.12), transparent 40%)" }} />
        {/* كرات ذهبية عائمة */}
        <div className="float pointer-events-none absolute -top-8 end-1/4 h-44 w-44 rounded-full bg-gold/20 blur-3xl" />
        <div className="float-slow pointer-events-none absolute bottom-8 start-12 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          <span className="rise mb-6 inline-block rounded-full border border-gold/40 bg-gold/15 px-4 py-1.5 text-[13px] font-semibold text-gold-soft backdrop-blur">{c.heroTag}</span>
          <h1 className="rise mb-5 text-4xl font-black leading-[1.25] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-[54px]" style={{ animationDelay: "120ms" }}>
            {c.heroH1a}{" "}
            <span className="text-shimmer">{c.heroH1gold}</span>
            <br />
            {c.heroH1b}
          </h1>
          <p className="rise mb-9 max-w-2xl text-lg leading-relaxed text-[#d3dcea]" style={{ animationDelay: "240ms" }}>{c.heroLead}</p>
          <div className="rise flex flex-wrap justify-center gap-4" style={{ animationDelay: "360ms" }}>
            <Link href={lh("/opportunities")} className={btnGoldLg}>{c.heroBtn1}</Link>
            <Link href="/register/owner" className={btnGhostLg}>{c.heroBtn2}</Link>
          </div>
          <div className="rise mt-14 flex w-full max-w-3xl flex-wrap justify-center gap-x-12 gap-y-6 border-t border-white/10 pt-9" style={{ animationDelay: "480ms" }}>
            {c.trust.map((it) => (
              <div key={it.l} className="flex flex-col items-center">
                <span className="text-3xl font-black text-gold-soft">{it.n}</span>
                <span className="text-sm text-[#aebbcf]">{it.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Two paths ===== */}
      <section className="py-20 sm:py-24" id="paths">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-2.5 text-sm font-bold tracking-wider text-gold">{c.pathsKicker}</div>
            <h2 className="mb-3 text-3xl font-black text-navy sm:text-4xl">{c.pathsTitle}</h2>
            <p className="text-lg text-[#5c6b80]">{c.pathsSub}</p>
          </div>
          <div className="grid gap-7 md:grid-cols-2">
            {[
              { icon: "📈", tone: "bg-gold/15 text-gold", title: c.invTitle, desc: c.invDesc, list: c.invList, btn: c.invBtn, href: "/register" },
              { icon: "🏗️", tone: "bg-navy/10 text-navy", title: c.ownTitle, desc: c.ownDesc, list: c.ownList, btn: c.ownBtn, href: "/register/owner" },
            ].map((p) => (
              <div key={p.title} className="group rounded-3xl border border-[#e6e9ef] bg-white p-9 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_50px_rgba(10,31,60,.1)]">
                <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl text-3xl ${p.tone}`}>{p.icon}</div>
                <h3 className="mb-3 text-2xl font-extrabold text-navy">{p.title}</h3>
                <p className="mb-6 min-h-[80px] text-[#5c6b80]">{p.desc}</p>
                <ul className="mb-7 flex flex-col gap-3">
                  {p.list.map((li) => (
                    <li key={li} className="flex items-start gap-2.5 text-[15px]">
                      <span className="font-black text-gold">✓</span>
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
                <Link href={lh(p.href)} className={`${btnGold} w-full`}>{p.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="bg-navy py-20 text-white sm:py-24" id="how">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-2.5 text-sm font-bold tracking-wider text-gold-soft">{c.howKicker}</div>
            <h2 className="mb-3 text-3xl font-black sm:text-4xl">{c.howTitle}</h2>
            <p className="text-lg text-[#aebbcf]">{c.howSub}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.steps.map((s, i) => (
              <div key={s.h} className="text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-soft text-xl font-black text-navy">{i + 1}</div>
                <h4 className="mb-2.5 text-lg font-extrabold">{s.h}</h4>
                <p className="text-sm text-[#aebbcf]">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Opportunities ===== */}
      <section className="py-20 sm:py-24" id="opps">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-2.5 text-sm font-bold tracking-wider text-gold">{c.oppsKicker}</div>
            <h2 className="mb-3 text-3xl font-black text-navy sm:text-4xl">{c.oppsTitle}</h2>
            <p className="text-lg text-[#5c6b80]">{c.oppsSub}</p>
          </div>
          {featured.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((o) => (
                <Link key={o.id} href={lh(`/opportunities/${o.id}`)} className="group flex flex-col overflow-hidden rounded-2xl border border-[#e6e9ef] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold-soft hover:shadow-[0_18px_44px_rgba(10,31,60,.1)]">
                  <div className="relative h-44 bg-navy bg-cover bg-center" style={o.imageUrl ? { backgroundImage: `url(${o.imageUrl})` } : undefined}>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/30" />
                    <span className="absolute end-4 top-4 rounded-full border border-gold/40 bg-gold/20 px-2.5 py-1 text-[11px] font-bold text-gold-soft backdrop-blur">{c.oppStatus}</span>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="mb-1.5 text-xs font-bold tracking-wide text-gold-soft">{o.sector}</div>
                      <h4 className="text-lg font-extrabold leading-snug text-white drop-shadow">{o.title}</h4>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-lg border border-[#e6e9ef] bg-[#f6f7f9] px-2.5 py-1 text-xs text-[#5c6b80]">📍 {o.country}</span>
                      <span className="rounded-lg border border-[#e6e9ef] bg-[#f6f7f9] px-2.5 py-1 text-xs text-[#5c6b80]">{o.sector}</span>
                    </div>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-[#5c6b80] line-clamp-3">{o.summary || "—"}</p>
                    <div className="flex items-center justify-between border-t border-[#e6e9ef] pt-4">
                      <div className="font-black text-navy">
                        {o.range ? `${o.range.replace(" USD", "")} $` : "—"}
                        <small className="block text-[11px] font-medium text-[#5c6b80]">{c.oppRangeLabel}</small>
                      </div>
                      <span className="text-sm font-bold text-gold group-hover:underline">{c.oppInterest}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-[#5c6b80]">{c.oppsEmpty}</div>
          )}
          <div className="mt-11 text-center">
            <Link href={lh("/opportunities")} className={btnGoldLg}>{c.oppsAll}</Link>
          </div>
        </div>
      </section>

      {/* ===== Investment Destinations ===== */}
      {destCards.length > 0 && (
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <div className="mb-2.5 text-sm font-bold tracking-wider text-gold">{du.hub}</div>
              <h2 className="mb-3 text-3xl font-black text-navy sm:text-4xl">{exploreDestTitle}</h2>
              <p className="text-lg text-[#5c6b80]">{du.hubLead}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destCards.map(({ dest, tr }) => (
                <Link
                  key={dest.id}
                  href={destPath(locale, tr.slug)}
                  className="group flex items-center gap-4 rounded-2xl border border-[#e6e9ef] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-[0_18px_44px_rgba(10,31,60,.08)]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy">
                    {flagSrc(dest.countryKey) ? (
                      <span
                        className="h-7 w-10 rounded-[3px] bg-cover bg-center shadow-sm ring-1 ring-white/20"
                        style={{ backgroundImage: `url(${flagSrc(dest.countryKey)})` }}
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="text-3xl">{dest.flagEmoji ?? "🌍"}</span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-extrabold text-navy group-hover:text-baraka">{tr.h1Title}</span>
                    {tr.countryName && <span className="mt-0.5 block truncate text-sm text-[#5c6b80]">{tr.countryName}</span>}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-11 text-center">
              <Link href={lh("/investment-destinations")} className={btnGoldLg}>{exploreDestTitle}</Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== Sectors ===== */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-2.5 text-sm font-bold tracking-wider text-gold">{c.secKicker}</div>
            <h2 className="text-3xl font-black text-navy sm:text-4xl">{c.secTitle}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {c.sectors.map((s) => (
              <div key={s.h} className="rounded-2xl border border-[#e6e9ef] bg-white p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-gold">
                <div className="mb-3 text-3xl">{s.e}</div>
                <h4 className="font-bold text-navy">{s.h}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Confidentiality ===== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 rounded-[24px] bg-gradient-to-br from-[#0c2647] to-navy-600 p-8 text-white sm:p-14 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-black sm:text-[32px]">
                {c.confTitleA} <span className="text-gold-soft">{c.confTitleGold}</span>
              </h2>
              <p className="mb-6 text-[#c5d0e0]">{c.confP}</p>
              <Link href={lh("/how-it-works")} className={btnGold}>{c.confBtn}</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.conf.map((it) => (
                <div key={it.h} className="rounded-2xl border border-gold/25 bg-white/[0.06] p-5">
                  <div className="mb-2.5 text-2xl">{it.e}</div>
                  <h4 className="mb-1.5 font-bold text-gold-soft">{it.h}</h4>
                  <p className="text-[13px] text-[#aebbcf]">{it.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA band ===== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-[24px] bg-gradient-to-br from-gold to-gold-soft p-8 text-center text-navy sm:p-14">
            <h2 className="mb-3.5 text-3xl font-black sm:text-[34px]">{c.ctaTitle}</h2>
            <p className="mb-7 text-lg opacity-85">{c.ctaSub}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-navy px-7 py-4 text-base font-bold text-white transition hover:bg-navy-600">{c.ctaBtn1}</Link>
              <Link href="/register/owner" className="inline-flex items-center justify-center rounded-xl bg-navy px-7 py-4 text-base font-bold text-white transition hover:bg-navy-600">{c.ctaBtn2}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== تواصل سريع (CRM) ===== */}
      <section className="bg-baraka-light/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <HomeQuickForm locale={locale} />
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-2.5 text-sm font-bold tracking-wider text-gold">{c.faqKicker}</div>
            <h2 className="text-3xl font-black text-navy sm:text-4xl">{c.faqTitle}</h2>
          </div>
          <Faq items={c.faq as unknown as { q: string; a: string }[]} />
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-navy pt-16 pb-8 text-[#aebbcf]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3 text-white">
                <img src="/logo-mark.png" alt="Baraka Partners" width={40} height={40} className="h-10 w-10 shrink-0 rounded-[10px]" />
                <span className="flex flex-col items-start font-extrabold leading-tight">
                  <span className="block">{c.brand}</span>
                  <small className="block text-[10px] font-medium text-gold-soft">
                    <span className="inline-block tracking-[0.15em]">{c.brandSub}</span>
                  </small>
                </span>
              </div>
              <p className="mt-3.5 max-w-xs text-sm">{c.foot.about}</p>
            </div>
            <div>
              <h5 className="mb-4 font-bold text-white">{c.foot.platform}</h5>
              <ul className="flex flex-col gap-2.5 text-sm">
                {c.footPlatform.map(([label, href]) => <li key={href + label}><Link href={lh(href)} className="hover:text-gold">{label}</Link></li>)}
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-bold text-white">{c.foot.users}</h5>
              <ul className="flex flex-col gap-2.5 text-sm">
                {c.footUsers.map(([label, href]) => <li key={href + label}><Link href={lh(href)} className="hover:text-gold">{label}</Link></li>)}
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-bold text-white">{c.foot.legal}</h5>
              <ul className="flex flex-col gap-2.5 text-sm">
                {c.footLegal.map(([label, href]) => <li key={href + label}><Link href={lh(href)} className="hover:text-gold">{label}</Link></li>)}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[13px]">
            <span>{c.rights}</span>
            <span>العربية · English · Türkçe · 中文</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
