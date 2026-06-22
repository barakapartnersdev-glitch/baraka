// محتوى صفحة «من نحن» بأربع لغات (ar/en/tr/zh). الصور ثابتة في public/about ولا تُترجَم.
import type { Locale } from "@/lib/i18n";

export interface AboutContent {
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroIntro: string;
  ctaOpps: string;
  ctaContact: string;
  heroStats: [string, string][];
  sectors: string[];
  introKicker: string;
  introTitle1: string;
  introTitle2: string;
  brand: string;
  intro1: string;
  intro2: string;
  intro3: string;
  countriesKicker: string;
  countriesTitle: string;
  countriesIntro: string;
  countries: string[];
  valueKicker: string;
  valueTitle: string;
  valueCards: { title: string; text: string }[];
  opKicker: string;
  opTitle: string;
  opParas: string[];
  opCardTitle: string;
  opCardText: string;
  modelKicker: string;
  modelTitle: string;
  modelIntro: string;
  models: { title: string; text: string }[];
  processKicker: string;
  processTitle: string;
  process: string[];
  govKicker: string;
  govTitle1: string;
  govTitle2: string;
  govParas: string[];
  finalKicker: string;
  finalTitle: string;
  finalIntro: string;
  ctaRegister: string;
  ctaContact2: string;
}

const ar: AboutContent = {
  heroBadge: "تديرها عهد البركة للاستثمار والتطوير",
  heroTitle1: "البركة بارتنرز",
  heroTitle2: "منصة استثمار وتشغيل عابرة للحدود",
  heroIntro:
    "نربط رأس المال، أصحاب الأصول، والشركات التشغيلية بفرص مدروسة في عدة دول وقطاعات، ونساعد على تحويل المشاريع الواعدة إلى مسارات استثمارية قابلة للتفاوض والتنفيذ.",
  ctaOpps: "استعرض الفرص الاستثمارية",
  ctaContact: "تواصل مع الإدارة",
  heroStats: [
    ["عدة دول", "نطاق استقطاب واستثمار"],
    ["قطاعات متعددة", "عقار، صناعة، زراعة، لوجستيات"],
    ["إدارة وتشغيل", "فرق ومشغلون وشركاء خبرة"],
    ["سرية وحوكمة", "عرض متدرج وحماية للأطراف"],
  ],
  sectors: ["التطوير العقاري", "الصناعة والتشغيل", "الزراعة والإنتاج", "اللوجستيات والتجارة"],
  introKicker: "من نحن",
  introTitle1: "لسنا منصة عرض فرص فقط.",
  introTitle2: "نحن منصة تنظيم واستقطاب وتشغيل.",
  brand: "البركة بارتنرز Baraka Partners",
  intro1:
    " هي منصة استثمارية وتطويرية تديرها عهد البركة، تعمل على تنظيم الفرص الاستثمارية، استقطاب المستثمرين، وربط أصحاب المشاريع والأصول بالشركات القادرة على التمويل، الإدارة، التشغيل أو الشراكة.",
  intro2:
    "لا نعمل كوسيط تقليدي يجمع فرصًا عشوائية. نقوم بفرز أولي، مراجعة جدية المشروع، تنظيم الملف، ثم عرضه على المستثمر أو المشغل المناسب بطريقة تحفظ السرية وتحترم مصالح جميع الأطراف.",
  intro3:
    "نشاطنا لا يقتصر على سوريا، رغم أهميتها ضمن محاور عملنا، بل يمتد إلى عدة دول وأسواق واعدة، مع التركيز على الفرص التي تحتاج إلى رأس مال، إدارة، تشغيل، أو توسع إقليمي ودولي.",
  countriesKicker: "نطاق دولي متوسع",
  countriesTitle: "نعمل حيث توجد الفرصة، لا حيث توجد الحدود فقط",
  countriesIntro:
    "تمتد أعمال البركة بارتنرز إلى أسواق متعددة، مع اهتمام خاص بالدول التي تمتلك أصولًا ومشاريع قابلة للنمو، لكنها تحتاج إلى تنظيم، تمويل، إدارة، أو شريك تشغيل محترف.",
  countries: ["تركيا", "سوريا", "مصر", "الأردن", "قبرص", "الاتحاد الأوروبي", "الأسواق العربية", "شركاء دوليون"],
  valueKicker: "قيمة تتجاوز الوساطة",
  valueTitle: "من الفكرة إلى الاستثمار، ومن الاستثمار إلى التشغيل",
  valueCards: [
    { title: "تنظيم الفرص", text: "نحوّل الفرص غير المنظمة إلى ملفات استثمارية واضحة، قابلة للدراسة والتفاوض." },
    { title: "استقطاب المستثمرين", text: "نربط المشاريع بالمستثمرين والشركات القادرة على التمويل أو الشراكة أو التوسع." },
    { title: "إدارة المشاريع", text: "نمارس دورًا إضافيًا عبر فرق عمل مؤهلة لمتابعة وإدارة المشاريع في قطاعات متعددة." },
    { title: "التشغيل ونقل الخبرة", text: "نربط المشاريع بمشغلين وأصحاب مصانع وخبرات عملية قادرة على الدخول بعقود تشغيل محلية أو عالمية." },
  ],
  opKicker: "التشغيل ونقل الخبرة",
  opTitle: "نربط المشاريع بخبرات تشغيل حقيقية",
  opParas: [
    "تمتلك عهد البركة القدرة على ممارسة دور إضافي من خلال فرق عمل مؤهلة لإدارة ومتابعة المشاريع في قطاعات متعددة.",
    "كما تعتمد على شبكة علاقات واسعة مع أصحاب أعمال ومصانع ومشغلين لديهم الرغبة في الدخول بعقود تشغيل محلية أو عالمية، ونقل خبرتهم إلى مواقع وأسواق جديدة.",
    "هذا يجعل البركة بارتنرز أكثر من منصة تعريف بين طرفين؛ إنها مساحة لبناء نموذج تشغيل واستثمار قابل للتطبيق.",
  ],
  opCardTitle: "تشغيل، إدارة، وتوسع",
  opCardText: "خبرات عملية قابلة للنقل إلى مشاريع وأسواق جديدة.",
  modelKicker: "نموذج العمل",
  modelTitle: "نموذج مرن حسب طبيعة كل فرصة",
  modelIntro:
    "لا نفرض قالبًا واحدًا على كل صفقة. يتم تحديد دور عهد البركة بالتفاوض بين الأطراف حسب طبيعة المشروع، حجم الدور، ومستوى الجهد المطلوب.",
  models: [
    { title: "أتعاب نجاح", text: "عند إتمام الاستثمار أو إغلاق الصفقة بين المستثمر وصاحب المشروع." },
    { title: "حصة مقابل الإدارة", text: "عندما يكون لعهد البركة دور إداري أو تشغيلي أو تطويري واضح ومتفق عليه." },
    { title: "اتفاق حسب الحالة", text: "يتم تحديد النموذج النهائي حسب حجم المشروع، المخاطر، وطبيعة مساهمة كل طرف." },
  ],
  processKicker: "كيف نعمل",
  processTitle: "مسار واضح يحمي الأطراف ويرفع جدية الاستثمار",
  process: ["استقبال الفرصة", "الفرز والتحقق", "تجهيز الملف", "مطابقة المستثمر", "تنظيم التفاوض", "المتابعة أو الإدارة"],
  govKicker: "السرية والحوكمة",
  govTitle1: "الثقة ليست شعارًا.",
  govTitle2: "الثقة نظام عمل.",
  govParas: [
    "نحمي بيانات أصحاب المشاريع والمستثمرين عبر عرض متدرج للمعلومات، بحيث لا يتم كشف التفاصيل الحساسة إلا بعد تحقق الجدية واعتماد المسار المناسب.",
    "كل فرصة تمر بمرحلة مراجعة وتنظيم قبل عرضها، لأن عرض الفرص الضعيفة أو غير الواضحة يضر بالمستثمر وبصاحب المشروع وبسمعة المنصة.",
  ],
  finalKicker: "ابدأ من هنا",
  finalTitle: "لديك رأس مال، مشروع، مصنع، أصل، أو خبرة تشغيلية قابلة للتوسع؟",
  finalIntro: "البركة بارتنرز تساعدك على تحويل الفرصة إلى مسار واضح، منظم، وقابل للتفاوض والتنفيذ.",
  ctaRegister: "سجّل كمستثمر",
  ctaContact2: "قدّم فرصة أو تواصل معنا",
};

const en: AboutContent = {
  heroBadge: "Managed by Ahd Al-Baraka for Investment & Development",
  heroTitle1: "Baraka Partners",
  heroTitle2: "A cross-border investment and operations platform",
  heroIntro:
    "We connect capital, asset owners, and operating companies with well-studied opportunities across several countries and sectors, and help turn promising projects into investment paths ready for negotiation and execution.",
  ctaOpps: "Browse opportunities",
  ctaContact: "Contact management",
  heroStats: [
    ["Several countries", "Sourcing & investment scope"],
    ["Multiple sectors", "Real estate, industry, agriculture, logistics"],
    ["Management & operation", "Teams, operators & expert partners"],
    ["Confidentiality & governance", "Graduated disclosure & protection"],
  ],
  sectors: ["Real estate development", "Industry & operation", "Agriculture & production", "Logistics & trade"],
  introKicker: "About us",
  introTitle1: "We are not just an opportunity-listing platform.",
  introTitle2: "We are a platform for structuring, sourcing and operating.",
  brand: "Baraka Partners",
  intro1:
    " is an investment and development platform managed by Ahd Al-Baraka. It structures investment opportunities, attracts investors, and connects project and asset owners with companies able to finance, manage, operate or partner.",
  intro2:
    "We don't work as a traditional broker gathering random opportunities. We carry out initial screening, review the project's seriousness, organize the file, then present it to the right investor or operator in a way that preserves confidentiality and respects all parties' interests.",
  intro3:
    "Our activity is not limited to Syria — despite its importance within our focus — but extends to several promising countries and markets, with emphasis on opportunities that need capital, management, operation, or regional and international expansion.",
  countriesKicker: "An expanding international scope",
  countriesTitle: "We work where the opportunity is, not only where the borders are",
  countriesIntro:
    "Baraka Partners' work extends to multiple markets, with special interest in countries that hold growable assets and projects but need structuring, financing, management, or a professional operating partner.",
  countries: ["Turkey", "Syria", "Egypt", "Jordan", "Cyprus", "European Union", "Arab markets", "International partners"],
  valueKicker: "Value beyond brokerage",
  valueTitle: "From idea to investment, and from investment to operation",
  valueCards: [
    { title: "Structuring opportunities", text: "We turn unstructured opportunities into clear investment files, ready for study and negotiation." },
    { title: "Attracting investors", text: "We connect projects with investors and companies able to finance, partner or expand." },
    { title: "Project management", text: "We play an added role through qualified teams to follow up and manage projects across multiple sectors." },
    { title: "Operation & know-how transfer", text: "We connect projects with operators, factory owners and hands-on expertise able to enter local or global operating contracts." },
  ],
  opKicker: "Operation & know-how transfer",
  opTitle: "We connect projects with real operating expertise",
  opParas: [
    "Ahd Al-Baraka has the capacity to play an added role through qualified teams that manage and follow up projects across multiple sectors.",
    "It also relies on a wide network of business owners, factories and operators willing to enter local or global operating contracts and transfer their expertise to new locations and markets.",
    "This makes Baraka Partners more than a matchmaking platform between two parties — it is a space to build an applicable operating and investment model.",
  ],
  opCardTitle: "Operate, manage, expand",
  opCardText: "Practical expertise transferable to new projects and markets.",
  modelKicker: "Business model",
  modelTitle: "A flexible model suited to each opportunity's nature",
  modelIntro:
    "We don't impose a single template on every deal. Ahd Al-Baraka's role is defined through negotiation between the parties, according to the project's nature, the size of the role, and the level of effort required.",
  models: [
    { title: "Success fees", text: "Upon completing the investment or closing the deal between investor and project owner." },
    { title: "Equity for management", text: "When Ahd Al-Baraka has a clear, agreed managerial, operational or development role." },
    { title: "Case-by-case agreement", text: "The final model is set according to project size, risks, and the nature of each party's contribution." },
  ],
  processKicker: "How we work",
  processTitle: "A clear path that protects the parties and raises investment seriousness",
  process: ["Receiving the opportunity", "Screening & verification", "Preparing the file", "Matching the investor", "Structuring negotiation", "Follow-up or management"],
  govKicker: "Confidentiality & governance",
  govTitle1: "Trust is not a slogan.",
  govTitle2: "Trust is a working system.",
  govParas: [
    "We protect the data of project owners and investors through graduated disclosure, so sensitive details are revealed only after seriousness is verified and the right path is approved.",
    "Every opportunity goes through a review and structuring stage before being presented, because presenting weak or unclear opportunities harms the investor, the project owner, and the platform's reputation.",
  ],
  finalKicker: "Start here",
  finalTitle: "Do you have capital, a project, a factory, an asset, or scalable operating expertise?",
  finalIntro: "Baraka Partners helps you turn the opportunity into a clear, structured path ready for negotiation and execution.",
  ctaRegister: "Register as an investor",
  ctaContact2: "Submit an opportunity or contact us",
};

const tr: AboutContent = {
  heroBadge: "Ahd Al-Baraka Yatırım ve Geliştirme tarafından yönetilir",
  heroTitle1: "Baraka Partners",
  heroTitle2: "Sınır ötesi bir yatırım ve işletme platformu",
  heroIntro:
    "Sermayeyi, varlık sahiplerini ve işletme şirketlerini birden çok ülke ve sektörde iyi incelenmiş fırsatlarla buluşturur, gelecek vaat eden projeleri müzakereye ve uygulamaya hazır yatırım yollarına dönüştürmeye yardımcı oluruz.",
  ctaOpps: "Yatırım fırsatlarını gör",
  ctaContact: "Yönetimle iletişime geç",
  heroStats: [
    ["Birden çok ülke", "Kaynak ve yatırım kapsamı"],
    ["Çok sayıda sektör", "Gayrimenkul, sanayi, tarım, lojistik"],
    ["Yönetim ve işletme", "Ekipler, işletmeciler ve uzman ortaklar"],
    ["Gizlilik ve yönetişim", "Kademeli paylaşım ve koruma"],
  ],
  sectors: ["Gayrimenkul geliştirme", "Sanayi ve işletme", "Tarım ve üretim", "Lojistik ve ticaret"],
  introKicker: "Hakkımızda",
  introTitle1: "Yalnızca fırsat listeleyen bir platform değiliz.",
  introTitle2: "Yapılandırma, kaynak bulma ve işletme platformuyuz.",
  brand: "Baraka Partners",
  intro1:
    ", Ahd Al-Baraka tarafından yönetilen bir yatırım ve geliştirme platformudur. Yatırım fırsatlarını yapılandırır, yatırımcı çeker ve proje ile varlık sahiplerini finansman, yönetim, işletme veya ortaklık sağlayabilecek şirketlerle buluşturur.",
  intro2:
    "Rastgele fırsatlar toplayan geleneksel bir aracı gibi çalışmayız. Ön eleme yapar, projenin ciddiyetini gözden geçirir, dosyayı düzenler ve ardından gizliliği koruyan, tüm tarafların çıkarlarına saygı gösteren bir biçimde doğru yatırımcı veya işletmeciye sunarız.",
  intro3:
    "Faaliyetimiz — odağımızdaki önemine rağmen — Suriye ile sınırlı değildir; sermaye, yönetim, işletme veya bölgesel ve uluslararası genişlemeye ihtiyaç duyan fırsatlara odaklanarak birçok umut verici ülke ve pazara uzanır.",
  countriesKicker: "Genişleyen uluslararası kapsam",
  countriesTitle: "Sadece sınırların olduğu yerde değil, fırsatın olduğu yerde çalışırız",
  countriesIntro:
    "Baraka Partners'ın işi; büyüyebilir varlık ve projelere sahip ancak yapılandırma, finansman, yönetim veya profesyonel bir işletme ortağına ihtiyaç duyan ülkelere özel ilgiyle birçok pazara uzanır.",
  countries: ["Türkiye", "Suriye", "Mısır", "Ürdün", "Kıbrıs", "Avrupa Birliği", "Arap pazarları", "Uluslararası ortaklar"],
  valueKicker: "Aracılığın ötesinde değer",
  valueTitle: "Fikirden yatırıma, yatırımdan işletmeye",
  valueCards: [
    { title: "Fırsatları yapılandırma", text: "Düzensiz fırsatları incelemeye ve müzakereye hazır, net yatırım dosyalarına dönüştürürüz." },
    { title: "Yatırımcı çekme", text: "Projeleri; finansman, ortaklık veya genişleme sağlayabilecek yatırımcı ve şirketlerle buluştururuz." },
    { title: "Proje yönetimi", text: "Nitelikli ekiplerle, birden çok sektörde projeleri takip etmek ve yönetmek için ek bir rol üstleniriz." },
    { title: "İşletme ve bilgi aktarımı", text: "Projeleri; yerel veya küresel işletme sözleşmelerine girebilecek işletmeciler, fabrika sahipleri ve saha uzmanlığıyla buluştururuz." },
  ],
  opKicker: "İşletme ve bilgi aktarımı",
  opTitle: "Projeleri gerçek işletme uzmanlığıyla buluştururuz",
  opParas: [
    "Ahd Al-Baraka, birden çok sektörde projeleri yöneten ve takip eden nitelikli ekipler aracılığıyla ek bir rol üstlenme kapasitesine sahiptir.",
    "Ayrıca; yerel veya küresel işletme sözleşmelerine girmeye ve uzmanlığını yeni konum ve pazarlara taşımaya istekli iş insanları, fabrikalar ve işletmecilerden oluşan geniş bir ağa dayanır.",
    "Bu, Baraka Partners'ı iki taraf arasında tanıştıran bir platformdan fazlası yapar — uygulanabilir bir işletme ve yatırım modeli kurma alanıdır.",
  ],
  opCardTitle: "İşlet, yönet, büyüt",
  opCardText: "Yeni proje ve pazarlara aktarılabilir pratik uzmanlık.",
  modelKicker: "İş modeli",
  modelTitle: "Her fırsatın niteliğine uygun esnek bir model",
  modelIntro:
    "Her anlaşmaya tek bir kalıp dayatmayız. Ahd Al-Baraka'nın rolü; projenin niteliğine, rolün büyüklüğüne ve gereken çaba düzeyine göre taraflar arasında müzakereyle belirlenir.",
  models: [
    { title: "Başarı ücreti", text: "Yatırımın tamamlanması veya yatırımcı ile proje sahibi arasındaki anlaşmanın kapanması üzerine." },
    { title: "Yönetim karşılığı hisse", text: "Ahd Al-Baraka'nın net ve üzerinde anlaşılmış bir yönetim, işletme veya geliştirme rolü olduğunda." },
    { title: "Duruma göre anlaşma", text: "Nihai model; proje büyüklüğü, riskler ve her tarafın katkısının niteliğine göre belirlenir." },
  ],
  processKicker: "Nasıl çalışıyoruz",
  processTitle: "Tarafları koruyan ve yatırım ciddiyetini artıran net bir süreç",
  process: ["Fırsatın alınması", "Eleme ve doğrulama", "Dosyanın hazırlanması", "Yatırımcı eşleştirme", "Müzakerenin yapılandırılması", "Takip veya yönetim"],
  govKicker: "Gizlilik ve yönetişim",
  govTitle1: "Güven bir slogan değildir.",
  govTitle2: "Güven bir çalışma sistemidir.",
  govParas: [
    "Proje sahiplerinin ve yatırımcıların verilerini kademeli bilgi paylaşımıyla koruruz; hassas ayrıntılar ancak ciddiyet doğrulandıktan ve doğru yol onaylandıktan sonra açıklanır.",
    "Her fırsat sunulmadan önce bir inceleme ve yapılandırma aşamasından geçer; çünkü zayıf veya belirsiz fırsatları sunmak yatırımcıya, proje sahibine ve platformun itibarına zarar verir.",
  ],
  finalKicker: "Buradan başlayın",
  finalTitle: "Sermayeniz, bir projeniz, bir fabrikanız, bir varlığınız veya ölçeklenebilir işletme deneyiminiz mi var?",
  finalIntro: "Baraka Partners, fırsatı net, yapılandırılmış ve müzakereye ve uygulamaya hazır bir yola dönüştürmenize yardımcı olur.",
  ctaRegister: "Yatırımcı olarak kaydol",
  ctaContact2: "Bir fırsat sun veya bize ulaş",
};

const zh: AboutContent = {
  heroBadge: "由 Ahd Al-Baraka 投资与开发运营",
  heroTitle1: "Baraka Partners",
  heroTitle2: "跨境投资与运营平台",
  heroIntro:
    "我们将资本、资产方与运营公司对接到多个国家和行业中经过研究的机会，并帮助把有潜力的项目转化为可供谈判和执行的投资路径。",
  ctaOpps: "浏览投资机会",
  ctaContact: "联系管理团队",
  heroStats: [
    ["多个国家", "招商与投资范围"],
    ["多个行业", "房地产、工业、农业、物流"],
    ["管理与运营", "团队、运营方与专家伙伴"],
    ["保密与治理", "分级披露与各方保护"],
  ],
  sectors: ["房地产开发", "工业与运营", "农业与生产", "物流与贸易"],
  introKicker: "关于我们",
  introTitle1: "我们不仅是一个机会展示平台。",
  introTitle2: "我们是构建、招商与运营的平台。",
  brand: "Baraka Partners",
  intro1:
    " 是由 Ahd Al-Baraka 运营的投资与开发平台。我们构建投资机会、吸引投资者，并将项目与资产方对接到能够提供融资、管理、运营或合作的公司。",
  intro2:
    "我们并非传统中介那样收集随意的机会。我们进行初步筛选、审查项目的严肃性、组织档案，然后以维护保密、尊重各方利益的方式呈现给合适的投资者或运营方。",
  intro3:
    "我们的业务并不局限于叙利亚——尽管它在我们的重点中很重要——而是延伸到多个潜力国家和市场，重点关注需要资本、管理、运营或区域与国际扩张的机会。",
  countriesKicker: "不断扩展的国际范围",
  countriesTitle: "我们在有机会的地方开展业务，而不只是在有边界的地方",
  countriesIntro:
    "Baraka Partners 的业务延伸到多个市场，特别关注拥有可成长资产与项目、但需要组织、融资、管理或专业运营伙伴的国家。",
  countries: ["土耳其", "叙利亚", "埃及", "约旦", "塞浦路斯", "欧盟", "阿拉伯市场", "国际合作伙伴"],
  valueKicker: "超越中介的价值",
  valueTitle: "从构想到投资，从投资到运营",
  valueCards: [
    { title: "构建机会", text: "我们将未经组织的机会转化为清晰的投资档案，可供研究与谈判。" },
    { title: "吸引投资者", text: "我们将项目对接到能够融资、合作或扩张的投资者与公司。" },
    { title: "项目管理", text: "我们通过专业团队发挥附加作用，在多个行业跟进和管理项目。" },
    { title: "运营与经验转移", text: "我们将项目对接到能够签订本地或全球运营合同的运营方、工厂主与实战经验者。" },
  ],
  opKicker: "运营与经验转移",
  opTitle: "我们将项目对接到真正的运营经验",
  opParas: [
    "Ahd Al-Baraka 有能力通过在多个行业管理和跟进项目的专业团队发挥附加作用。",
    "我们还依托广泛的人脉网络——愿意签订本地或全球运营合同、并将经验带到新地点和市场的企业主、工厂与运营方。",
    "这使 Baraka Partners 不仅是双方之间的对接平台，更是构建可落地运营与投资模式的空间。",
  ],
  opCardTitle: "运营、管理、扩张",
  opCardText: "可迁移到新项目与新市场的实战经验。",
  modelKicker: "商业模式",
  modelTitle: "依据每个机会性质的灵活模式",
  modelIntro:
    "我们不对每笔交易强加单一模板。Ahd Al-Baraka 的角色由各方根据项目性质、角色大小和所需投入程度协商确定。",
  models: [
    { title: "成功费", text: "在投资完成或投资者与项目方之间的交易达成时收取。" },
    { title: "以管理换取股权", text: "当 Ahd Al-Baraka 拥有明确且约定的管理、运营或开发角色时。" },
    { title: "按具体情况约定", text: "最终模式根据项目规模、风险以及各方贡献的性质确定。" },
  ],
  processKicker: "我们如何工作",
  processTitle: "一条保护各方并提升投资严肃性的清晰路径",
  process: ["接收机会", "筛选与核实", "准备档案", "匹配投资者", "组织谈判", "跟进或管理"],
  govKicker: "保密与治理",
  govTitle1: "信任不是口号。",
  govTitle2: "信任是一套工作体系。",
  govParas: [
    "我们通过分级披露信息来保护项目方与投资者的数据，只有在核实严肃性并确定合适路径之后，才会披露敏感细节。",
    "每个机会在展示前都会经过审查与构建阶段，因为展示薄弱或不清晰的机会会损害投资者、项目方以及平台的声誉。",
  ],
  finalKicker: "从这里开始",
  finalTitle: "您是否拥有资本、项目、工厂、资产或可扩展的运营经验？",
  finalIntro: "Baraka Partners 帮助您将机会转化为清晰、有序、可供谈判和执行的路径。",
  ctaRegister: "注册为投资者",
  ctaContact2: "提交机会或联系我们",
};

export const ABOUT: Record<Locale, AboutContent> = { ar, en, tr, zh };
