// محتوى صفحة «من نحن» بأربع لغات (ar/en/tr/zh) — يُعرض بتصميم موحّد حسب اللغة.
import type { Locale } from "@/lib/i18n";

export interface AboutContent {
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroIntro: string;
  ctaOpps: string;
  ctaContact: string;
  cardKicker: string;
  cardTitle: string;
  stats: [string, string][];
  countries: string[];
  introKicker: string;
  introTitle1: string;
  introTitle2: string;
  brand: string;
  intro1: string;
  intro2: string;
  intro3: string;
  pillarsKicker: string;
  pillarsTitle: string;
  pillars: { title: string; text: string }[];
  marketsKicker: string;
  marketsTitle: string;
  marketsIntro: string;
  markets: string[];
  marketDesc: string;
  modelKicker: string;
  modelTitle: string;
  modelIntro: string;
  models: { title: string; text: string }[];
  sectorsKicker: string;
  sectorsTitle: string;
  sectors: string[];
  processKicker: string;
  processTitle: string;
  steps: { title: string; text: string }[];
  govKicker: string;
  govTitle: string;
  govParas: string[];
  finalKicker: string;
  finalTitle: string;
  finalIntro: string;
  ctaRegister: string;
  ctaContact2: string;
}

const ar: AboutContent = {
  heroBadge: "منصة استثمارية تديرها عهد البركة",
  heroTitle1: "البركة بارتنرز",
  heroTitle2: "جسر الاستثمار والتشغيل بين الأسواق الواعدة ورأس المال الدولي",
  heroIntro:
    "منصة متخصصة في تنظيم الفرص الاستثمارية، استقطاب المستثمرين، ربط أصحاب الأصول والمشاريع بالشركات القادرة على التمويل أو التشغيل أو الإدارة، وبناء نماذج شراكة قابلة للتنفيذ في عدة دول وقطاعات.",
  ctaOpps: "استعرض الفرص الاستثمارية",
  ctaContact: "تواصل مع الإدارة",
  cardKicker: "نطاق عمل عابر للحدود",
  cardTitle: "فرص، مستثمرون، مشغلون، وشركاء تنفيذ في أسواق متعددة",
  stats: [
    ["عدة دول", "نطاق نشاط واستقطاب"],
    ["+8", "قطاعات استثمارية"],
    ["حوكمة", "وسرية متدرجة"],
    ["إدارة", "وتشغيل مشاريع"],
  ],
  countries: ["تركيا", "سوريا", "مصر", "الأردن", "قبرص", "الاتحاد الأوروبي"],
  introKicker: "من نحن",
  introTitle1: "لسنا منصة عرض فرص فقط.",
  introTitle2: "نحن منصة تنظيم واستقطاب وتشغيل.",
  brand: "البركة بارتنرز Baraka Partners",
  intro1:
    " هي منصة استثمارية وتطويرية تعمل تحت مظلة عهد البركة للاستثمار والتطوير، وتهدف إلى تحويل الفرص غير المنظمة إلى ملفات استثمارية قابلة للدراسة والتفاوض والتنفيذ.",
  intro2:
    "نعمل على ربط أصحاب المشاريع والأصول بالمستثمرين الجادين، وشركات التنفيذ، والمشغلين، وأصحاب الخبرة الصناعية والتجارية، ضمن إطار يحترم السرية، يحمي الأطراف، ويمنح كل فرصة هيكلًا مناسبًا حسب طبيعتها وحجمها.",
  intro3:
    "نشاطنا لا يقتصر على سوريا، رغم أهميتها ضمن محاور عملنا، بل يمتد إلى عدة دول وأسواق واعدة، مع التركيز على الفرص التي تحتاج إلى رأس مال، إدارة، تشغيل، أو توسع إقليمي ودولي.",
  pillarsKicker: "دورنا في الصفقة",
  pillarsTitle: "من الفكرة إلى الاستثمار، ومن الاستثمار إلى التشغيل",
  pillars: [
    { title: "تنظيم الفرص", text: "نفرز المشاريع، نراجع جديتها، ونحوّل البيانات الأولية إلى ملف استثماري قابل للعرض." },
    { title: "استقطاب المستثمرين", text: "نفتح قنوات مع مستثمرين وشركات من عدة دول، ونطابق الفرصة مع رأس المال المناسب." },
    { title: "إدارة المشاريع", text: "من خلال فرق عمل مؤهلة، نستطيع المساهمة في إدارة ومتابعة المشاريع في قطاعات متعددة." },
    { title: "التشغيل والشراكات", text: "نربط المشاريع بمشغلين وأصحاب مصانع وخبرات عملية لديهم الرغبة في التوسع ونقل خبرتهم إلى مواقع جديدة." },
  ],
  marketsKicker: "نطاق دولي متوسع",
  marketsTitle: "نعمل حيث توجد الفرصة، لا حيث توجد الحدود فقط",
  marketsIntro:
    "تمتد أعمال البركة بارتنرز إلى أسواق متعددة، مع اهتمام خاص بالدول التي تمتلك أصولًا ومشاريع قابلة للنمو، لكنها تحتاج إلى تنظيم، تمويل، إدارة، أو شريك تشغيل محترف.",
  markets: ["تركيا", "سوريا", "مصر", "الأردن", "قبرص", "الاتحاد الأوروبي", "الأسواق العربية", "شركاء دوليون"],
  marketDesc: "فرص استثمارية، تشغيلية، أو شراكات توسع حسب جاهزية السوق والمشروع.",
  modelKicker: "نموذج العمل",
  modelTitle: "نموذج مرن حسب طبيعة كل مشروع",
  modelIntro:
    "لا نفرض قالبًا واحدًا على كل صفقة. كل مشروع له حجم مختلف، مخاطرة مختلفة، وحاجة مختلفة. لذلك يتم تحديد دور عهد البركة بالتفاوض بين الأطراف.",
  models: [
    { title: "أتعاب نجاح", text: "في بعض الحالات تتقاضى عهد البركة أتعاب نجاح عند إتمام الاستثمار أو إغلاق الصفقة بين المستثمر وصاحب المشروع." },
    { title: "حصة مقابل الإدارة أو التطوير", text: "في حالات أخرى يمكن أن تدخل عهد البركة بحصة متفق عليها مقابل الإدارة، التطوير، التشغيل، تنظيم الشراكة، أو متابعة المشروع." },
    { title: "اتفاق حسب الحالة", text: "يتم تحديد النموذج النهائي بين الأطراف حسب حجم المشروع، نوع الاستثمار، مستوى الجهد المطلوب، المخاطر، وطبيعة الدور التشغيلي أو الإداري." },
  ],
  sectorsKicker: "قطاعات متعددة",
  sectorsTitle: "نعمل على فرص إنتاجية، عقارية، خدمية، وتشغيلية",
  sectors: ["العقار والتطوير", "الصناعة والمصانع", "الزراعة والأراضي", "الصناعات الغذائية", "اللوجستيات", "التكنولوجيا", "الطاقة الإنتاجية", "السياحة والخدمات"],
  processKicker: "كيف نعمل",
  processTitle: "مسار واضح يحمي الأطراف ويرفع جدية الاستثمار",
  steps: [
    { title: "استقبال الفرصة", text: "استلام البيانات الأولية من صاحب المشروع أو الأصل." },
    { title: "الفرز والتحقق", text: "مراجعة الجدية، الملكية، قابلية التنفيذ، والملاءمة الاستثمارية." },
    { title: "تجهيز الملف", text: "صياغة عرض استثماري مختصر وآمن يحمي البيانات الحساسة." },
    { title: "مطابقة المستثمر", text: "عرض الفرصة على المستثمرين أو المشغلين المناسبين حسب القطاع والدولة." },
    { title: "التفاوض والتنظيم", text: "تنظيم العلاقة بين الأطراف وبناء نموذج الصفقة المناسب." },
    { title: "الإدارة أو المتابعة", text: "المساهمة في الإدارة، التشغيل، أو المتابعة حسب الاتفاق النهائي." },
  ],
  govKicker: "السرية والحوكمة",
  govTitle: "الثقة ليست شعارًا. الثقة نظام عمل.",
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
  heroBadge: "An investment platform managed by Ahd Al-Baraka",
  heroTitle1: "Baraka Partners",
  heroTitle2: "A bridge for investment and operations between promising markets and international capital",
  heroIntro:
    "A platform specialized in structuring investment opportunities, attracting investors, connecting asset and project owners with companies able to finance, operate or manage, and building executable partnership models across several countries and sectors.",
  ctaOpps: "Browse opportunities",
  ctaContact: "Contact management",
  cardKicker: "A cross-border scope",
  cardTitle: "Opportunities, investors, operators and execution partners across multiple markets",
  stats: [
    ["Several countries", "Activity & sourcing scope"],
    ["8+", "Investment sectors"],
    ["Governance", "& graduated confidentiality"],
    ["Management", "& project operation"],
  ],
  countries: ["Turkey", "Syria", "Egypt", "Jordan", "Cyprus", "European Union"],
  introKicker: "About us",
  introTitle1: "We are not just an opportunity-listing platform.",
  introTitle2: "We are a platform for structuring, sourcing and operating.",
  brand: "Baraka Partners",
  intro1:
    " is an investment and development platform operating under the umbrella of Ahd Al-Baraka for Investment & Development, aiming to turn unstructured opportunities into investment files ready for study, negotiation and execution.",
  intro2:
    "We connect project and asset owners with serious investors, execution companies, operators, and holders of industrial and commercial expertise — within a framework that respects confidentiality, protects the parties, and gives each opportunity a structure suited to its nature and size.",
  intro3:
    "Our activity is not limited to Syria — despite its importance within our focus — but extends to several promising countries and markets, with emphasis on opportunities that need capital, management, operation, or regional and international expansion.",
  pillarsKicker: "Our role in the deal",
  pillarsTitle: "From idea to investment, and from investment to operation",
  pillars: [
    { title: "Structuring opportunities", text: "We screen projects, review their seriousness, and turn preliminary data into a presentable investment file." },
    { title: "Attracting investors", text: "We open channels with investors and companies from several countries, and match the opportunity with the right capital." },
    { title: "Project management", text: "Through qualified teams, we can contribute to managing and following up projects across multiple sectors." },
    { title: "Operation & partnerships", text: "We connect projects with operators, factory owners and hands-on expertise willing to expand and transfer their know-how to new locations." },
  ],
  marketsKicker: "An expanding international scope",
  marketsTitle: "We work where the opportunity is, not only where the borders are",
  marketsIntro:
    "Baraka Partners' work extends to multiple markets, with special interest in countries that hold growable assets and projects but need structuring, financing, management, or a professional operating partner.",
  markets: ["Turkey", "Syria", "Egypt", "Jordan", "Cyprus", "European Union", "Arab markets", "International partners"],
  marketDesc: "Investment, operational, or expansion-partnership opportunities depending on market and project readiness.",
  modelKicker: "Business model",
  modelTitle: "A flexible model suited to each project's nature",
  modelIntro:
    "We don't impose a single template on every deal. Each project has a different size, risk and need. The role of Ahd Al-Baraka is therefore defined through negotiation between the parties.",
  models: [
    { title: "Success fees", text: "In some cases, Ahd Al-Baraka charges a success fee upon completing the investment or closing the deal between investor and project owner." },
    { title: "Equity for management or development", text: "In other cases, Ahd Al-Baraka may take an agreed stake in return for management, development, operation, structuring the partnership, or following up the project." },
    { title: "Case-by-case agreement", text: "The final model is set between the parties according to project size, investment type, effort required, risk, and the nature of the operational or managerial role." },
  ],
  sectorsKicker: "Multiple sectors",
  sectorsTitle: "We work on productive, real-estate, service and operational opportunities",
  sectors: ["Real estate & development", "Industry & factories", "Agriculture & land", "Food industries", "Logistics", "Technology", "Productive energy", "Tourism & services"],
  processKicker: "How we work",
  processTitle: "A clear path that protects the parties and raises investment seriousness",
  steps: [
    { title: "Receiving the opportunity", text: "Receiving preliminary data from the project or asset owner." },
    { title: "Screening & verification", text: "Reviewing seriousness, ownership, feasibility, and investment suitability." },
    { title: "Preparing the file", text: "Drafting a concise, secure investment presentation that protects sensitive data." },
    { title: "Matching the investor", text: "Presenting the opportunity to suitable investors or operators by sector and country." },
    { title: "Negotiation & structuring", text: "Organizing the relationship between the parties and building the right deal model." },
    { title: "Management or follow-up", text: "Contributing to management, operation, or follow-up per the final agreement." },
  ],
  govKicker: "Confidentiality & governance",
  govTitle: "Trust is not a slogan. Trust is a working system.",
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
  heroBadge: "Ahd Al-Baraka tarafından yönetilen bir yatırım platformu",
  heroTitle1: "Baraka Partners",
  heroTitle2: "Gelecek vaat eden pazarlar ile uluslararası sermaye arasında yatırım ve işletme köprüsü",
  heroIntro:
    "Yatırım fırsatlarını yapılandırmada, yatırımcı çekmede, varlık ve proje sahiplerini finansman, işletme veya yönetim sağlayabilecek şirketlerle buluşturmada ve birden çok ülke ve sektörde uygulanabilir ortaklık modelleri kurmada uzmanlaşmış bir platform.",
  ctaOpps: "Yatırım fırsatlarını gör",
  ctaContact: "Yönetimle iletişime geç",
  cardKicker: "Sınır ötesi bir kapsam",
  cardTitle: "Birden çok pazarda fırsatlar, yatırımcılar, işletmeciler ve uygulama ortakları",
  stats: [
    ["Birden çok ülke", "Faaliyet ve kaynak kapsamı"],
    ["8+", "Yatırım sektörü"],
    ["Yönetişim", "ve kademeli gizlilik"],
    ["Yönetim", "ve proje işletmesi"],
  ],
  countries: ["Türkiye", "Suriye", "Mısır", "Ürdün", "Kıbrıs", "Avrupa Birliği"],
  introKicker: "Hakkımızda",
  introTitle1: "Yalnızca fırsat listeleyen bir platform değiliz.",
  introTitle2: "Yapılandırma, kaynak bulma ve işletme platformuyuz.",
  brand: "Baraka Partners",
  intro1:
    ", Ahd Al-Baraka Yatırım ve Geliştirme çatısı altında çalışan bir yatırım ve geliştirme platformudur; düzensiz fırsatları incelemeye, müzakereye ve uygulamaya hazır yatırım dosyalarına dönüştürmeyi amaçlar.",
  intro2:
    "Proje ve varlık sahiplerini; ciddi yatırımcılar, uygulama şirketleri, işletmeciler ve sınai-ticari uzmanlık sahipleriyle, gizliliğe saygı duyan, tarafları koruyan ve her fırsata niteliğine ve büyüklüğüne uygun bir yapı veren bir çerçevede buluştururuz.",
  intro3:
    "Faaliyetimiz — odağımızdaki önemine rağmen — Suriye ile sınırlı değildir; sermaye, yönetim, işletme veya bölgesel ve uluslararası genişlemeye ihtiyaç duyan fırsatlara odaklanarak birçok umut verici ülke ve pazara uzanır.",
  pillarsKicker: "Anlaşmadaki rolümüz",
  pillarsTitle: "Fikirden yatırıma, yatırımdan işletmeye",
  pillars: [
    { title: "Fırsatları yapılandırma", text: "Projeleri eler, ciddiyetini gözden geçirir ve ön verileri sunulabilir bir yatırım dosyasına dönüştürürüz." },
    { title: "Yatırımcı çekme", text: "Birden çok ülkeden yatırımcı ve şirketlerle kanallar açar, fırsatı doğru sermaye ile eşleştiririz." },
    { title: "Proje yönetimi", text: "Nitelikli ekiplerle, birden çok sektörde projelerin yönetimine ve takibine katkıda bulunabiliriz." },
    { title: "İşletme ve ortaklıklar", text: "Projeleri; genişlemek ve bilgi birikimini yeni konumlara taşımak isteyen işletmeciler, fabrika sahipleri ve saha uzmanlığıyla buluştururuz." },
  ],
  marketsKicker: "Genişleyen uluslararası kapsam",
  marketsTitle: "Sadece sınırların olduğu yerde değil, fırsatın olduğu yerde çalışırız",
  marketsIntro:
    "Baraka Partners'ın işi; büyüyebilir varlık ve projelere sahip ancak yapılandırma, finansman, yönetim veya profesyonel bir işletme ortağına ihtiyaç duyan ülkelere özel ilgiyle birçok pazara uzanır.",
  markets: ["Türkiye", "Suriye", "Mısır", "Ürdün", "Kıbrıs", "Avrupa Birliği", "Arap pazarları", "Uluslararası ortaklar"],
  marketDesc: "Pazar ve projenin hazırlığına göre yatırım, işletme veya genişleme ortaklığı fırsatları.",
  modelKicker: "İş modeli",
  modelTitle: "Her projenin niteliğine uygun esnek bir model",
  modelIntro:
    "Her anlaşmaya tek bir kalıp dayatmayız. Her projenin büyüklüğü, riski ve ihtiyacı farklıdır. Bu nedenle Ahd Al-Baraka'nın rolü taraflar arasında müzakereyle belirlenir.",
  models: [
    { title: "Başarı ücreti", text: "Bazı durumlarda Ahd Al-Baraka, yatırımın tamamlanması veya yatırımcı ile proje sahibi arasındaki anlaşmanın kapanması üzerine başarı ücreti alır." },
    { title: "Yönetim veya geliştirme karşılığı hisse", text: "Diğer durumlarda Ahd Al-Baraka; yönetim, geliştirme, işletme, ortaklığın yapılandırılması veya projenin takibi karşılığında üzerinde anlaşılan bir hisse alabilir." },
    { title: "Duruma göre anlaşma", text: "Nihai model; proje büyüklüğü, yatırım türü, gereken çaba, riskler ve işletme ya da yönetim rolünün niteliğine göre taraflar arasında belirlenir." },
  ],
  sectorsKicker: "Birden çok sektör",
  sectorsTitle: "Üretim, gayrimenkul, hizmet ve işletme fırsatları üzerinde çalışırız",
  sectors: ["Gayrimenkul ve geliştirme", "Sanayi ve fabrikalar", "Tarım ve arazi", "Gıda sanayileri", "Lojistik", "Teknoloji", "Üretken enerji", "Turizm ve hizmetler"],
  processKicker: "Nasıl çalışıyoruz",
  processTitle: "Tarafları koruyan ve yatırım ciddiyetini artıran net bir süreç",
  steps: [
    { title: "Fırsatın alınması", text: "Proje veya varlık sahibinden ön verilerin alınması." },
    { title: "Eleme ve doğrulama", text: "Ciddiyet, mülkiyet, uygulanabilirlik ve yatırıma uygunluğun gözden geçirilmesi." },
    { title: "Dosyanın hazırlanması", text: "Hassas verileri koruyan, özlü ve güvenli bir yatırım sunumunun hazırlanması." },
    { title: "Yatırımcı eşleştirme", text: "Fırsatın sektöre ve ülkeye göre uygun yatırımcı veya işletmecilere sunulması." },
    { title: "Müzakere ve yapılandırma", text: "Taraflar arasındaki ilişkinin düzenlenmesi ve doğru anlaşma modelinin kurulması." },
    { title: "Yönetim veya takip", text: "Nihai anlaşmaya göre yönetim, işletme veya takibe katkı." },
  ],
  govKicker: "Gizlilik ve yönetişim",
  govTitle: "Güven bir slogan değildir. Güven bir çalışma sistemidir.",
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
  heroBadge: "由 Ahd Al-Baraka 运营的投资平台",
  heroTitle1: "Baraka Partners",
  heroTitle2: "连接潜力市场与国际资本的投资与运营桥梁",
  heroIntro:
    "一个专注于构建投资机会、吸引投资者、将资产与项目方对接到具备融资、运营或管理能力的公司，并在多个国家和行业建立可落地合作模式的平台。",
  ctaOpps: "浏览投资机会",
  ctaContact: "联系管理团队",
  cardKicker: "跨境业务范围",
  cardTitle: "在多个市场中的机会、投资者、运营方与执行伙伴",
  stats: [
    ["多个国家", "业务与招商范围"],
    ["8+", "投资行业"],
    ["治理", "与分级保密"],
    ["管理", "与项目运营"],
  ],
  countries: ["土耳其", "叙利亚", "埃及", "约旦", "塞浦路斯", "欧盟"],
  introKicker: "关于我们",
  introTitle1: "我们不仅是一个机会展示平台。",
  introTitle2: "我们是构建、招商与运营的平台。",
  brand: "Baraka Partners",
  intro1:
    " 是一个在 Ahd Al-Baraka 投资与开发旗下运营的投资与开发平台，旨在将未经组织的机会转化为可供研究、谈判和执行的投资档案。",
  intro2:
    "我们在尊重保密、保护各方、并依据每个机会的性质与规模赋予其合适结构的框架内，将项目与资产方对接到认真的投资者、执行公司、运营方以及具备工业和商业经验的人士。",
  intro3:
    "我们的业务并不局限于叙利亚——尽管它在我们的重点中很重要——而是延伸到多个潜力国家和市场，重点关注需要资本、管理、运营或区域与国际扩张的机会。",
  pillarsKicker: "我们在交易中的角色",
  pillarsTitle: "从构想到投资，从投资到运营",
  pillars: [
    { title: "构建机会", text: "我们筛选项目、审查其严肃性，并将初步数据转化为可展示的投资档案。" },
    { title: "吸引投资者", text: "我们与多个国家的投资者和公司建立渠道，并将机会与合适的资本相匹配。" },
    { title: "项目管理", text: "通过专业团队，我们可在多个行业参与项目的管理与跟进。" },
    { title: "运营与合作", text: "我们将项目对接到愿意扩张并将其经验带到新地点的运营方、工厂主与实战经验者。" },
  ],
  marketsKicker: "不断扩展的国际范围",
  marketsTitle: "我们在有机会的地方开展业务，而不只是在有边界的地方",
  marketsIntro:
    "Baraka Partners 的业务延伸到多个市场，特别关注拥有可成长资产与项目、但需要组织、融资、管理或专业运营伙伴的国家。",
  markets: ["土耳其", "叙利亚", "埃及", "约旦", "塞浦路斯", "欧盟", "阿拉伯市场", "国际合作伙伴"],
  marketDesc: "根据市场与项目的成熟度，提供投资、运营或扩张合作机会。",
  modelKicker: "商业模式",
  modelTitle: "依据每个项目性质的灵活模式",
  modelIntro:
    "我们不对每笔交易强加单一模板。每个项目的规模、风险和需求各不相同。因此 Ahd Al-Baraka 的角色由各方协商确定。",
  models: [
    { title: "成功费", text: "在某些情况下，当投资完成或投资者与项目方之间的交易达成时，Ahd Al-Baraka 收取成功费。" },
    { title: "以管理或开发换取股权", text: "在其他情况下，Ahd Al-Baraka 可以约定的股权换取管理、开发、运营、组织合作或项目跟进。" },
    { title: "按具体情况约定", text: "最终模式由各方根据项目规模、投资类型、所需投入、风险以及运营或管理角色的性质共同确定。" },
  ],
  sectorsKicker: "多个行业",
  sectorsTitle: "我们涉足生产、房地产、服务与运营类机会",
  sectors: ["房地产与开发", "工业与工厂", "农业与土地", "食品工业", "物流", "科技", "生产性能源", "旅游与服务"],
  processKicker: "我们如何工作",
  processTitle: "一条保护各方并提升投资严肃性的清晰路径",
  steps: [
    { title: "接收机会", text: "从项目或资产方接收初步数据。" },
    { title: "筛选与核实", text: "审查严肃性、所有权、可行性和投资适配性。" },
    { title: "准备档案", text: "拟定简明、安全且保护敏感数据的投资展示。" },
    { title: "匹配投资者", text: "按行业和国家向合适的投资者或运营方展示机会。" },
    { title: "谈判与构建", text: "组织各方关系并构建合适的交易模式。" },
    { title: "管理或跟进", text: "根据最终协议参与管理、运营或跟进。" },
  ],
  govKicker: "保密与治理",
  govTitle: "信任不是口号。信任是一套工作体系。",
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
