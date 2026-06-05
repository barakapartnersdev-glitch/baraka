// مخطط نموذج تسجيل الفرصة الاستثمارية — 10 أقسام، أسئلة متعددة الاختيار وشرطية وإرشادات.
// المصدر الموحّد: يقرؤه محرّك الـ wizard لعرض الأقسام والتحقّق، وتُخزَّن الإجابات في sourceData.answers.

export type Ans = Record<string, string | string[]>;

export type FieldKind =
  | "text" | "textarea" | "country" | "tel" | "email"
  | "number" | "percent" | "url" | "money" | "radio" | "checkbox" | "info";

export interface Opt {
  v: string; // قيمة ثابتة (تُخزَّن وتُستخدم في الشروط)
  l: string; // العرض بالعربية
}

export interface Field {
  id: string;
  label?: string;
  kind: FieldKind;
  required?: boolean;
  help?: string;        // رسالة إرشادية أسفل الحقل
  placeholder?: string;
  example?: string;     // مثال توضيحي
  options?: Opt[];      // لـ radio/checkbox
  showIf?: (a: Ans) => boolean; // الإظهار الشرطي
  note?: string;        // نص توضيحي (لـ kind=info أو تحذير)
  noteTone?: "info" | "warn";
}

export interface FormPage {
  id: string;
  title: string;
  subtitle?: string;
  fields: Field[];
}

// مساعدات الشروط
export const is = (a: Ans, id: string, v: string) => a[id] === v;
export const has = (a: Ans, id: string, v: string) =>
  Array.isArray(a[id]) && (a[id] as string[]).includes(v);
export const filled = (a: Ans, id: string) => {
  const x = a[id];
  return Array.isArray(x) ? x.length > 0 : !!(x && String(x).trim());
};

export const FORM_PAGES: FormPage[] = [
  // ===== 1) بيانات مقدّم الطلب وصفته القانونية =====
  {
    id: "applicant",
    title: "بيانات مقدّم الطلب",
    subtitle: "البيانات الشخصية وصفتك القانونية.",
    fields: [
      { id: "fullName", label: "الاسم الكامل كما في الوثائق الرسمية", kind: "text", required: true, help: "اكتب اسمك الرباعي كما يظهر في الهوية أو جواز السفر." },
      { id: "nationality", label: "الجنسية", kind: "country", required: true },
      { id: "residenceCountry", label: "دولة الإقامة الحالية", kind: "country", required: true },
      { id: "city", label: "المدينة", kind: "text", required: true },
      { id: "phone", label: "رقم الهاتف / واتساب", kind: "tel", required: true, help: "أدخل الرقم مع رمز الدولة (مثال: ‎+966...). سيُرسَل رمز تحقق OTP لاحقاً للتأكيد." },
      { id: "email", label: "البريد الإلكتروني", kind: "email", required: true, help: "سيُرسَل رابط/رمز تحقّق للتأكيد." },
      {
        id: "applicantType", label: "هل أنت فرد أم تمثّل شركة / مؤسسة؟", kind: "radio", required: true,
        options: [
          { v: "individual", l: "فرد" },
          { v: "company", l: "شركة" },
          { v: "org", l: "مؤسسة / جمعية / كيان قانوني" },
          { v: "office", l: "مكتب استشاري أو تمثيلي" },
          { v: "other", l: "جهة أخرى" },
        ],
      },
      // شركة/كيان
      { id: "companyName", label: "اسم الشركة / الكيان", kind: "text", required: true, showIf: (a) => is(a, "applicantType", "company") || is(a, "applicantType", "org") || is(a, "applicantType", "office") },
      { id: "companyCountry", label: "الدولة المسجّلة فيها الشركة", kind: "country", showIf: (a) => is(a, "applicantType", "company") || is(a, "applicantType", "org") || is(a, "applicantType", "office") },
      { id: "companyReg", label: "رقم السجل التجاري (إن وجد)", kind: "text", showIf: (a) => is(a, "applicantType", "company") || is(a, "applicantType", "org") || is(a, "applicantType", "office") },
      {
        id: "applicantRole", label: "صفة مقدّم الطلب داخل الشركة", kind: "radio",
        showIf: (a) => is(a, "applicantType", "company") || is(a, "applicantType", "org") || is(a, "applicantType", "office"),
        options: [
          { v: "owner", l: "مالك" }, { v: "partner", l: "شريك" }, { v: "gm", l: "مدير عام" },
          { v: "signatory", l: "مفوّض بالتوقيع" }, { v: "employee", l: "موظف مكلّف" },
          { v: "advisor", l: "مستشار" }, { v: "other", l: "غير ذلك" },
        ],
      },
      {
        id: "canProveRole", label: "هل تستطيع تقديم وثائق تثبت صفتك داخل الشركة عند الطلب؟", kind: "radio",
        showIf: (a) => is(a, "applicantType", "company") || is(a, "applicantType", "org") || is(a, "applicantType", "office"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "later", l: "لاحقاً عند الجدية" }],
      },
    ],
  },

  // ===== 2) صفة مقدّم الطلب بالنسبة للمشروع =====
  {
    id: "relation",
    title: "صفتك بالنسبة للمشروع",
    subtitle: "علاقتك بالأصل أو المشروع المطلوب تمويله أو عرضه.",
    fields: [
      {
        id: "roleToProject", label: "ما صفتك بالنسبة للمشروع أو الأصل؟", kind: "radio", required: true,
        options: [
          { v: "fullOwner", l: "المالك الكامل للمشروع / الأصل" },
          { v: "partner", l: "أحد الشركاء أو الملّاك" },
          { v: "repOwners", l: "أمثّل مجموعة من الملّاك" },
          { v: "authorized", l: "مفوّض قانونياً من المالك أو الملّاك" },
          { v: "manager", l: "مدير المشروع أو الشركة المالكة" },
          { v: "consultant", l: "مستشار مالي أو قانوني مكلّف" },
          { v: "broker", l: "وسيط أو معرّف بالفرصة" },
          { v: "other", l: "جهة أخرى" },
        ],
      },
      // المالك الكامل
      {
        id: "ownershipRegistered", label: "هل الملكية مسجّلة باسمك مباشرة؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "fullOwner"),
        options: [{ v: "yes", l: "نعم" }, { v: "company", l: "لا، باسم شركة أملكها" }, { v: "family", l: "لا، باسم أحد أفراد العائلة" }, { v: "other", l: "لا، باسم جهة أخرى" }],
      },
      {
        id: "canProveOwnership", label: "هل تستطيع تقديم ما يثبت الملكية عند الطلب؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "fullOwner"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "preparing", l: "الوثائق قيد التجهيز" }],
      },
      // أحد الشركاء
      { id: "ownershipPercent", label: "ما نسبة ملكيتك التقريبية؟", kind: "percent", showIf: (a) => is(a, "roleToProject", "partner") },
      {
        id: "partnersAware", label: "هل باقي الشركاء على علم بتقديم هذا الطلب؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "partner"),
        options: [{ v: "allAware", l: "نعم، جميعهم على علم وموافقون" }, { v: "someAware", l: "بعضهم على علم" }, { v: "notYet", l: "لا، لم يتم إبلاغهم بعد" }, { v: "unknown", l: "لا أعرف" }],
      },
      {
        id: "partnersAuthorization", label: "هل لديك تفويض من بقية الشركاء للتواصل حول الاستثمار؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "partner"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "obtainable", l: "يمكن الحصول عليه عند الحاجة" }],
      },
      {
        id: "partnersDisputes", label: "هل توجد خلافات حالية بين الملّاك أو الشركاء؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "partner"),
        options: [{ v: "no", l: "لا" }, { v: "yes", l: "نعم" }, { v: "some", l: "يوجد بعض النقاط غير المحسومة" }, { v: "later", l: "أفضّل توضيح ذلك لاحقاً" }],
      },
      // أمثّل مجموعة
      { id: "ownersCount", label: "عدد الملّاك أو الشركاء التقريبي", kind: "number", showIf: (a) => is(a, "roleToProject", "repOwners") },
      {
        id: "hasSingleRep", label: "هل يوجد ممثّل قانوني أو إداري واحد عن جميع الملّاك؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "repOwners"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "arranging", l: "قيد الترتيب" }],
      },
      {
        id: "ownersApprove", label: "هل جميع الملّاك موافقون مبدئياً على البحث عن مستثمر أو تمويل؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "repOwners"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "majority", l: "الأغلبية موافقة" }, { v: "notFinal", l: "لم تُؤخذ الموافقة النهائية بعد" }],
      },
      {
        id: "canProvideGroupAuth", label: "هل تستطيع تقديم تفويض جماعي أو وكالة قانونية عند الطلب؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "repOwners"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "later", l: "لاحقاً عند تقدّم المفاوضات" }],
      },
      // مفوّض قانونياً
      {
        id: "authType", label: "نوع التفويض المتوفّر لديك", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "authorized"),
        options: [
          { v: "poa", l: "وكالة قانونية رسمية" }, { v: "written", l: "تفويض خطي من المالك" },
          { v: "repContract", l: "عقد تمثيل" }, { v: "companyAssign", l: "تكليف من الشركة المالكة" },
          { v: "verbal", l: "تفويض شفهي فقط" }, { v: "other", l: "غير ذلك" },
        ],
      },
      {
        id: "authAllowsNegotiation", label: "هل التفويض يسمح لك بالتفاوض مع المستثمرين؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "authorized"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "initialOnly", l: "يسمح بالتواصل الأولي فقط" }, { v: "unclear", l: "غير واضح" }],
      },
      {
        id: "canUploadAuth", label: "هل تستطيع رفع نسخة من التفويض لاحقاً؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "authorized"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "onRequest", l: "عند الطلب فقط" }],
      },
      // وسيط
      {
        id: "brokerNotice", kind: "info", noteTone: "info",
        showIf: (a) => is(a, "roleToProject", "broker"),
        note: "منصة Baraka Partners تقبل الفرص من المالك الأصلي أو المفوّض قانونياً عنه. يمكن للوسيط تعريفنا بالفرصة، لكن لا تُعرض أي فرصة للمستثمرين إلا بعد التحقّق من المالك أو المفوّض الرسمي.",
      },
      { id: "brokerDirectContact", label: "هل لديك تواصل مباشر مع المالك أو صاحب القرار؟", kind: "radio", showIf: (a) => is(a, "roleToProject", "broker"), options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }] },
      { id: "brokerArrangeContact", label: "هل يمكن ترتيب تواصل مباشر بين إدارة المنصة والمالك؟", kind: "radio", showIf: (a) => is(a, "roleToProject", "broker"), options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }] },
      { id: "brokerWrittenAgreement", label: "هل لديك اتفاق خطي مع المالك يثبت دورك؟", kind: "radio", showIf: (a) => is(a, "roleToProject", "broker"), options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }] },
      {
        id: "brokerAcceptDirect", label: "هل توافق على أن يتم التعامل الرسمي لاحقاً مع المالك أو المفوّض القانوني مباشرة؟", kind: "radio",
        showIf: (a) => is(a, "roleToProject", "broker"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }],
      },
      {
        id: "brokerDisqualified", kind: "info", noteTone: "warn",
        showIf: (a) => is(a, "roleToProject", "broker") && is(a, "brokerAcceptDirect", "no"),
        note: "تنبيه: سيُوضَع الطلب في حالة «غير مؤهّل مبدئياً» حتى تقديم تفويض واضح من المالك أو المفوّض القانوني.",
      },
    ],
  },

  // ===== 3) معلومات المشروع الأساسية =====
  {
    id: "project",
    title: "معلومات المشروع الأساسية",
    subtitle: "تعريف المشروع وموقعه ومستوى الإفصاح المطلوب.",
    fields: [
      { id: "projectName", label: "اسم المشروع أو الأصل الاستثماري", kind: "text", required: true, example: "مصنع أغذية قائم، أرض زراعية، فندق قيد التطوير، مشروع سكني، خط إنتاج صناعي." },
      { id: "projectCountry", label: "الدولة التي يقع فيها المشروع", kind: "country", required: true },
      { id: "projectCity", label: "المدينة / المحافظة", kind: "text", required: true },
      { id: "projectArea", label: "المنطقة العامة", kind: "text" },
      {
        id: "showLocation", label: "هل تريد إظهار الدولة والمدينة للمستثمرين في العرض المختصر؟", kind: "radio",
        options: [
          { v: "yes", l: "نعم" }, { v: "yesHideExact", l: "نعم، مع إخفاء الموقع الدقيق" },
          { v: "countryOnly", l: "لا، أريد عرض الدولة فقط" }, { v: "platform", l: "يحدّد فريق المنصة ذلك بعد المراجعة" },
        ],
      },
      { id: "mapUrl", label: "رابط موقع المشروع على خرائط Google (إن وجد)", kind: "url" },
      { id: "coords", label: "الإحداثيات الجغرافية (اختياري)", kind: "text" },
      {
        id: "locationSensitive", label: "هل الموقع الدقيق حسّاس ويجب عدم كشفه للمستثمرين في المرحلة الأولى؟", kind: "radio",
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "later", l: "يحدّد لاحقاً حسب المستثمر" }],
      },
    ],
  },

  // ===== 4) طبيعة المشروع أو الأصل =====
  {
    id: "nature",
    title: "طبيعة المشروع أو الأصل",
    subtitle: "نوع الفرصة ووضعها الحالي ونشاطها.",
    fields: [
      {
        id: "opportunityNature", label: "ما طبيعة الفرصة الاستثمارية؟", kind: "radio", required: true,
        options: [
          { v: "agri", l: "مشروع زراعي" }, { v: "industrial", l: "مشروع صناعي" }, { v: "tourism", l: "مشروع سياحي / فندقي" },
          { v: "commercial", l: "مشروع تجاري" }, { v: "realestate", l: "مشروع عقاري" }, { v: "logistics", l: "مشروع لوجستي / مستودعات" },
          { v: "energy", l: "مشروع طاقة / طاقة متجددة" }, { v: "tech", l: "مشروع تكنولوجي / فنتك" },
          { v: "stopped", l: "مصنع متوقف أو يحتاج إعادة تشغيل" }, { v: "expansion", l: "شركة قائمة تبحث عن توسّع" },
          { v: "idleAsset", l: "أرض أو أصل غير مستثمر حالياً" }, { v: "other", l: "غير ذلك" },
        ],
      },
      {
        id: "projectStatus", label: "ما الوضع الحالي للمشروع؟", kind: "radio", required: true,
        options: [
          { v: "operating", l: "قائم ويعمل حالياً" }, { v: "paused", l: "قائم لكنه متوقف مؤقتاً" }, { v: "lowCapacity", l: "قائم لكنه يعمل بطاقة منخفضة" },
          { v: "construction", l: "قيد الإنشاء" }, { v: "licensing", l: "قيد الترخيص" }, { v: "rawLand", l: "أرض خام غير مطوّرة" },
          { v: "ideaOnly", l: "فكرة أو دراسة أولية فقط" }, { v: "readyAsset", l: "أصل جاهز للبيع أو الشراكة" }, { v: "restructure", l: "مشروع يحتاج إعادة هيكلة" },
        ],
      },
      {
        id: "projectAge", label: "منذ متى المشروع قائم أو مملوك لكم؟", kind: "radio",
        options: [
          { v: "lt1", l: "أقل من سنة" }, { v: "1to3", l: "من سنة إلى 3 سنوات" }, { v: "3to5", l: "من 3 إلى 5 سنوات" },
          { v: "gt5", l: "أكثر من 5 سنوات" }, { v: "none", l: "المشروع غير قائم بعد" },
        ],
      },
      {
        id: "hasRevenue", label: "هل للمشروع نشاط أو إيرادات حالية؟", kind: "radio",
        help: "إن اخترت «نعم» ستظهر أسئلة الإيرادات في قسم المعلومات المالية.",
        options: [
          { v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "stopped", l: "كان لديه إيرادات سابقاً وتوقّف" },
          { v: "seasonal", l: "الإيرادات موسمية" }, { v: "nodisclose", l: "لا أرغب بالإفصاح الآن" },
        ],
      },
    ],
  },

  // ===== 5) نوع الملكية والصفة القانونية للأصل =====
  {
    id: "ownership",
    title: "الملكية والصفة القانونية للأصل",
    subtitle: "نوع ملكية الأصل ووثائقها.",
    fields: [
      {
        id: "ownershipType", label: "ما نوع ملكية الأصل أو المشروع؟", kind: "radio", required: true,
        options: [
          { v: "title", l: "ملكية بطابو / سند نظامي" }, { v: "company", l: "ملكية باسم شركة" },
          { v: "longLease", l: "عقد إيجار طويل الأمد" }, { v: "usufruct", l: "عقد انتفاع" }, { v: "allocation", l: "عقد تخصيص" },
          { v: "courtRuling", l: "حكم محكمة" }, { v: "shared", l: "ملكية على الشيوع / المشاع" },
          { v: "newLease", l: "عقد إيجار جديد" }, { v: "devRight", l: "حق تطوير أو إدارة" },
          { v: "investLicense", l: "ترخيص استثماري فقط" }, { v: "unclear", l: "غير واضح حالياً" }, { v: "other", l: "غير ذلك" },
        ],
      },
      // طابو
      {
        id: "titleClean", label: "هل سند الملكية خالٍ من الإشارات أو الرهونات؟", kind: "radio",
        showIf: (a) => is(a, "ownershipType", "title"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "unknown", l: "لا أعرف" }, { v: "notes", l: "توجد ملاحظات يجب توضيحها" }],
      },
      {
        id: "titleInName", label: "هل سند الملكية باسم مقدّم الطلب؟", kind: "radio",
        showIf: (a) => is(a, "ownershipType", "title"),
        options: [{ v: "yes", l: "نعم" }, { v: "company", l: "لا، باسم شركة" }, { v: "partner", l: "لا، باسم أحد الشركاء" }, { v: "many", l: "لا، باسم عدّة ملّاك" }],
      },
      // شيوع
      {
        id: "sharesDefined", label: "هل تم فرز الحصص أو تحديد حصة المشروع بدقّة؟", kind: "radio",
        showIf: (a) => is(a, "ownershipType", "shared"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "inProgress", l: "قيد الفرز" }, { v: "needsLegal", l: "يحتاج دراسة قانونية" }],
      },
      {
        id: "sharedApprove", label: "هل جميع المالكين موافقون على الاستثمار أو الشراكة؟", kind: "radio",
        showIf: (a) => is(a, "ownershipType", "shared"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "some", l: "بعضهم موافق" }, { v: "notYet", l: "لم تُؤخذ الموافقات بعد" }],
      },
      // إيجار طويل
      {
        id: "leaseRemaining", label: "مدة عقد الإيجار المتبقية", kind: "radio",
        showIf: (a) => is(a, "ownershipType", "longLease"),
        options: [{ v: "lt1", l: "أقل من سنة" }, { v: "1to3", l: "1 إلى 3 سنوات" }, { v: "3to5", l: "3 إلى 5 سنوات" }, { v: "gt5", l: "أكثر من 5 سنوات" }, { v: "gt10", l: "أكثر من 10 سنوات" }],
      },
      {
        id: "leaseAllowsInvestor", label: "هل يسمح العقد بإدخال مستثمر أو شريك أو تطوير الأصل؟", kind: "radio",
        showIf: (a) => is(a, "ownershipType", "longLease"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "lessorApproval", l: "يحتاج موافقة المؤجّر" }, { v: "unclear", l: "غير واضح" }],
      },
      // حكم محكمة
      {
        id: "rulingFinal", label: "هل الحكم نهائي ومبرم؟", kind: "radio",
        showIf: (a) => is(a, "ownershipType", "courtRuling"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "appeal", l: "قيد الاستئناف" }, { v: "unknown", l: "لا أعرف" }],
      },
      {
        id: "rulingExecuted", label: "هل تم تنفيذ الحكم ونقل الملكية فعلياً؟", kind: "radio",
        showIf: (a) => is(a, "ownershipType", "courtRuling"),
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "inProgress", l: "قيد التنفيذ" }],
      },
    ],
  },

  // ===== 6) نوع الاستثمار المطلوب =====
  {
    id: "investment",
    title: "نوع الاستثمار المطلوب",
    subtitle: "ما الذي تبحث عنه وقيمته وكيفية استخدامه.",
    fields: [
      {
        id: "lookingFor", label: "ما الذي تبحث عنه تحديداً؟", kind: "radio", required: true,
        options: [
          { v: "funding", l: "تمويل فقط" }, { v: "financialPartner", l: "شريك مالي" }, { v: "operatingPartner", l: "شريك تشغيلي" },
          { v: "strategicPartner", l: "شريك استراتيجي" }, { v: "sellShare", l: "بيع حصة من المشروع" }, { v: "sellAll", l: "بيع كامل المشروع أو الأصل" },
          { v: "equipFunding", l: "تمويل معدات أو خطوط إنتاج" }, { v: "jointDev", l: "تطوير مشترك" }, { v: "manageForShare", l: "إدارة وتشغيل مقابل نسبة" },
          { v: "workingCapital", l: "تمويل رأس مال عامل" }, { v: "debtRestructure", l: "إعادة هيكلة ديون أو التزامات" }, { v: "other", l: "غير ذلك" },
        ],
      },
      {
        id: "amountMode", label: "ما قيمة الاستثمار أو التمويل المطلوب (USD)؟", kind: "radio", required: true,
        options: [{ v: "fixed", l: "رقم محدّد" }, { v: "range", l: "نطاق تقريبي" }, { v: "undecided", l: "لم يتم تحديده بعد" }],
      },
      { id: "amountFixed", label: "قيمة الاستثمار المطلوبة (USD)", kind: "money", showIf: (a) => is(a, "amountMode", "fixed") },
      { id: "amountMin", label: "من (USD)", kind: "money", showIf: (a) => is(a, "amountMode", "range") },
      { id: "amountMax", label: "إلى (USD)", kind: "money", showIf: (a) => is(a, "amountMode", "range") },
      { id: "minEntry", label: "الحد الأدنى المقبول لدخول المستثمر (USD) — اختياري", kind: "money" },
      {
        id: "amountBasis", label: "هل المبلغ المطلوب مبني على دراسة أو تقدير؟", kind: "radio",
        options: [
          { v: "feasibility", l: "دراسة جدوى" }, { v: "quotes", l: "عروض أسعار" }, { v: "valuation", l: "تقييم أصول" },
          { v: "mgmt", l: "تقدير من الإدارة" }, { v: "undecided", l: "غير محدّد بعد" },
        ],
      },
      {
        id: "useOfCapital", label: "كيف سيتم استخدام رأس المال المطلوب؟", kind: "checkbox",
        help: "يمكن اختيار أكثر من بند.",
        options: [
          { v: "equipment", l: "شراء معدات أو خطوط إنتاج" }, { v: "build", l: "بناء أو تطوير عقار" }, { v: "workingCapital", l: "رأس مال عامل" },
          { v: "materials", l: "شراء مواد أولية" }, { v: "marketing", l: "تسويق وفتح أسواق" }, { v: "operation", l: "تشغيل وإدارة" },
          { v: "settleDebt", l: "سداد التزامات محددة" }, { v: "expandCapacity", l: "توسعة الطاقة الإنتاجية" }, { v: "licenses", l: "استكمال تراخيص" },
          { v: "infrastructure", l: "تطوير بنية تحتية" }, { v: "other", l: "غير ذلك" },
        ],
      },
      {
        id: "hasProposedShare", label: "هل توجد نسبة شراكة مقترحة للمستثمر؟", kind: "radio",
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "negotiable", l: "قابلة للتفاوض" }, { v: "needHelp", l: "أحتاج مساعدة في تحديدها" }],
      },
      { id: "proposedShare", label: "ما النسبة المقترحة؟", kind: "percent", showIf: (a) => is(a, "hasProposedShare", "yes") },
      {
        id: "investorEntry", label: "كيف تقبل دخول المستثمر؟", kind: "radio",
        options: [
          { v: "newCompany", l: "شركة جديدة مشتركة" }, { v: "existingCompany", l: "شركة قائمة" }, { v: "buyAssetShare", l: "شراء حصة من الأصل" },
          { v: "operateContract", l: "عقد تشغيل وإدارة" }, { v: "profitFinance", l: "عقد تمويل مقابل أرباح" }, { v: "laterLegal", l: "يُحدّد قانونياً لاحقاً" },
        ],
      },
    ],
  },

  // ===== 7) المعلومات المالية =====
  {
    id: "financials",
    title: "المعلومات المالية",
    subtitle: "البيانات المالية والالتزامات والعائد المتوقع. كل الحقول اختيارية ما لم يُذكر خلاف ذلك.",
    fields: [
      {
        id: "financialData", label: "هل توجد بيانات مالية متوفّرة للمشروع؟", kind: "radio",
        options: [
          { v: "audited", l: "نعم، قوائم مالية رسمية" }, { v: "internal", l: "نعم، بيانات داخلية غير مدقّقة" },
          { v: "invoices", l: "توجد فواتير ومبيعات فقط" }, { v: "none", l: "لا توجد بيانات مالية" }, { v: "notStarted", l: "المشروع لم يبدأ التشغيل بعد" },
        ],
      },
      { id: "annualRevenue", label: "الإيرادات السنوية التقريبية (إن وجدت) — USD", kind: "money" },
      { id: "netProfit", label: "صافي الربح أو الخسارة التقريبية — USD", kind: "text" },
      {
        id: "hasDebts", label: "هل المشروع عليه ديون أو التزامات حالية؟", kind: "radio",
        options: [{ v: "no", l: "لا" }, { v: "yes", l: "نعم" }, { v: "operational", l: "يوجد التزامات تشغيلية عادية" }, { v: "nodisclose", l: "لا أرغب بالإفصاح الآن" }],
      },
      {
        id: "debtsNature", label: "ما طبيعة الالتزامات؟", kind: "checkbox",
        showIf: (a) => is(a, "hasDebts", "yes"),
        options: [
          { v: "bankLoans", l: "قروض بنكية" }, { v: "suppliers", l: "ديون موردين" }, { v: "tax", l: "التزامات ضريبية" },
          { v: "salaries", l: "رواتب أو عمالة" }, { v: "dispute", l: "نزاع مالي" }, { v: "equipInstall", l: "أقساط معدات" }, { v: "other", l: "غير ذلك" },
        ],
      },
      {
        id: "hasValuation", label: "هل يوجد تقييم حديث للأصل أو المشروع؟", kind: "radio",
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "preparing", l: "قيد الإعداد" }, { v: "needHelp", l: "أحتاج مساعدة في التقييم" }],
      },
      {
        id: "hasExpectedReturn", label: "هل يوجد عائد متوقّع للمستثمر؟", kind: "radio",
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }, { v: "notCalc", l: "لم يتم احتسابه بعد" }],
      },
      {
        id: "expectedReturnType", label: "ما العائد المتوقّع؟", kind: "checkbox",
        showIf: (a) => is(a, "hasExpectedReturn", "yes"),
        options: [
          { v: "annualPct", l: "نسبة سنوية تقريبية" }, { v: "payback", l: "فترة استرداد رأس المال" },
          { v: "multiple", l: "مضاعف استثماري" }, { v: "other", l: "غير ذلك" },
        ],
      },
      { id: "expectedReturnDetail", label: "تفاصيل العائد المتوقّع", kind: "textarea", showIf: (a) => is(a, "hasExpectedReturn", "yes") },
    ],
  },

  // ===== 8) الوثائق المتوفّرة (تأكيد التوفّر — الرفع في القسم الأخير) =====
  {
    id: "documents",
    title: "الوثائق المتوفّرة",
    subtitle: "أخبرنا بما هو متوفّر لديك؛ يتم رفع الملفات فعلياً في القسم الأخير.",
    fields: [
      {
        id: "legalDocs", label: "ما الوثائق القانونية المتوفّرة؟", kind: "checkbox",
        options: [
          { v: "title", l: "سند ملكية / طابو" }, { v: "incorporation", l: "عقد تأسيس الشركة" }, { v: "commercialReg", l: "سجل تجاري" },
          { v: "industrialLic", l: "رخصة صناعية" }, { v: "commercialLic", l: "رخصة تجارية" }, { v: "buildingLic", l: "رخصة بناء" },
          { v: "lease", l: "عقد إيجار" }, { v: "poa", l: "وكالة أو تفويض" }, { v: "allocation", l: "عقد تخصيص" },
          { v: "ruling", l: "حكم محكمة" }, { v: "patent", l: "براءة اختراع أو علامة تجارية" }, { v: "salesContracts", l: "عقود بيع أو توريد" },
          { v: "none", l: "لا توجد وثائق حالياً" },
        ],
      },
      {
        id: "financialDocs", label: "ما الوثائق المالية المتوفّرة؟", kind: "checkbox",
        options: [
          { v: "feasibility", l: "دراسة جدوى" }, { v: "statements", l: "قوائم مالية" }, { v: "pnl", l: "كشف أرباح وخسائر" },
          { v: "sales", l: "كشف مبيعات" }, { v: "debts", l: "كشف ديون والتزامات" }, { v: "quotes", l: "عروض أسعار معدات" },
          { v: "valuation", l: "تقييم أصول" }, { v: "financialPlan", l: "خطة مالية مستقبلية" }, { v: "none", l: "لا توجد وثائق مالية" },
        ],
      },
      {
        id: "technicalDocs", label: "ما الوثائق الفنية أو التشغيلية المتوفّرة؟", kind: "checkbox",
        options: [
          { v: "drawings", l: "مخططات هندسية" }, { v: "siteSketch", l: "كروكي الموقع" }, { v: "photos", l: "صور المشروع" },
          { v: "video", l: "فيديو" }, { v: "equipList", l: "قائمة المعدات" }, { v: "capacity", l: "الطاقة الإنتاجية" },
          { v: "techReports", l: "تقارير فنية" }, { v: "envLicenses", l: "تراخيص بيئية أو سلامة" }, { v: "opPlan", l: "خطة تشغيل" },
          { v: "none", l: "لا توجد وثائق فنية" },
        ],
      },
      {
        id: "readyToUpload", label: "هل أنت مستعد لرفع الوثائق الآن؟", kind: "radio",
        options: [{ v: "now", l: "نعم" }, { v: "later", l: "لاحقاً" }, { v: "onRequest", l: "عند طلب الإدارة فقط" }],
      },
    ],
  },

  // ===== 9) نقاط القوة والمخاطر =====
  {
    id: "strengths",
    title: "نقاط القوة والمخاطر",
    subtitle: "أبرز ما يميّز الفرصة وأبرز تحدياتها بشفافية.",
    fields: [
      {
        id: "strengths", label: "ما أبرز نقاط القوة في هذه الفرصة؟", kind: "checkbox",
        options: [
          { v: "location", l: "موقع استراتيجي" }, { v: "existingAsset", l: "ملكية أصل قائم" }, { v: "licensesReady", l: "رخص جاهزة" },
          { v: "equipment", l: "معدات أو خطوط إنتاج موجودة" }, { v: "clients", l: "عملاء أو عقود حالية" }, { v: "demand", l: "طلب مرتفع في السوق" },
          { v: "experience", l: "خبرة تشغيلية" }, { v: "export", l: "إمكانية تصدير" }, { v: "lowCost", l: "تكلفة تشغيل منخفضة" },
          { v: "scalable", l: "قابلية توسّع عالية" }, { v: "other", l: "غير ذلك" },
        ],
      },
      {
        id: "challenges", label: "ما أبرز التحديات الحالية؟", kind: "checkbox",
        options: [
          { v: "funding", l: "نقص التمويل" }, { v: "docs", l: "نقص الوثائق" }, { v: "stopped", l: "توقف الإنتاج" },
          { v: "weakMgmt", l: "ضعف الإدارة التشغيلية" }, { v: "equipment", l: "نقص المعدات" }, { v: "licenses", l: "الحاجة إلى تراخيص" },
          { v: "debts", l: "ديون أو التزامات" }, { v: "legalDispute", l: "نزاع قانوني" }, { v: "marketing", l: "ضعف التسويق" },
          { v: "needPartner", l: "الحاجة إلى شريك استراتيجي" }, { v: "other", l: "غير ذلك" },
        ],
      },
      {
        id: "hasLegalDispute", label: "هل يوجد أي نزاع قانوني متعلق بالمشروع أو الأصل؟", kind: "radio",
        options: [{ v: "no", l: "لا" }, { v: "yes", l: "نعم" }, { v: "possible", l: "محتمل" }, { v: "unknown", l: "لا أعرف" }],
      },
      { id: "disputeDetail", label: "صف طبيعة النزاع بشكل مختصر", kind: "textarea", showIf: (a) => is(a, "hasLegalDispute", "yes") },
      {
        id: "investorObligations", label: "هل توجد أي التزامات يجب أن يعرفها المستثمر قبل دراسة الفرصة؟", kind: "radio",
        options: [{ v: "no", l: "لا" }, { v: "yes", l: "نعم" }, { v: "afterNda", l: "لاحقاً عند توقيع اتفاقية السرية" }],
      },
    ],
  },

  // ===== 10) الخصوصية والإفصاح + الإقرار =====
  {
    id: "privacy",
    title: "الخصوصية والإفصاح",
    subtitle: "تحكّم بما يُكشف، ووافق على آلية المنصة.",
    fields: [
      {
        id: "sensitiveInfo", label: "ما المعلومات التي تعتبرها حساسة ولا ترغب بكشفها في العرض الأولي؟", kind: "checkbox",
        options: [
          { v: "ownerName", l: "اسم المالك" }, { v: "exactLocation", l: "الموقع الدقيق" }, { v: "photos", l: "الصور" },
          { v: "documents", l: "الوثائق" }, { v: "financials", l: "البيانات المالية" }, { v: "companyName", l: "اسم الشركة" },
          { v: "clients", l: "أسماء العملاء" }, { v: "contracts", l: "العقود" }, { v: "none", l: "لا مانع من عرض المعلومات العامة" },
        ],
      },
      {
        id: "agreeReframe", label: "هل توافق على أن تقوم إدارة Baraka Partners بإعادة صياغة الفرصة وعرضها بشكل مختصر دون كشف التفاصيل الحساسة؟", kind: "radio", required: true,
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }],
      },
      {
        id: "agreeNda", label: "هل توافق على ألا تُكشف التفاصيل الكاملة إلا لمستثمر معتمد وبعد توقيع اتفاقية سرّية خاصة بهذه الفرصة؟", kind: "radio", required: true,
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }],
      },
      {
        id: "agreeContact", label: "هل توافق على تواصل فريق عهد البركة معك لطلب نواقص أو توضيحات قبل عرض الفرصة؟", kind: "radio", required: true,
        options: [{ v: "yes", l: "نعم" }, { v: "no", l: "لا" }],
      },
      {
        id: "declaration", label: "إقرار صحة المعلومات", kind: "checkbox", required: true,
        options: [{ v: "agree", l: "أقرّ بأن المعلومات المقدّمة صحيحة حسب علمي، وأتفهّم أن تقديم معلومات غير دقيقة قد يؤدي إلى رفض الطلب أو إيقاف عرض الفرصة." }],
      },
    ],
  },
];

// ترتيب الأقسام لشريط التقدّم
export const PAGE_TITLES = FORM_PAGES.map((p) => p.title);

// إيجاد التسمية العربية لقيمة خيار حسب معرّف الحقل (للاشتقاق والعرض).
export function labelOf(fieldId: string, value: string): string {
  for (const p of FORM_PAGES) {
    const f = p.fields.find((x) => x.id === fieldId);
    if (f?.options) return f.options.find((o) => o.v === value)?.l ?? value;
  }
  return value;
}
