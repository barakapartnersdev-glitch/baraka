// محتوى صفحة «كيف تعمل المنصة» بأربع لغات (ar/en/tr/zh). الصور والروابط ثابتة في الصفحة.
import type { Locale } from "@/lib/i18n";

export interface HowContent {
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroIntro: string;
  ctaInvestor: string;
  ctaOwner: string;
  heroStats: [string, string][];
  introKicker: string;
  introTitle1: string;
  introTitle2: string;
  introParas: string[];
  tracksKicker: string;
  tracksTitle: string;
  tracks: { title: string; points: string[]; cta: string }[];
  processKicker: string;
  processTitle: string;
  steps: { number: string; title: string; text: string }[];
  privacyKicker: string;
  privacyTitle: string;
  privacyIntro: string;
  privacyLevels: { title: string; tag: string; text: string }[];
  beyondKicker: string;
  beyondTitle: string;
  beyondParas: string[];
  beyondCardTitle: string;
  beyondCardText: string;
  sectorsKicker: string;
  sectorsTitle: string;
  sectorDesc: string;
  sectors: string[];
  finalKicker: string;
  finalTitle: string;
  finalIntro: string;
  ctaRegister: string;
  ctaSubmit: string;
}

const ar: HowContent = {
  heroBadge: "كيف تعمل المنصة",
  heroTitle1: "مسار استثماري واضح",
  heroTitle2: "يحمي السرية ويرفع جدية الصفقة",
  heroIntro:
    "من تسجيل المستثمر أو صاحب الفرصة، إلى التأهيل، العرض المتدرج، اتفاقيات السرية، التفاوض، ثم الوصول إلى نموذج استثمار أو تشغيل قابل للتنفيذ.",
  ctaInvestor: "ابدأ كمستثمر",
  ctaOwner: "لديّ فرصة أو أصل",
  heroStats: [
    ["01", "تسجيل وتأهيل"],
    ["02", "عرض آمن ومجهّل"],
    ["03", "سرية متدرجة"],
    ["04", "تفاوض وإغلاق"],
  ],
  introKicker: "الفكرة ببساطة",
  introTitle1: "المنصة لا تكشف كل شيء من البداية.",
  introTitle2: "وهذا بالضبط مصدر قوتها.",
  introParas: [
    "تعمل البركة بارتنرز وفق مسار متدرج يحمي صاحب المشروع من كشف بياناته الحساسة، وفي نفس الوقت يمنح المستثمر ما يكفي من المعلومات لاتخاذ قرار جاد قبل الانتقال إلى التفاصيل الكاملة.",
    "كل فرصة تمر بمراجعة بشرية وتنظيم داخلي قبل عرضها، ثم تُقدّم للزائر أو المستثمر المسجل بمستويات مختلفة من التفاصيل، وصولًا إلى الملف الكامل بعد تحقق الجدية والالتزام بالسرية.",
  ],
  tracksKicker: "مساران واضحان",
  tracksTitle: "أينما كان موقعك في الصفقة، نجهّز لك الطريق",
  tracks: [
    {
      title: "للمستثمرين",
      points: [
        "استعراض فرص مختصرة ومؤهلة.",
        "فلترة حسب الدولة والقطاع وحجم الاستثمار.",
        "طلب الاطلاع على التفاصيل الكاملة.",
        "متابعة العلاقة مع فريق متخصص.",
      ],
      cta: "سجّل كمستثمر",
    },
    {
      title: "لأصحاب الفرص والأصول",
      points: [
        "تقديم مشروع، أرض، مصنع، شركة، أو فرصة توسع.",
        "تأهيل الفرصة وتجهيز ملفها الاستثماري.",
        "حماية الهوية والبيانات الحساسة.",
        "الوصول إلى مستثمرين وشركاء تشغيل مناسبين.",
      ],
      cta: "قدّم فرصتك",
    },
  ],
  processKicker: "رحلة الصفقة",
  processTitle: "من البيانات الأولية إلى صفقة قابلة للتنفيذ",
  steps: [
    { number: "01", title: "تسجيل المستثمر أو صاحب الفرصة", text: "تبدأ الرحلة بإنشاء حساب أو تقديم فرصة استثمارية، مع إدخال البيانات الأساسية التي تساعد فريق المنصة على فهم طبيعة الطلب." },
    { number: "02", title: "المراجعة والتأهيل الداخلي", text: "تراجع الإدارة البيانات، وتتحقق من جدية الفرصة أو المستثمر، ثم تحدد مدى جاهزية الملف للعرض أو المطابقة." },
    { number: "03", title: "إعداد عرض مختصر وآمن", text: "تُصاغ الفرصة بطريقة مهنية ومجهّلة، دون كشف هوية صاحب المشروع أو الموقع الدقيق أو التفاصيل الحساسة." },
    { number: "04", title: "مطابقة الفرصة مع المستثمر المناسب", text: "لا تُعرض الفرص بشكل عشوائي، بل يتم ربطها بالمستثمرين أو الشركات الأنسب حسب القطاع والدولة وحجم الاستثمار." },
    { number: "05", title: "فتح التفاصيل بعد الجدية والسرية", text: "بعد تحقق الجدية واعتماد الطلب، تُفتح التفاصيل الكاملة ضمن إطار من السرية والحوكمة واتفاقيات الحماية المناسبة." },
    { number: "06", title: "التفاوض، الهيكلة، والإغلاق", text: "ترافق المنصة الأطراف في تنظيم التفاوض، بناء نموذج الصفقة، والوصول إلى اتفاق استثماري أو تشغيلي قابل للتنفيذ." },
  ],
  privacyKicker: "السرية المتدرجة",
  privacyTitle: "كل معلومة تظهر في وقتها الصحيح",
  privacyIntro:
    "لا يتم كشف هوية صاحب المشروع أو الموقع الدقيق أو المستندات الحساسة للعامة. يتم الانتقال من العرض المختصر إلى الملف الكامل فقط بعد تحقق الجدية واعتماد المسار المناسب.",
  privacyLevels: [
    { title: "عرض عام", tag: "للزائر", text: "وصف مختصر ومجهّل للفرصة دون كشف الاسم أو الموقع الدقيق أو المستندات الحساسة." },
    { title: "عرض موسّع", tag: "للمستثمر المسجّل", text: "تفاصيل أوسع تساعد المستثمر على تقييم الاهتمام الأولي قبل طلب الاطلاع الكامل." },
    { title: "ملف كامل", tag: "بعد الاعتماد والسرية", text: "المعلومات الكاملة، المستندات، بيانات التواصل، والتفاصيل الدقيقة بعد تحقق الجدية وحماية الأطراف." },
  ],
  beyondKicker: "لسنا وسطاء فقط",
  beyondTitle: "عندما تحتاج الفرصة إلى إدارة أو تشغيل، نستطيع الدخول في العمق",
  beyondParas: [
    "في بعض الفرص، لا يكفي أن نربط المستثمر بصاحب المشروع. قد يحتاج المشروع إلى مشغل، مدير تنفيذي، فريق متابعة، أو خبرة صناعية وتجارية قادرة على نقل نموذج ناجح إلى موقع جديد.",
    "لذلك تستطيع عهد البركة، بحسب الاتفاق بين الأطراف، أن تمارس دورًا إضافيًا في الإدارة أو التشغيل أو التطوير، عبر فرق عمل مؤهلة وشبكة علاقات واسعة مع أصحاب أعمال ومصانع ومشغلين.",
    "وقد يكون نموذج عمل عهد البركة أتعاب نجاح عند إتمام الاستثمار، أو حصة متفق عليها مقابل الإدارة أو التشغيل أو التطوير، حسب طبيعة كل حالة.",
  ],
  beyondCardTitle: "ما بعد الربط",
  beyondCardText: "إدارة، تشغيل، متابعة، ونقل خبرات إلى مواقع وأسواق جديدة.",
  sectorsKicker: "قطاعات المنصة",
  sectorsTitle: "نستقبل وندرس الفرص في قطاعات متنوعة",
  sectorDesc: "فرص قابلة للدراسة، التمويل، الشراكة، الإدارة، أو التشغيل حسب جاهزية كل مشروع.",
  sectors: ["العقار والتطوير", "الصناعة والمصانع", "الزراعة والأراضي", "الصناعات الغذائية", "الطاقة", "السياحة والفنادق", "اللوجستيات", "التكنولوجيا والفنتك"],
  finalKicker: "ابدأ رحلتك الآن",
  finalTitle: "مستثمر تبحث عن فرصة؟ أم صاحب أصل تبحث عن شريك؟",
  finalIntro: "البركة بارتنرز تنظّم المسار، تحمي البيانات، وتربط الأطراف الجادة ضمن نموذج واضح وقابل للتنفيذ.",
  ctaRegister: "سجّل كمستثمر",
  ctaSubmit: "قدّم فرصتك الاستثمارية",
};

const en: HowContent = {
  heroBadge: "How the platform works",
  heroTitle1: "A clear investment path",
  heroTitle2: "that protects confidentiality and raises deal seriousness",
  heroIntro:
    "From registering the investor or opportunity owner, to qualification, graduated disclosure, confidentiality agreements, negotiation, then reaching an executable investment or operating model.",
  ctaInvestor: "Start as an investor",
  ctaOwner: "I have an opportunity or asset",
  heroStats: [
    ["01", "Registration & qualification"],
    ["02", "Secure, anonymized presentation"],
    ["03", "Graduated confidentiality"],
    ["04", "Negotiation & closing"],
  ],
  introKicker: "The idea, simply",
  introTitle1: "The platform doesn't reveal everything from the start.",
  introTitle2: "And that is exactly its strength.",
  introParas: [
    "Baraka Partners works through a graduated path that protects the project owner from exposing sensitive data, while giving the investor enough information to make a serious decision before moving to full details.",
    "Every opportunity goes through human review and internal structuring before being presented, then it is offered to the visitor or registered investor at different levels of detail, up to the full file after seriousness is verified and confidentiality is committed.",
  ],
  tracksKicker: "Two clear tracks",
  tracksTitle: "Wherever you stand in the deal, we prepare the path for you",
  tracks: [
    {
      title: "For investors",
      points: [
        "Browse concise, qualified opportunities.",
        "Filter by country, sector and investment size.",
        "Request access to the full details.",
        "Follow up the relationship with a specialized team.",
      ],
      cta: "Register as an investor",
    },
    {
      title: "For opportunity & asset owners",
      points: [
        "Submit a project, land, factory, company, or expansion opportunity.",
        "Qualify the opportunity and prepare its investment file.",
        "Protect identity and sensitive data.",
        "Reach suitable investors and operating partners.",
      ],
      cta: "Submit your opportunity",
    },
  ],
  processKicker: "The deal journey",
  processTitle: "From preliminary data to an executable deal",
  steps: [
    { number: "01", title: "Investor or opportunity owner registration", text: "The journey starts by creating an account or submitting an investment opportunity, entering the basic data that helps the team understand the nature of the request." },
    { number: "02", title: "Internal review & qualification", text: "Management reviews the data, verifies the seriousness of the opportunity or investor, then determines how ready the file is for presentation or matching." },
    { number: "03", title: "Preparing a concise, secure presentation", text: "The opportunity is drafted professionally and anonymized, without revealing the owner's identity, exact location, or sensitive details." },
    { number: "04", title: "Matching the opportunity with the right investor", text: "Opportunities are not shown randomly; they are connected to the most suitable investors or companies by sector, country and investment size." },
    { number: "05", title: "Unlocking details after seriousness & confidentiality", text: "After seriousness is verified and the request approved, full details are unlocked within a framework of confidentiality, governance and appropriate protection agreements." },
    { number: "06", title: "Negotiation, structuring & closing", text: "The platform accompanies the parties in organizing negotiation, building the deal model, and reaching an executable investment or operating agreement." },
  ],
  privacyKicker: "Graduated confidentiality",
  privacyTitle: "Every piece of information appears at the right time",
  privacyIntro:
    "The owner's identity, exact location and sensitive documents are not disclosed to the public. The move from the concise presentation to the full file happens only after seriousness is verified and the right path approved.",
  privacyLevels: [
    { title: "Public view", tag: "For visitors", text: "A concise, anonymized description of the opportunity without revealing the name, exact location or sensitive documents." },
    { title: "Expanded view", tag: "For registered investors", text: "Wider details that help the investor assess initial interest before requesting full access." },
    { title: "Full file", tag: "After approval & confidentiality", text: "Full information, documents, contact data and precise details after seriousness is verified and the parties protected." },
  ],
  beyondKicker: "We're not just brokers",
  beyondTitle: "When an opportunity needs management or operation, we can go deeper",
  beyondParas: [
    "In some opportunities, connecting the investor with the project owner is not enough. A project may need an operator, an executive manager, a follow-up team, or industrial and commercial expertise able to transfer a successful model to a new location.",
    "So, depending on the agreement between the parties, Ahd Al-Baraka can play an added role in management, operation or development, through qualified teams and a wide network of business owners, factories and operators.",
    "Ahd Al-Baraka's model may be a success fee upon completing the investment, or an agreed stake in return for management, operation or development, according to each case.",
  ],
  beyondCardTitle: "Beyond matchmaking",
  beyondCardText: "Management, operation, follow-up, and transferring expertise to new locations and markets.",
  sectorsKicker: "Platform sectors",
  sectorsTitle: "We receive and study opportunities across diverse sectors",
  sectorDesc: "Opportunities open to study, financing, partnership, management, or operation depending on each project's readiness.",
  sectors: ["Real estate & development", "Industry & factories", "Agriculture & land", "Food industries", "Energy", "Tourism & hotels", "Logistics", "Technology & fintech"],
  finalKicker: "Start your journey now",
  finalTitle: "An investor looking for an opportunity? Or an asset owner looking for a partner?",
  finalIntro: "Baraka Partners structures the path, protects the data, and connects serious parties within a clear, executable model.",
  ctaRegister: "Register as an investor",
  ctaSubmit: "Submit your opportunity",
};

const tr: HowContent = {
  heroBadge: "Platform nasıl çalışır",
  heroTitle1: "Net bir yatırım yolu",
  heroTitle2: "gizliliği korur ve anlaşma ciddiyetini artırır",
  heroIntro:
    "Yatırımcının veya fırsat sahibinin kaydından; yeterlilik, kademeli paylaşım, gizlilik sözleşmeleri, müzakere ve ardından uygulanabilir bir yatırım veya işletme modeline ulaşmaya kadar.",
  ctaInvestor: "Yatırımcı olarak başla",
  ctaOwner: "Bir fırsatım veya varlığım var",
  heroStats: [
    ["01", "Kayıt ve yeterlilik"],
    ["02", "Güvenli, anonim sunum"],
    ["03", "Kademeli gizlilik"],
    ["04", "Müzakere ve kapanış"],
  ],
  introKicker: "Kısaca fikir",
  introTitle1: "Platform her şeyi baştan açıklamaz.",
  introTitle2: "Ve gücü tam olarak budur.",
  introParas: [
    "Baraka Partners; proje sahibini hassas verilerini ifşa etmekten koruyan, aynı zamanda yatırımcıya tam ayrıntılara geçmeden önce ciddi bir karar vermek için yeterli bilgiyi veren kademeli bir yol izler.",
    "Her fırsat sunulmadan önce insan incelemesinden ve iç yapılandırmadan geçer; ardından ziyaretçiye veya kayıtlı yatırımcıya farklı ayrıntı düzeylerinde sunulur ve ciddiyet doğrulanıp gizlilik taahhüt edildikten sonra tam dosyaya ulaşılır.",
  ],
  tracksKicker: "İki net hat",
  tracksTitle: "Anlaşmada nerede durursanız durun, yolu sizin için hazırlarız",
  tracks: [
    {
      title: "Yatırımcılar için",
      points: [
        "Özlü ve nitelikli fırsatları inceleyin.",
        "Ülke, sektör ve yatırım büyüklüğüne göre filtreleyin.",
        "Tam ayrıntılara erişim talep edin.",
        "İlişkiyi uzman bir ekiple takip edin.",
      ],
      cta: "Yatırımcı olarak kaydol",
    },
    {
      title: "Fırsat ve varlık sahipleri için",
      points: [
        "Proje, arsa, fabrika, şirket veya genişleme fırsatı sunun.",
        "Fırsatı niteleyin ve yatırım dosyasını hazırlayın.",
        "Kimliği ve hassas verileri koruyun.",
        "Uygun yatırımcı ve işletme ortaklarına ulaşın.",
      ],
      cta: "Fırsatını sun",
    },
  ],
  processKicker: "Anlaşma yolculuğu",
  processTitle: "Ön verilerden uygulanabilir bir anlaşmaya",
  steps: [
    { number: "01", title: "Yatırımcı veya fırsat sahibi kaydı", text: "Yolculuk, bir hesap oluşturarak veya bir yatırım fırsatı sunarak ve ekibin talebin niteliğini anlamasına yardımcı olan temel verileri girerek başlar." },
    { number: "02", title: "İç inceleme ve yeterlilik", text: "Yönetim verileri inceler, fırsatın veya yatırımcının ciddiyetini doğrular, ardından dosyanın sunum veya eşleştirmeye ne kadar hazır olduğunu belirler." },
    { number: "03", title: "Özlü ve güvenli bir sunum hazırlama", text: "Fırsat; sahibin kimliğini, kesin konumunu veya hassas ayrıntıları açıklamadan, profesyonel ve anonim biçimde hazırlanır." },
    { number: "04", title: "Fırsatı doğru yatırımcıyla eşleştirme", text: "Fırsatlar rastgele gösterilmez; sektöre, ülkeye ve yatırım büyüklüğüne göre en uygun yatırımcı veya şirketlerle buluşturulur." },
    { number: "05", title: "Ciddiyet ve gizlilikten sonra ayrıntıların açılması", text: "Ciddiyet doğrulandıktan ve talep onaylandıktan sonra, tam ayrıntılar gizlilik, yönetişim ve uygun koruma sözleşmeleri çerçevesinde açılır." },
    { number: "06", title: "Müzakere, yapılandırma ve kapanış", text: "Platform; müzakereyi düzenlemede, anlaşma modelini kurmada ve uygulanabilir bir yatırım veya işletme anlaşmasına ulaşmada taraflara eşlik eder." },
  ],
  privacyKicker: "Kademeli gizlilik",
  privacyTitle: "Her bilgi doğru zamanında görünür",
  privacyIntro:
    "Sahibin kimliği, kesin konumu ve hassas belgeleri kamuya açıklanmaz. Özlü sunumdan tam dosyaya geçiş, yalnızca ciddiyet doğrulandıktan ve doğru yol onaylandıktan sonra gerçekleşir.",
  privacyLevels: [
    { title: "Genel görünüm", tag: "Ziyaretçiler için", text: "İsmi, kesin konumu veya hassas belgeleri açıklamadan fırsatın özlü ve anonim bir açıklaması." },
    { title: "Genişletilmiş görünüm", tag: "Kayıtlı yatırımcılar için", text: "Yatırımcının tam erişim istemeden önce ilk ilgisini değerlendirmesine yardımcı olan daha geniş ayrıntılar." },
    { title: "Tam dosya", tag: "Onay ve gizlilikten sonra", text: "Ciddiyet doğrulandıktan ve taraflar korunduktan sonra tam bilgiler, belgeler, iletişim verileri ve kesin ayrıntılar." },
  ],
  beyondKicker: "Sadece aracı değiliz",
  beyondTitle: "Bir fırsat yönetim veya işletme gerektirdiğinde, derine inebiliriz",
  beyondParas: [
    "Bazı fırsatlarda, yatırımcıyı proje sahibiyle buluşturmak yeterli değildir. Bir proje; bir işletmeci, bir genel müdür, bir takip ekibi veya başarılı bir modeli yeni bir konuma taşıyabilecek sınai ve ticari uzmanlık gerektirebilir.",
    "Bu nedenle Ahd Al-Baraka, taraflar arasındaki anlaşmaya göre; nitelikli ekipler ve iş insanları, fabrikalar ve işletmecilerden oluşan geniş bir ağ aracılığıyla yönetim, işletme veya geliştirmede ek bir rol üstlenebilir.",
    "Ahd Al-Baraka'nın modeli; yatırımın tamamlanması üzerine bir başarı ücreti ya da her duruma göre yönetim, işletme veya geliştirme karşılığında üzerinde anlaşılan bir hisse olabilir.",
  ],
  beyondCardTitle: "Buluşturmanın ötesinde",
  beyondCardText: "Yönetim, işletme, takip ve uzmanlığı yeni konum ve pazarlara taşıma.",
  sectorsKicker: "Platform sektörleri",
  sectorsTitle: "Çeşitli sektörlerde fırsatları alır ve inceleriz",
  sectorDesc: "Her projenin hazırlığına göre incelemeye, finansmana, ortaklığa, yönetime veya işletmeye açık fırsatlar.",
  sectors: ["Gayrimenkul ve geliştirme", "Sanayi ve fabrikalar", "Tarım ve arazi", "Gıda sanayileri", "Enerji", "Turizm ve oteller", "Lojistik", "Teknoloji ve fintek"],
  finalKicker: "Yolculuğuna şimdi başla",
  finalTitle: "Fırsat arayan bir yatırımcı mısın? Yoksa ortak arayan bir varlık sahibi mi?",
  finalIntro: "Baraka Partners yolu düzenler, verileri korur ve ciddi tarafları net ve uygulanabilir bir model içinde buluşturur.",
  ctaRegister: "Yatırımcı olarak kaydol",
  ctaSubmit: "Yatırım fırsatını sun",
};

const zh: HowContent = {
  heroBadge: "平台如何运作",
  heroTitle1: "清晰的投资路径",
  heroTitle2: "保护保密性并提升交易严肃性",
  heroIntro:
    "从投资者或机会方的注册，到资格审核、分级披露、保密协议、谈判，再到达成可执行的投资或运营模式。",
  ctaInvestor: "以投资者身份开始",
  ctaOwner: "我有机会或资产",
  heroStats: [
    ["01", "注册与资格审核"],
    ["02", "安全、匿名的展示"],
    ["03", "分级保密"],
    ["04", "谈判与成交"],
  ],
  introKicker: "理念简述",
  introTitle1: "平台不会一开始就披露一切。",
  introTitle2: "而这正是它的力量所在。",
  introParas: [
    "Baraka Partners 采用分级路径运作，既保护项目方的敏感数据不被披露，又在进入完整细节之前给予投资者足够的信息以做出认真的决定。",
    "每个机会在展示前都会经过人工审查和内部组织，然后以不同的细节层次呈现给访客或注册投资者，在核实严肃性并承诺保密之后才进入完整档案。",
  ],
  tracksKicker: "两条清晰路径",
  tracksTitle: "无论您在交易中处于何位，我们都为您铺好道路",
  tracks: [
    {
      title: "面向投资者",
      points: [
        "浏览简明且经资格审核的机会。",
        "按国家、行业和投资规模筛选。",
        "申请查看完整细节。",
        "由专业团队跟进关系。",
      ],
      cta: "注册为投资者",
    },
    {
      title: "面向机会与资产方",
      points: [
        "提交项目、土地、工厂、公司或扩张机会。",
        "对机会进行资格审核并准备其投资档案。",
        "保护身份与敏感数据。",
        "对接合适的投资者与运营伙伴。",
      ],
      cta: "提交您的机会",
    },
  ],
  processKicker: "交易旅程",
  processTitle: "从初步数据到可执行的交易",
  steps: [
    { number: "01", title: "投资者或机会方注册", text: "旅程从创建账户或提交投资机会开始，并录入帮助团队理解需求性质的基本数据。" },
    { number: "02", title: "内部审查与资格审核", text: "管理团队审查数据，核实机会或投资者的严肃性，然后确定档案在展示或匹配方面的成熟度。" },
    { number: "03", title: "准备简明且安全的展示", text: "以专业且匿名的方式撰写机会，不披露项目方身份、确切位置或敏感细节。" },
    { number: "04", title: "将机会与合适的投资者匹配", text: "机会不会随意展示，而是按行业、国家和投资规模与最合适的投资者或公司对接。" },
    { number: "05", title: "在核实严肃性与保密后开放细节", text: "在核实严肃性并批准申请后，在保密、治理和适当保护协议的框架内开放完整细节。" },
    { number: "06", title: "谈判、构建与成交", text: "平台陪伴各方组织谈判、构建交易模式，并达成可执行的投资或运营协议。" },
  ],
  privacyKicker: "分级保密",
  privacyTitle: "每条信息都在恰当的时间出现",
  privacyIntro:
    "项目方身份、确切位置和敏感文件不会向公众披露。只有在核实严肃性并批准合适路径之后，才会从简明展示进入完整档案。",
  privacyLevels: [
    { title: "公开展示", tag: "面向访客", text: "对机会的简明、匿名描述，不披露名称、确切位置或敏感文件。" },
    { title: "扩展展示", tag: "面向注册投资者", text: "更广泛的细节，帮助投资者在申请完整查看之前评估初步兴趣。" },
    { title: "完整档案", tag: "经批准与保密后", text: "在核实严肃性并保护各方之后，提供完整信息、文件、联系数据和精确细节。" },
  ],
  beyondKicker: "我们不只是中介",
  beyondTitle: "当机会需要管理或运营时，我们能够深入参与",
  beyondParas: [
    "在某些机会中，仅把投资者与项目方对接并不够。项目可能需要运营方、执行经理、跟进团队，或能将成功模式带到新地点的工业与商业经验。",
    "因此，依据各方的约定，Ahd Al-Baraka 可以通过专业团队以及由企业主、工厂和运营方组成的广泛网络，在管理、运营或开发中发挥附加作用。",
    "Ahd Al-Baraka 的模式可以是投资完成时收取成功费，或根据每种情况以约定的股权换取管理、运营或开发。",
  ],
  beyondCardTitle: "对接之后",
  beyondCardText: "管理、运营、跟进，并将经验转移到新地点与新市场。",
  sectorsKicker: "平台行业",
  sectorsTitle: "我们在多元行业中接收并研究机会",
  sectorDesc: "根据每个项目的成熟度，机会可供研究、融资、合作、管理或运营。",
  sectors: ["房地产与开发", "工业与工厂", "农业与土地", "食品工业", "能源", "旅游与酒店", "物流", "科技与金融科技"],
  finalKicker: "立即开始您的旅程",
  finalTitle: "您是寻找机会的投资者？还是寻找伙伴的资产方？",
  finalIntro: "Baraka Partners 组织路径、保护数据，并在清晰可执行的模式中连接认真的各方。",
  ctaRegister: "注册为投资者",
  ctaSubmit: "提交您的投资机会",
};

export const HOW: Record<Locale, HowContent> = { ar, en, tr, zh };
