// تعدّد لغات نظام سفراء الاستثمار — وحدة مستقلة (4 لغات لكل مفتاح) على نمط crm-i18n.
// تُستورد في الواجهة والخادم. الاستخدام: ta(locale, "hero.title").
import type { Locale } from "@/lib/i18n";

type Quad = { ar: string; en: string; tr: string; zh: string };

const M: Record<string, Quad> = {
  // ===== التنقل + SEO =====
  "nav.ambassadors": {
    ar: "سفراء الاستثمار",
    en: "Investment Ambassadors",
    tr: "Yatırım Elçileri",
    zh: "投资大使",
  },
  "seo.title": {
    ar: "سفراء الاستثمار | انضم إلى شبكة عهد البركة لجذب المستثمرين",
    en: "Investment Ambassadors | Join Ahd Al-Baraka Investor Network",
    tr: "Yatırım Elçileri | Ahd Al-Baraka Yatırımcı Ağına Katılın",
    zh: "投资大使 | 加入 Ahd Al-Baraka 投资者网络",
  },
  "seo.desc": {
    ar: "تقدّم للانضمام إلى برنامج سفراء الاستثمار لدى عهد البركة إذا كنت تمتلك علاقات مع مستثمرين محتملين وشركات استثمارية في أي دولة حول العالم.",
    en: "Apply to become an Investment Ambassador with Ahd Al-Baraka if you have access to qualified investors, investment companies, or business networks worldwide.",
    tr: "Dünya genelinde nitelikli yatırımcılara, yatırım şirketlerine veya iş ağlarına erişiminiz varsa Ahd Al-Baraka Yatırım Elçisi programına başvurun.",
    zh: "如果您拥有遍布全球的合格投资者、投资公司或商业网络资源，欢迎申请成为 Ahd Al-Baraka 投资大使。",
  },

  // ===== Hero =====
  "hero.title": {
    ar: "انضم إلى شبكة سفراء الاستثمار",
    en: "Join the Investment Ambassadors Network",
    tr: "Yatırım Elçileri Ağına Katılın",
    zh: "加入投资大使网络",
  },
  "hero.sub": {
    ar: "إذا كنت تمتلك علاقات مع مستثمرين أو شركات استثمارية أو رجال أعمال مهتمين بالفرص الاستثمارية، يمكنك التقدّم للانضمام إلى برنامج سفراء الاستثمار لدى عهد البركة.",
    en: "If you have relationships with investors, investment firms, or business leaders interested in investment opportunities, you can apply to join Ahd Al-Baraka's Investment Ambassadors program.",
    tr: "Yatırımcılar, yatırım şirketleri veya yatırım fırsatlarıyla ilgilenen iş insanlarıyla ilişkileriniz varsa, Ahd Al-Baraka Yatırım Elçileri programına katılmak için başvurabilirsiniz.",
    zh: "如果您与投资者、投资公司或对投资机会感兴趣的企业家有联系，欢迎申请加入 Ahd Al-Baraka 投资大使计划。",
  },
  "cta.apply": { ar: "تقدّم الآن", en: "Apply Now", tr: "Şimdi Başvurun", zh: "立即申请" },
  "cta.how": { ar: "تعرّف على آلية العمل", en: "How It Works", tr: "Nasıl Çalışır", zh: "了解运作方式" },
  "cta.contact": { ar: "تواصل معنا", en: "Contact Us", tr: "Bize Ulaşın", zh: "联系我们" },

  // ===== من هو سفير الاستثمار؟ =====
  "who.title": {
    ar: "من هو سفير الاستثمار؟",
    en: "Who Is an Investment Ambassador?",
    tr: "Yatırım Elçisi Kimdir?",
    zh: "谁是投资大使？",
  },
  "who.lead": {
    ar: "سفير الاستثمار شخص أو جهة تمتلك شبكة علاقات مع مستثمرين محتملين، وتتعاون مع عهد البركة بترشيح مستثمرين مؤهّلين لديهم القدرة المالية والرغبة الجادة في دراسة الفرص الاستثمارية، وذلك وفق عقد تعاون رسمي وضوابط واضحة لحماية جميع الأطراف.",
    en: "An Investment Ambassador is a person or entity with a network of potential investors who cooperates with Ahd Al-Baraka by referring qualified investors who have the financial capacity and serious intent to study investment opportunities — under a formal cooperation contract and clear rules that protect all parties.",
    tr: "Yatırım Elçisi, potansiyel yatırımcılardan oluşan bir ağa sahip olan ve mali kapasiteye ve yatırım fırsatlarını ciddi şekilde değerlendirme isteğine sahip nitelikli yatırımcıları yönlendirerek Ahd Al-Baraka ile iş birliği yapan kişi veya kuruluştur — resmi bir iş birliği sözleşmesi ve tüm tarafları koruyan açık kurallar çerçevesinde.",
    zh: "投资大使是指拥有潜在投资者网络的个人或机构，通过推荐具备财务能力和认真意愿研究投资机会的合格投资者与 Ahd Al-Baraka 合作——基于正式的合作合同和保护各方的明确规则。",
  },
  "who.p1": {
    ar: "لديه علاقات مع مستثمرين محتملين.",
    en: "Has relationships with potential investors.",
    tr: "Potansiyel yatırımcılarla ilişkileri vardır.",
    zh: "与潜在投资者有联系。",
  },
  "who.p2": {
    ar: "يستطيع ترشيح مستثمرين جادّين.",
    en: "Can refer serious investors.",
    tr: "Ciddi yatırımcıları yönlendirebilir.",
    zh: "能够推荐认真的投资者。",
  },
  "who.p3": {
    ar: "يعمل ضمن ضوابط عهد البركة.",
    en: "Operates within Ahd Al-Baraka's rules.",
    tr: "Ahd Al-Baraka kuralları çerçevesinde çalışır.",
    zh: "在 Ahd Al-Baraka 的规则范围内运作。",
  },
  "who.p4": {
    ar: "لا يملك صلاحية تقديم وعود أو التزامات باسم الشركة قبل اعتماده.",
    en: "Has no authority to make promises or commitments on the company's behalf before approval.",
    tr: "Onaylanmadan önce şirket adına söz veya taahhütte bulunma yetkisi yoktur.",
    zh: "在获得批准之前，无权代表公司作出承诺或保证。",
  },
  "who.p5": {
    ar: "يحصل على حساب خاص بعد توقيع العقد.",
    en: "Receives a dedicated account after signing the contract.",
    tr: "Sözleşmeyi imzaladıktan sonra özel bir hesap alır.",
    zh: "签署合同后获得专属账户。",
  },
  "who.p6": {
    ar: "يتابع ملفاته وترشيحاته من خلال لوحة مخصّصة.",
    en: "Tracks files and referrals through a dedicated dashboard.",
    tr: "Dosyalarını ve yönlendirmelerini özel bir panel üzerinden takip eder.",
    zh: "通过专属面板跟踪文件和推荐。",
  },

  // ===== من يمكنه التقديم؟ =====
  "eligible.title": { ar: "من يمكنه التقديم؟", en: "Who Can Apply?", tr: "Kimler Başvurabilir?", zh: "谁可以申请？" },
  "eligible.i1": { ar: "رجال الأعمال", en: "Business owners", tr: "İş insanları", zh: "企业家" },
  "eligible.i2": { ar: "المستشارون الماليون أو الاستثماريون", en: "Financial or investment advisors", tr: "Finansal veya yatırım danışmanları", zh: "金融或投资顾问" },
  "eligible.i3": { ar: "أصحاب العلاقات مع المستثمرين", en: "Those with investor relationships", tr: "Yatırımcı ilişkilerine sahip kişiler", zh: "拥有投资者关系的人士" },
  "eligible.i4": { ar: "مكاتب الوساطة الاستثمارية", en: "Investment brokerage offices", tr: "Yatırım aracılık ofisleri", zh: "投资中介机构" },
  "eligible.i5": { ar: "مدراء العلاقات", en: "Relationship managers", tr: "İlişki yöneticileri", zh: "关系经理" },
  "eligible.i6": { ar: "الشركات الاستشارية", en: "Consulting firms", tr: "Danışmanlık şirketleri", zh: "咨询公司" },
  "eligible.i7": { ar: "خبراء تطوير الأعمال", en: "Business development experts", tr: "İş geliştirme uzmanları", zh: "业务拓展专家" },
  "eligible.i8": { ar: "أصحاب شبكات علاقات في قطاعات محددة", en: "People with networks in specific sectors", tr: "Belirli sektörlerde ağı olan kişiler", zh: "在特定行业拥有网络的人士" },
  "eligible.i9": { ar: "الممثلون التجاريون في دول مختلفة", en: "Commercial representatives in various countries", tr: "Çeşitli ülkelerdeki ticari temsilciler", zh: "各国的商业代表" },

  // ===== آلية العمل =====
  "how.title": { ar: "آلية العمل", en: "How It Works", tr: "Nasıl Çalışır", zh: "运作方式" },
  "how.s1": { ar: "تعبئة نموذج التسجيل", en: "Fill in the registration form", tr: "Kayıt formunu doldurun", zh: "填写注册表" },
  "how.s2": { ar: "مراجعة الملف من قبل إدارة عهد البركة", en: "Review of the profile by Ahd Al-Baraka", tr: "Profilin Ahd Al-Baraka tarafından incelenmesi", zh: "由 Ahd Al-Baraka 审核资料" },
  "how.s3": { ar: "طلب معلومات إضافية عند الحاجة", en: "Request additional information if needed", tr: "Gerektiğinde ek bilgi talebi", zh: "如有需要，索取补充信息" },
  "how.s4": { ar: "تقييم شبكة العلاقات والخبرة والبلد والقطاعات", en: "Assessment of network, experience, country and sectors", tr: "Ağ, deneyim, ülke ve sektörlerin değerlendirilmesi", zh: "评估人脉、经验、国家和行业" },
  "how.s5": { ar: "قبول مبدئي أو رفض", en: "Preliminary acceptance or rejection", tr: "Ön kabul veya ret", zh: "初步接受或拒绝" },
  "how.s6": { ar: "إرسال عقد تعاون إلكتروني", en: "Sending an electronic cooperation contract", tr: "Elektronik iş birliği sözleşmesinin gönderilmesi", zh: "发送电子合作合同" },
  "how.s7": { ar: "توقيع العقد إلكترونياً", en: "Signing the contract electronically", tr: "Sözleşmenin elektronik olarak imzalanması", zh: "电子签署合同" },
  "how.s8": { ar: "فتح حساب خاص للسفير", en: "Opening a dedicated ambassador account", tr: "Elçi için özel hesap açılması", zh: "开设专属大使账户" },
  "how.s9": { ar: "رفع ملفات المستثمرين أو ترشيحاتهم", en: "Uploading investor files or referrals", tr: "Yatırımcı dosyalarının veya yönlendirmelerinin yüklenmesi", zh: "上传投资者文件或推荐" },
  "how.s10": { ar: "التواصل مع الإدارة عبر نظام داخلي", en: "Communicating with management via an internal system", tr: "Dahili bir sistem aracılığıyla yönetimle iletişim", zh: "通过内部系统与管理层沟通" },
  "how.s11": { ar: "متابعة حالة كل مستثمر مرشّح", en: "Tracking the status of each referred investor", tr: "Önerilen her yatırımcının durumunun takibi", zh: "跟踪每位推荐投资者的状态" },

  // ===== ما الذي يقدّمه السفير؟ =====
  "provide.title": { ar: "ما الذي يقدّمه السفير؟", en: "What Does the Ambassador Provide?", tr: "Elçi Neler Sağlar?", zh: "大使提供什么？" },
  "provide.i1": { ar: "ترشيح مستثمرين محتملين", en: "Referring potential investors", tr: "Potansiyel yatırımcıların yönlendirilmesi", zh: "推荐潜在投资者" },
  "provide.i2": { ar: "تقديم معلومات أولية عن المستثمر", en: "Providing initial information about the investor", tr: "Yatırımcı hakkında ilk bilgilerin sağlanması", zh: "提供投资者的初步信息" },
  "provide.i3": { ar: "توضيح حجم الملاءة أو القدرة الاستثمارية المتوقّعة", en: "Indicating the expected solvency or investment capacity", tr: "Beklenen mali güç veya yatırım kapasitesinin belirtilmesi", zh: "说明预期的资金实力或投资能力" },
  "provide.i4": { ar: "تحديد القطاعات التي يهتم بها المستثمر", en: "Identifying the sectors the investor is interested in", tr: "Yatırımcının ilgilendiği sektörlerin belirlenmesi", zh: "确定投资者感兴趣的行业" },
  "provide.i5": { ar: "تسهيل التواصل الأولي", en: "Facilitating initial communication", tr: "İlk iletişimin kolaylaştırılması", zh: "促进初步沟通" },
  "provide.i6": { ar: "مساعدة الشركة على فهم طبيعة المستثمر وسلوكه الاستثماري", en: "Helping the company understand the investor's profile and behavior", tr: "Şirketin yatırımcının profilini ve davranışını anlamasına yardımcı olmak", zh: "帮助公司了解投资者的特点和投资行为" },
  "provide.i7": { ar: "دعم ترتيبات الاجتماعات الأولية عند الحاجة", en: "Supporting initial meeting arrangements when needed", tr: "Gerektiğinde ilk toplantı düzenlemelerine destek olmak", zh: "在需要时协助安排初步会议" },

  // ===== ما الذي توفّره عهد البركة؟ =====
  "offer.title": { ar: "ما الذي توفّره عهد البركة للسفير؟", en: "What Does Ahd Al-Baraka Offer the Ambassador?", tr: "Ahd Al-Baraka Elçiye Neler Sunar?", zh: "Ahd Al-Baraka 为大使提供什么？" },
  "offer.i1": { ar: "عقد تعاون رسمي بعد القبول", en: "A formal cooperation contract after acceptance", tr: "Kabulden sonra resmi bir iş birliği sözleşmesi", zh: "录用后的正式合作合同" },
  "offer.i2": { ar: "حساب خاص داخل المنصة", en: "A dedicated account on the platform", tr: "Platformda özel bir hesap", zh: "平台上的专属账户" },
  "offer.i3": { ar: "نظام تواصل داخلي مع الإدارة", en: "An internal communication system with management", tr: "Yönetimle dahili iletişim sistemi", zh: "与管理层的内部沟通系统" },
  "offer.i4": { ar: "إمكانية رفع ملفات المستثمرين", en: "The ability to upload investor files", tr: "Yatırımcı dosyalarını yükleme imkânı", zh: "上传投资者文件的功能" },
  "offer.i5": { ar: "متابعة حالة كل ترشيح", en: "Tracking the status of each referral", tr: "Her yönlendirmenin durumunu takip", zh: "跟踪每个推荐的状态" },
  "offer.i6": { ar: "قوالب تعريفية بالفرص الاستثمارية المعتمدة", en: "Briefing materials on approved investment opportunities", tr: "Onaylı yatırım fırsatları hakkında tanıtım materyalleri", zh: "已批准投资机会的介绍材料" },
  "offer.i7": { ar: "ضوابط واضحة لطريقة العمل", en: "Clear rules of engagement", tr: "Net çalışma kuralları", zh: "明确的工作规则" },
  "offer.i8": { ar: "حماية العلاقة وحقوق السفير وفق العقد", en: "Protection of the relationship and the ambassador's rights per the contract", tr: "Sözleşmeye göre ilişkinin ve elçinin haklarının korunması", zh: "根据合同保护关系及大使的权益" },
  "offer.i9": { ar: "إمكانية تطوير العلاقة حسب الأداء", en: "The possibility of developing the relationship based on performance", tr: "Performansa göre ilişkiyi geliştirme imkânı", zh: "根据表现发展合作关系的可能" },

  // ===== تنبيه مهم =====
  "notice.title": { ar: "تنبيه مهم", en: "Important Notice", tr: "Önemli Uyarı", zh: "重要提示" },
  "notice.b1": {
    ar: "تقديم طلب الانضمام لا يعني القبول التلقائي كسفير استثمار. تبدأ العلاقة الرسمية فقط بعد مراجعة الملف، والموافقة عليه من قبل الإدارة، وتوقيع عقد تعاون إلكتروني مع شركة عهد البركة.",
    en: "Submitting an application does not mean automatic acceptance as an Investment Ambassador. The official relationship begins only after the profile is reviewed and approved by management and an electronic cooperation contract is signed with Ahd Al-Baraka.",
    tr: "Başvuru göndermek, Yatırım Elçisi olarak otomatik kabul anlamına gelmez. Resmi ilişki, yalnızca profil incelenip yönetim tarafından onaylandıktan ve Ahd Al-Baraka ile elektronik bir iş birliği sözleşmesi imzalandıktan sonra başlar.",
    zh: "提交申请并不意味着自动被接受为投资大使。正式关系仅在资料经管理层审核批准并与 Ahd Al-Baraka 签署电子合作合同后才开始。",
  },
  "notice.b2": {
    ar: "لا يحق للمتقدّم استخدام اسم عهد البركة أو البركة بارتنرز أو تمثيل الشركة أمام الغير قبل الحصول على موافقة رسمية وتوقيع العقد.",
    en: "The applicant may not use the name of Ahd Al-Baraka or Baraka Partners, or represent the company to third parties, before obtaining official approval and signing the contract.",
    tr: "Başvuran, resmi onay almadan ve sözleşmeyi imzalamadan önce Ahd Al-Baraka veya Baraka Partners adını kullanamaz ya da şirketi üçüncü taraflara karşı temsil edemez.",
    zh: "在获得正式批准并签署合同之前，申请人不得使用 Ahd Al-Baraka 或 Baraka Partners 的名称，亦不得对外代表公司。",
  },

  // ===== النموذج: العناوين والأقسام =====
  "form.title": { ar: "طلب الانضمام إلى برنامج سفراء الاستثمار", en: "Application to Join the Investment Ambassadors Program", tr: "Yatırım Elçileri Programına Katılım Başvurusu", zh: "投资大使计划申请表" },
  "form.sub": {
    ar: "املأ البيانات التالية بدقّة. ستراجع الإدارة طلبك وتتواصل معك إذا كان ملفك مناسباً.",
    en: "Fill in the following details accurately. Our team will review your application and contact you if your profile is a good fit.",
    tr: "Aşağıdaki bilgileri eksiksiz doldurun. Ekibimiz başvurunuzu inceleyecek ve profiliniz uygunsa sizinle iletişime geçecektir.",
    zh: "请准确填写以下信息。我们的团队将审核您的申请，如资料合适将与您联系。",
  },
  "sec.personal": { ar: "البيانات الشخصية", en: "Personal Information", tr: "Kişisel Bilgiler", zh: "个人信息" },
  "sec.professional": { ar: "البيانات المهنية", en: "Professional Information", tr: "Mesleki Bilgiler", zh: "职业信息" },
  "sec.network": { ar: "شبكة العلاقات", en: "Network & Relationships", tr: "Ağ ve İlişkiler", zh: "人脉与关系" },
  "sec.evaluation": { ar: "أسئلة التقييم", en: "Assessment Questions", tr: "Değerlendirme Soruları", zh: "评估问题" },
  "sec.files": { ar: "المرفقات", en: "Attachments", tr: "Ekler", zh: "附件" },
  "sec.consents": { ar: "الإقرارات والموافقات", en: "Declarations & Consents", tr: "Beyanlar ve Onaylar", zh: "声明与同意" },

  // ===== النموذج: الحقول =====
  "f.optional": { ar: "(اختياري)", en: "(optional)", tr: "(isteğe bağlı)", zh: "（可选）" },
  "opt.choose": { ar: "— اختر —", en: "— Select —", tr: "— Seçin —", zh: "— 请选择 —" },
  "f.fullName": { ar: "الاسم الكامل", en: "Full name", tr: "Ad soyad", zh: "全名" },
  "f.nationality": { ar: "الجنسية", en: "Nationality", tr: "Uyruk", zh: "国籍" },
  "f.residenceCountry": { ar: "بلد الإقامة", en: "Country of residence", tr: "İkamet ülkesi", zh: "居住国家" },
  "f.city": { ar: "المدينة", en: "City", tr: "Şehir", zh: "城市" },
  "f.phone": { ar: "رقم الهاتف", en: "Phone number", tr: "Telefon numarası", zh: "电话号码" },
  "f.whatsapp": { ar: "رقم واتساب", en: "WhatsApp number", tr: "WhatsApp numarası", zh: "WhatsApp 号码" },
  "f.email": { ar: "البريد الإلكتروني", en: "Email", tr: "E-posta", zh: "电子邮箱" },
  "f.preferredLanguage": { ar: "لغة التواصل المفضّلة", en: "Preferred contact language", tr: "Tercih edilen iletişim dili", zh: "首选沟通语言" },
  "f.spokenLanguages": { ar: "اللغات التي تتقنها", en: "Languages you speak", tr: "Konuştuğunuz diller", zh: "您掌握的语言" },
  "f.photo": { ar: "صورة شخصية", en: "Profile photo", tr: "Profil fotoğrafı", zh: "个人照片" },
  "f.currentTitle": { ar: "المسمى المهني الحالي", en: "Current job title", tr: "Mevcut unvan", zh: "当前职位" },
  "f.companyName": { ar: "اسم الشركة أو الجهة", en: "Company or organization name", tr: "Şirket veya kuruluş adı", zh: "公司或机构名称" },
  "f.professionalRole": { ar: "موقعك الوظيفي", en: "Your role", tr: "Göreviniz", zh: "您的职务" },
  "f.yearsOfExperience": { ar: "سنوات الخبرة", en: "Years of experience", tr: "Deneyim yılı", zh: "工作年限" },
  "f.workType": { ar: "هل تعمل بشكل فردي أم من خلال شركة؟", en: "Do you work individually or through a company?", tr: "Bireysel mi yoksa bir şirket aracılığıyla mı çalışıyorsunuz?", zh: "您是个人还是通过公司开展工作？" },
  "f.website": { ar: "الموقع الإلكتروني", en: "Website", tr: "Web sitesi", zh: "网站" },
  "f.linkedin": { ar: "رابط LinkedIn", en: "LinkedIn URL", tr: "LinkedIn bağlantısı", zh: "LinkedIn 链接" },
  "f.otherLinks": { ar: "روابط مهنية أخرى", en: "Other professional links", tr: "Diğer mesleki bağlantılar", zh: "其他职业链接" },
  "f.coveredCountries": { ar: "في أي دول لديك علاقات مع مستثمرين؟", en: "In which countries do you have investor relationships?", tr: "Hangi ülkelerde yatırımcı ilişkileriniz var?", zh: "您在哪些国家拥有投资者关系？" },
  "f.coveredCountries.help": { ar: "اكتب الدول مفصولة بفاصلة.", en: "List the countries separated by commas.", tr: "Ülkeleri virgülle ayırarak yazın.", zh: "用逗号分隔列出各国家。" },
  "f.investorTypes": { ar: "ما نوع المستثمرين الذين تستطيع الوصول إليهم؟", en: "What types of investors can you reach?", tr: "Hangi tür yatırımcılara ulaşabiliyorsunuz?", zh: "您能接触到哪些类型的投资者？" },
  "f.coveredSectors": { ar: "ما القطاعات التي لديك فيها علاقات أقوى؟", en: "In which sectors do you have the strongest relationships?", tr: "En güçlü ilişkilere hangi sektörlerde sahipsiniz?", zh: "您在哪些行业拥有最强的人脉？" },
  "f.investmentRange": { ar: "ما حجم الاستثمارات الذي تصل لمستثمرين مهتمين به؟", en: "What investment size can you reach interested investors for?", tr: "İlgili yatırımcılara hangi yatırım büyüklüğü için ulaşabilirsiniz?", zh: "您能为多大规模的投资接触到感兴趣的投资者？" },
  "f.relationshipType": { ar: "هل علاقاتك مباشرة مع المستثمرين أم عبر وسطاء؟", en: "Are your relationships direct or through intermediaries?", tr: "İlişkileriniz doğrudan mı yoksa aracılar üzerinden mi?", zh: "您的关系是直接的还是通过中介？" },
  "f.previousExperience": { ar: "هل سبق لك العمل في جذب مستثمرين أو ترتيب شراكات؟", en: "Have you previously worked in attracting investors or arranging partnerships?", tr: "Daha önce yatırımcı çekme veya ortaklık kurma alanında çalıştınız mı?", zh: "您此前是否从事过吸引投资者或安排合作的工作？" },
  "f.experienceSummary": { ar: "اشرح باختصار أهم خبراتك أو علاقاتك الاستثمارية", en: "Briefly describe your key investment experience or relationships", tr: "Önemli yatırım deneyiminizi veya ilişkilerinizi kısaca açıklayın", zh: "请简要描述您主要的投资经验或人脉" },
  "f.motivation": { ar: "لماذا ترغب بالعمل كسفير استثمار مع عهد البركة؟", en: "Why do you want to work as an Investment Ambassador with Ahd Al-Baraka?", tr: "Neden Ahd Al-Baraka ile Yatırım Elçisi olarak çalışmak istiyorsunuz?", zh: "您为何希望成为 Ahd Al-Baraka 的投资大使？" },
  "f.addedValue": { ar: "ما القيمة التي تستطيع إضافتها للشركة؟", en: "What value can you add to the company?", tr: "Şirkete hangi değeri katabilirsiniz?", zh: "您能为公司带来什么价值？" },
  "f.canArrangeMeetings": { ar: "هل يمكنك ترتيب اجتماعات مباشرة أو أونلاين مع المستثمرين؟", en: "Can you arrange in-person or online meetings with investors?", tr: "Yatırımcılarla yüz yüze veya çevrimiçi toplantılar düzenleyebilir misiniz?", zh: "您能安排与投资者的线下或线上会议吗？" },
  "f.negotiationExperience": { ar: "هل لديك خبرة في التفاوض أو تقديم الفرص الاستثمارية؟", en: "Do you have experience in negotiation or presenting investment opportunities?", tr: "Müzakere veya yatırım fırsatlarını sunma konusunda deneyiminiz var mı?", zh: "您是否具备谈判或展示投资机会的经验？" },
  "f.regionKnowledge": { ar: "هل لديك معرفة بالاستثمار في الشرق الأوسط أو تركيا أو سوريا أو الدول المستهدفة؟", en: "Do you have knowledge of investing in the Middle East, Turkey, Syria, or target countries?", tr: "Orta Doğu, Türkiye, Suriye veya hedef ülkelerde yatırım konusunda bilginiz var mı?", zh: "您是否了解在中东、土耳其、叙利亚或目标国家的投资？" },
  "f.conflictOfInterest": { ar: "هل لديك أي تضارب مصالح محتمل يجب الإفصاح عنه؟", en: "Do you have any potential conflict of interest to disclose?", tr: "Açıklamanız gereken olası bir çıkar çatışması var mı?", zh: "您是否有任何需要披露的潜在利益冲突？" },
  "f.cv": { ar: "السيرة الذاتية (CV)", en: "Resume (CV)", tr: "Özgeçmiş (CV)", zh: "简历（CV）" },
  "f.companyProfile": { ar: "بروفايل الشركة", en: "Company profile", tr: "Şirket profili", zh: "公司简介" },
  "f.personalProfile": { ar: "ملف تعريفي شخصي", en: "Personal profile", tr: "Kişisel profil", zh: "个人简介" },
  "f.workSamples": { ar: "نماذج أعمال سابقة", en: "Previous work samples", tr: "Önceki çalışma örnekleri", zh: "过往作品样本" },
  "f.supporting": { ar: "مستندات داعمة", en: "Supporting documents", tr: "Destekleyici belgeler", zh: "支持性文件" },
  "f.filesHint": {
    ar: "الصيغ المسموحة: PDF, DOC, DOCX, JPG, PNG — بحد أقصى 10MB لكل ملف.",
    en: "Allowed formats: PDF, DOC, DOCX, JPG, PNG — max 10MB per file.",
    tr: "İzin verilen biçimler: PDF, DOC, DOCX, JPG, PNG — dosya başına en fazla 10MB.",
    zh: "允许的格式：PDF、DOC、DOCX、JPG、PNG——每个文件最大 10MB。",
  },

  // ===== الإقرارات =====
  "c.infoAccuracy": { ar: "أقرّ بأن المعلومات المقدّمة صحيحة حسب علمي.", en: "I declare that the information provided is accurate to the best of my knowledge.", tr: "Verilen bilgilerin bildiğim kadarıyla doğru olduğunu beyan ederim.", zh: "我声明所提供的信息据我所知属实。" },
  "c.privacy": { ar: "أوافق على سياسة الخصوصية.", en: "I agree to the privacy policy.", tr: "Gizlilik politikasını kabul ediyorum.", zh: "我同意隐私政策。" },
  "c.application": { ar: "أوافق على أن تقديم الطلب لا يعني قبولي كسفير استثمار.", en: "I acknowledge that submitting the application does not mean my acceptance as an Investment Ambassador.", tr: "Başvuru göndermenin Yatırım Elçisi olarak kabul edildiğim anlamına gelmediğini kabul ediyorum.", zh: "我确认提交申请并不意味着我已被接受为投资大使。" },
  "c.noRepresentation": { ar: "أتعهّد بعدم استخدام اسم عهد البركة أو البركة بارتنرز قبل الحصول على موافقة رسمية.", en: "I undertake not to use the name of Ahd Al-Baraka or Baraka Partners before obtaining official approval.", tr: "Resmi onay almadan Ahd Al-Baraka veya Baraka Partners adını kullanmamayı taahhüt ederim.", zh: "我承诺在获得正式批准之前不使用 Ahd Al-Baraka 或 Baraka Partners 的名称。" },
  "c.contact": { ar: "أوافق على التواصل معي لمراجعة الطلب وطلب معلومات إضافية.", en: "I agree to be contacted to review the application and request additional information.", tr: "Başvuruyu incelemek ve ek bilgi istemek için benimle iletişime geçilmesini kabul ediyorum.", zh: "我同意接受联系以审核申请并索取补充信息。" },

  // ===== أزرار + رسائل =====
  "submit": { ar: "إرسال الطلب", en: "Submit Application", tr: "Başvuruyu Gönder", zh: "提交申请" },
  "submitting": { ar: "جارٍ الإرسال...", en: "Submitting...", tr: "Gönderiliyor...", zh: "提交中..." },
  "success.title": { ar: "تم استلام طلبكم بنجاح", en: "Your application has been received", tr: "Başvurunuz alındı", zh: "您的申请已收到" },
  "success.body": {
    ar: "سيقوم فريق عهد البركة بمراجعة المعلومات المقدّمة، وفي حال مناسبة الملف سيتم التواصل معكم لاستكمال الإجراءات.",
    en: "The Ahd Al-Baraka team will review the information provided, and if your profile is suitable, we will contact you to complete the process.",
    tr: "Ahd Al-Baraka ekibi sağlanan bilgileri inceleyecek ve profiliniz uygunsa süreci tamamlamak için sizinle iletişime geçecektir.",
    zh: "Ahd Al-Baraka 团队将审核所提供的信息，如资料合适，我们将与您联系以完成后续流程。",
  },
  "err.name": { ar: "يرجى إدخال الاسم الكامل.", en: "Please enter your full name.", tr: "Lütfen tam adınızı girin.", zh: "请输入您的全名。" },
  "err.email": { ar: "يرجى إدخال بريد إلكتروني صحيح.", en: "Please enter a valid email.", tr: "Lütfen geçerli bir e-posta girin.", zh: "请输入有效的电子邮箱。" },
  "err.phone": { ar: "يرجى إدخال رقم هاتف صحيح.", en: "Please enter a valid phone number.", tr: "Lütfen geçerli bir telefon numarası girin.", zh: "请输入有效的电话号码。" },
  "err.consent": { ar: "يجب الموافقة على جميع الإقرارات الإلزامية.", en: "You must agree to all required declarations.", tr: "Tüm zorunlu beyanları kabul etmelisiniz.", zh: "您必须同意所有必填声明。" },
  "err.rate": { ar: "تم استلام طلب منك للتو. يرجى المحاولة بعد قليل.", en: "We just received a submission from you. Please try again shortly.", tr: "Az önce sizden bir başvuru aldık. Lütfen biraz sonra tekrar deneyin.", zh: "我们刚收到您的提交，请稍后再试。" },
  "err.generic": { ar: "تعذّر إرسال الطلب. يرجى المحاولة لاحقاً.", en: "Could not submit the application. Please try again later.", tr: "Başvuru gönderilemedi. Lütfen daha sonra tekrar deneyin.", zh: "无法提交申请，请稍后再试。" },
  "err.fileType": { ar: "نوع ملف غير مسموح به.", en: "File type not allowed.", tr: "İzin verilmeyen dosya türü.", zh: "不允许的文件类型。" },
  "err.fileSize": { ar: "حجم الملف يتجاوز الحد المسموح (10MB).", en: "File exceeds the allowed size (10MB).", tr: "Dosya, izin verilen boyutu aşıyor (10MB).", zh: "文件超过允许的大小（10MB）。" },

  // ===== بريد التأكيد =====
  "email.subject": { ar: "تأكيد استلام طلب الانضمام كسفير استثمار", en: "Investment Ambassador application received", tr: "Yatırım Elçisi başvurusu alındı", zh: "投资大使申请已收到" },
  "email.body": {
    ar: "شكراً لتقديمك طلب الانضمام إلى برنامج سفراء الاستثمار لدى عهد البركة. استلمنا طلبك وسيقوم فريقنا بمراجعته، وسنتواصل معك في حال مناسبة الملف.",
    en: "Thank you for applying to join Ahd Al-Baraka's Investment Ambassadors program. We have received your application; our team will review it and contact you if your profile is suitable.",
    tr: "Ahd Al-Baraka Yatırım Elçileri programına başvurduğunuz için teşekkür ederiz. Başvurunuzu aldık; ekibimiz inceleyecek ve profiliniz uygunsa sizinle iletişime geçecektir.",
    zh: "感谢您申请加入 Ahd Al-Baraka 投资大使计划。我们已收到您的申请，团队将进行审核，如资料合适将与您联系。",
  },

  // ===== خيارات: نوع العمل =====
  "opt.workType.individual": { ar: "فرد", en: "Individual", tr: "Bireysel", zh: "个人" },
  "opt.workType.company": { ar: "شركة", en: "Company", tr: "Şirket", zh: "公司" },
  "opt.workType.consulting_office": { ar: "مكتب استشاري", en: "Consulting office", tr: "Danışmanlık ofisi", zh: "咨询办公室" },
  "opt.workType.brokerage": { ar: "مكتب وساطة", en: "Brokerage office", tr: "Aracılık ofisi", zh: "中介机构" },
  "opt.workType.other": { ar: "جهة أخرى", en: "Other", tr: "Diğer", zh: "其他" },

  // ===== خيارات: سنوات الخبرة =====
  "opt.years.lt2": { ar: "أقل من سنتين", en: "Less than 2 years", tr: "2 yıldan az", zh: "少于 2 年" },
  "opt.years.2to5": { ar: "2 – 5 سنوات", en: "2 – 5 years", tr: "2 – 5 yıl", zh: "2 – 5 年" },
  "opt.years.5to10": { ar: "5 – 10 سنوات", en: "5 – 10 years", tr: "5 – 10 yıl", zh: "5 – 10 年" },
  "opt.years.10to20": { ar: "10 – 20 سنة", en: "10 – 20 years", tr: "10 – 20 yıl", zh: "10 – 20 年" },
  "opt.years.gt20": { ar: "أكثر من 20 سنة", en: "More than 20 years", tr: "20 yıldan fazla", zh: "20 年以上" },

  // ===== خيارات: أنواع المستثمرين =====
  "opt.investorType.hnwi": { ar: "أفراد ذوو ملاءة مالية", en: "High-net-worth individuals", tr: "Yüksek varlıklı bireyler", zh: "高净值个人" },
  "opt.investorType.investment_company": { ar: "شركات استثمار", en: "Investment companies", tr: "Yatırım şirketleri", zh: "投资公司" },
  "opt.investorType.family_office": { ar: "مكاتب عائلية", en: "Family offices", tr: "Aile ofisleri", zh: "家族办公室" },
  "opt.investorType.fund": { ar: "صناديق استثمار", en: "Investment funds", tr: "Yatırım fonları", zh: "投资基金" },
  "opt.investorType.holding": { ar: "شركات قابضة", en: "Holding companies", tr: "Holding şirketleri", zh: "控股公司" },
  "opt.investorType.real_estate_dev": { ar: "مطوّرون عقاريون", en: "Real estate developers", tr: "Gayrimenkul geliştiricileri", zh: "房地产开发商" },
  "opt.investorType.industrial": { ar: "شركات صناعية", en: "Industrial companies", tr: "Sanayi şirketleri", zh: "工业企业" },
  "opt.investorType.agri": { ar: "مستثمرون زراعيون", en: "Agricultural investors", tr: "Tarım yatırımcıları", zh: "农业投资者" },
  "opt.investorType.energy": { ar: "مستثمرون في الطاقة", en: "Energy investors", tr: "Enerji yatırımcıları", zh: "能源投资者" },
  "opt.investorType.government": { ar: "جهات حكومية أو شبه حكومية", en: "Government or semi-government entities", tr: "Kamu veya yarı kamu kurumları", zh: "政府或半政府机构" },
  "opt.investorType.other": { ar: "أخرى", en: "Other", tr: "Diğer", zh: "其他" },

  // ===== خيارات: القطاعات =====
  "opt.sector.industry": { ar: "الصناعة", en: "Industry", tr: "Sanayi", zh: "工业" },
  "opt.sector.agriculture": { ar: "الزراعة", en: "Agriculture", tr: "Tarım", zh: "农业" },
  "opt.sector.food": { ar: "الغذاء", en: "Food", tr: "Gıda", zh: "食品" },
  "opt.sector.realestate": { ar: "العقارات", en: "Real estate", tr: "Gayrimenkul", zh: "房地产" },
  "opt.sector.energy": { ar: "الطاقة", en: "Energy", tr: "Enerji", zh: "能源" },
  "opt.sector.tourism": { ar: "السياحة", en: "Tourism", tr: "Turizm", zh: "旅游" },
  "opt.sector.logistics": { ar: "اللوجستيات", en: "Logistics", tr: "Lojistik", zh: "物流" },
  "opt.sector.tech": { ar: "التكنولوجيا", en: "Technology", tr: "Teknoloji", zh: "科技" },
  "opt.sector.infrastructure": { ar: "البنية التحتية", en: "Infrastructure", tr: "Altyapı", zh: "基础设施" },
  "opt.sector.mining": { ar: "التعدين والمقالع", en: "Mining & quarries", tr: "Madencilik ve taş ocakları", zh: "采矿与采石" },
  "opt.sector.reconstruction": { ar: "إعادة الإعمار", en: "Reconstruction", tr: "Yeniden inşa", zh: "重建" },
  "opt.sector.other": { ar: "أخرى", en: "Other", tr: "Diğer", zh: "其他" },

  // ===== خيارات: حجم الاستثمار =====
  "opt.range.lt100k": { ar: "أقل من 100 ألف دولار", en: "Under $100K", tr: "100 bin doların altı", zh: "10 万美元以下" },
  "opt.range.100k_500k": { ar: "100 ألف – 500 ألف دولار", en: "$100K – $500K", tr: "100 bin – 500 bin dolar", zh: "10 万 – 50 万美元" },
  "opt.range.500k_1m": { ar: "500 ألف – 1 مليون دولار", en: "$500K – $1M", tr: "500 bin – 1 milyon dolar", zh: "50 万 – 100 万美元" },
  "opt.range.1m_5m": { ar: "1 – 5 مليون دولار", en: "$1M – $5M", tr: "1 – 5 milyon dolar", zh: "100 万 – 500 万美元" },
  "opt.range.5m_20m": { ar: "5 – 20 مليون دولار", en: "$5M – $20M", tr: "5 – 20 milyon dolar", zh: "500 万 – 2000 万美元" },
  "opt.range.gt20m": { ar: "أكثر من 20 مليون دولار", en: "Over $20M", tr: "20 milyon dolardan fazla", zh: "2000 万美元以上" },

  // ===== خيارات: نوع العلاقة =====
  "opt.relationship.direct": { ar: "علاقات مباشرة", en: "Direct relationships", tr: "Doğrudan ilişkiler", zh: "直接关系" },
  "opt.relationship.via_partners": { ar: "علاقات عبر شركاء", en: "Relationships via partners", tr: "Ortaklar aracılığıyla ilişkiler", zh: "通过合作伙伴的关系" },
  "opt.relationship.mixed": { ar: "مزيج بين الاثنين", en: "A mix of both", tr: "İkisinin karışımı", zh: "两者结合" },

  // ===== خيارات: نعم/لا =====
  "opt.yesno.yes": { ar: "نعم", en: "Yes", tr: "Evet", zh: "是" },
  "opt.yesno.no": { ar: "لا", en: "No", tr: "Hayır", zh: "否" },
  "opt.region.yes": { ar: "نعم", en: "Yes", tr: "Evet", zh: "是" },
  "opt.region.no": { ar: "لا", en: "No", tr: "Hayır", zh: "否" },
  "opt.region.some": { ar: "إلى حدٍّ ما", en: "Somewhat", tr: "Kısmen", zh: "略有了解" },

  // ===== خيارات: اللغات =====
  "opt.lang.ar": { ar: "العربية", en: "Arabic", tr: "Arapça", zh: "阿拉伯语" },
  "opt.lang.en": { ar: "الإنجليزية", en: "English", tr: "İngilizce", zh: "英语" },
  "opt.lang.tr": { ar: "التركية", en: "Turkish", tr: "Türkçe", zh: "土耳其语" },
  "opt.lang.zh": { ar: "الصينية", en: "Chinese", tr: "Çince", zh: "中文" },
  "opt.lang.fr": { ar: "الفرنسية", en: "French", tr: "Fransızca", zh: "法语" },
  "opt.lang.ru": { ar: "الروسية", en: "Russian", tr: "Rusça", zh: "俄语" },
  "opt.lang.other": { ar: "أخرى", en: "Other", tr: "Diğer", zh: "其他" },

  // ===== لوحة الإدارة: العناوين والأعمدة =====
  "admin.title": { ar: "طلبات سفراء الاستثمار", en: "Investment Ambassador Applications", tr: "Yatırım Elçisi Başvuruları", zh: "投资大使申请" },
  "admin.subtitle": { ar: "مراجعة طلبات الانضمام كسفراء استثمار وإدارتها.", en: "Review and manage Investment Ambassador applications.", tr: "Yatırım Elçisi başvurularını inceleyin ve yönetin.", zh: "审核和管理投资大使申请。" },
  "admin.empty": { ar: "لا توجد طلبات بعد.", en: "No applications yet.", tr: "Henüz başvuru yok.", zh: "暂无申请。" },
  "admin.col.date": { ar: "التاريخ", en: "Date", tr: "Tarih", zh: "日期" },
  "admin.col.name": { ar: "الاسم", en: "Name", tr: "Ad", zh: "姓名" },
  "admin.col.country": { ar: "الدولة", en: "Country", tr: "Ülke", zh: "国家" },
  "admin.col.email": { ar: "البريد", en: "Email", tr: "E-posta", zh: "邮箱" },
  "admin.col.phone": { ar: "الهاتف", en: "Phone", tr: "Telefon", zh: "电话" },
  "admin.col.type": { ar: "النوع", en: "Type", tr: "Tür", zh: "类型" },
  "admin.col.range": { ar: "حجم الاستثمار", en: "Investment size", tr: "Yatırım büyüklüğü", zh: "投资规模" },
  "admin.col.status": { ar: "الحالة", en: "Status", tr: "Durum", zh: "状态" },
  "admin.col.score": { ar: "التقييم", en: "Score", tr: "Puan", zh: "评分" },
  "admin.col.assignee": { ar: "المسؤول", en: "Assignee", tr: "Sorumlu", zh: "负责人" },
  "admin.filter.all": { ar: "كل الحالات", en: "All statuses", tr: "Tüm durumlar", zh: "所有状态" },
  "admin.filter.search": { ar: "بحث بالاسم أو البريد أو الدولة", en: "Search by name, email or country", tr: "Ad, e-posta veya ülkeye göre ara", zh: "按姓名、邮箱或国家搜索" },
  "admin.detail.applicant": { ar: "بيانات المتقدّم", en: "Applicant Details", tr: "Başvuran Bilgileri", zh: "申请人信息" },
  "admin.detail.experience": { ar: "الخبرة والعلاقات", en: "Experience & Network", tr: "Deneyim ve Ağ", zh: "经验与人脉" },
  "admin.detail.evaluation": { ar: "إجابات أسئلة التقييم", en: "Assessment Answers", tr: "Değerlendirme Yanıtları", zh: "评估问题回答" },
  "admin.detail.files": { ar: "الملفات", en: "Files", tr: "Dosyalar", zh: "文件" },
  "admin.detail.admin": { ar: "إدارة الطلب", en: "Manage Application", tr: "Başvuruyu Yönet", zh: "管理申请" },
  "admin.detail.log": { ar: "سجل النشاط", en: "Activity Log", tr: "Etkinlik Günlüğü", zh: "活动日志" },
  "admin.detail.notes": { ar: "الملاحظات الداخلية", en: "Internal Notes", tr: "Dahili Notlar", zh: "内部备注" },
  "admin.action.changeStatus": { ar: "تغيير الحالة", en: "Change status", tr: "Durumu değiştir", zh: "更改状态" },
  "admin.action.addNote": { ar: "إضافة ملاحظة", en: "Add note", tr: "Not ekle", zh: "添加备注" },
  "admin.action.save": { ar: "حفظ", en: "Save", tr: "Kaydet", zh: "保存" },
  "admin.action.download": { ar: "تنزيل", en: "Download", tr: "İndir", zh: "下载" },
  "admin.noFiles": { ar: "لا توجد ملفات مرفقة.", en: "No attached files.", tr: "Ekli dosya yok.", zh: "无附件。" },
  "admin.noNotes": { ar: "لا توجد ملاحظات بعد.", en: "No notes yet.", tr: "Henüz not yok.", zh: "暂无备注。" },
  "admin.back": { ar: "→ العودة إلى القائمة", en: "← Back to list", tr: "← Listeye dön", zh: "← 返回列表" },

  // ===== حالات الطلب =====
  "status.NEW": { ar: "جديد", en: "New", tr: "Yeni", zh: "新建" },
  "status.UNDER_REVIEW": { ar: "قيد المراجعة", en: "Under review", tr: "İncelemede", zh: "审核中" },
  "status.NEEDS_INFO": { ar: "يحتاج معلومات", en: "Needs info", tr: "Bilgi gerekli", zh: "需补充信息" },
  "status.INTERVIEW": { ar: "قيد المقابلة", en: "Interview", tr: "Mülakat", zh: "面谈中" },
  "status.PRE_QUALIFIED": { ar: "مؤهّل مبدئياً", en: "Pre-qualified", tr: "Ön nitelikli", zh: "初步合格" },
  "status.NOT_QUALIFIED": { ar: "غير مؤهّل", en: "Not qualified", tr: "Nitelikli değil", zh: "不合格" },
  "status.PRE_ACCEPTED": { ar: "مقبول مبدئياً", en: "Pre-accepted", tr: "Ön kabul", zh: "初步录用" },
  "status.AWAITING_CONTRACT": { ar: "بانتظار العقد", en: "Awaiting contract", tr: "Sözleşme bekleniyor", zh: "等待合同" },
  "status.CONTRACT_SIGNED": { ar: "تم توقيع العقد", en: "Contract signed", tr: "Sözleşme imzalandı", zh: "合同已签署" },
  "status.ACCOUNT_CREATED": { ar: "تم فتح الحساب", en: "Account created", tr: "Hesap oluşturuldu", zh: "账户已创建" },
  "status.ACTIVE": { ar: "نشط", en: "Active", tr: "Aktif", zh: "活跃" },
  "status.SUSPENDED": { ar: "موقوف مؤقتاً", en: "Suspended", tr: "Askıya alındı", zh: "已暂停" },
  "status.REJECTED": { ar: "مرفوض", en: "Rejected", tr: "Reddedildi", zh: "已拒绝" },
  "status.ARCHIVED": { ar: "مؤرشف", en: "Archived", tr: "Arşivlendi", zh: "已归档" },
};

export function ta(locale: Locale, key: string): string {
  const entry = M[key];
  if (!entry) return key;
  return entry[locale] ?? entry.ar ?? key;
}

export const AMBASSADOR_I18N_KEYS = Object.keys(M);
