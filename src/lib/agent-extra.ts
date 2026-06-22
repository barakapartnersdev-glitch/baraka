// نصوص إطار التصميم الفاخر للصفحة العامة «وكلاء أصحاب الأصول» — تكمّل agent-i18n.
// نفس نمط agentUi: ثلاث لغات فعلية (ar/en/tr)، والصينية ترجع للإنجليزية.
import type { Locale } from "@/lib/i18n";

export interface AgentExtra {
  heroGold: string;
  stat1t: string; stat1s: string;
  stat2t: string; stat2s: string;
  stat3t: string; stat3s: string;
  stat4t: string; stat4s: string;
  whoH2a: string; whoH2b: string;
  whoChip1: string; whoChip2: string; whoChip3: string; whoChip4: string;
  whoCardTitle: string; whoCardText: string;
  acceptKicker: string; acceptH2: string;
  respKicker: string; respH2: string;
  respAgentTitle: string; respPlatformTitle: string;
  platformProvide1: string; platformProvide2: string; platformProvide3: string;
  platformProvide4: string; platformProvide5: string; platformProvide6: string;
  stepsH2: string; stepsLead: string;
  legalH2: string; legalLead: string;
}

const AR: AgentExtra = {
  heroGold: "حوّل علاقاتك إلى فرص استثمارية منظّمة",
  stat1t: "أصول حقيقية", stat1s: "وليست أفكاراً عامة",
  stat2t: "عقد واضح", stat2s: "قبل أي صفة رسمية",
  stat3t: "حقوق محفوظة", stat3s: "وفق اتفاق مكتوب",
  stat4t: "عرض منظّم", stat4s: "للمستثمرين المناسبين",
  whoH2a: "ليس ناقل أرقام.",
  whoH2b: "بل صاحب علاقة موثوقة مع المالك.",
  whoChip1: "علاقة حقيقية مع المالك",
  whoChip2: "موافقة صاحب العلاقة",
  whoChip3: "معلومات أولية دقيقة",
  whoChip4: "التزام كامل بالسرّية",
  whoCardTitle: "العلاقة مع المالك هي رأس المال الحقيقي",
  whoCardText: "الفرصة التي لا تملك طريقاً حقيقياً لصاحبها غالباً ستضيّع وقت الجميع.",
  acceptKicker: "نطاق واسع من الفرص",
  acceptH2: "أمثلة على ما يمكن تقديمه عبر المنصة",
  respKicker: "وضوح الدور يحمي الجميع",
  respH2: "ما الذي يقدّمه الوكيل؟ وما الذي توفّره المنصة؟",
  respAgentTitle: "مسؤوليات الوكيل",
  respPlatformTitle: "ما توفّره بركة بارتنرز",
  platformProvide1: "مراجعة أولية للفرصة قبل عرضها.",
  platformProvide2: "تنظيم ملف الأصل أو المشروع بشكل مناسب للمستثمرين.",
  platformProvide3: "عرض الفرصة بطريقة تحمي البيانات الحساسة.",
  platformProvide4: "مطابقة الفرصة مع مستثمرين أو مشغّلين مناسبين.",
  platformProvide5: "حماية حقوق الوكيل وفق اتفاق مكتوب.",
  platformProvide6: "متابعة العلاقة من خلال حساب خاص داخل المنصة.",
  stepsH2: "من تسجيل الوكيل إلى عرض الأصل على المستثمرين",
  stepsLead: "لا يتم اعتماد الوكيل ولا عرض الأصول بشكل عشوائي. كل شيء يمرّ بمراجعة، وموافقة، وتوثيق.",
  legalH2: "لا تدخل هذه الصفحة بعقلية «خليني أجرّب»",
  legalLead: "إذا لم تكن لديك علاقة حقيقية مع صاحب الأصل، لا ترسل الطلب. الطلبات الضعيفة تضيّع وقتك ووقت الإدارة.",
};

const EN: AgentExtra = {
  heroGold: "Turn your relationships into organized investment opportunities",
  stat1t: "Real assets", stat1s: "not vague ideas",
  stat2t: "A clear contract", stat2s: "before any official capacity",
  stat3t: "Rights preserved", stat3s: "per a written agreement",
  stat4t: "Organized presentation", stat4s: "to the right investors",
  whoH2a: "Not a contact passer.",
  whoH2b: "But a trusted relationship with the owner.",
  whoChip1: "A real relationship with the owner",
  whoChip2: "The relevant party's consent",
  whoChip3: "Accurate initial information",
  whoChip4: "Full commitment to confidentiality",
  whoCardTitle: "The relationship with the owner is the real capital",
  whoCardText: "An opportunity with no real path to its owner usually wastes everyone's time.",
  acceptKicker: "A wide range of opportunities",
  acceptH2: "Examples of what can be submitted through the platform",
  respKicker: "Role clarity protects everyone",
  respH2: "What does the agent provide? And what does the platform offer?",
  respAgentTitle: "The agent's responsibilities",
  respPlatformTitle: "What Baraka Partners provides",
  platformProvide1: "An initial review of the opportunity before presenting it.",
  platformProvide2: "Organizing the asset or project file suitably for investors.",
  platformProvide3: "Presenting the opportunity in a way that protects sensitive data.",
  platformProvide4: "Matching the opportunity with suitable investors or operators.",
  platformProvide5: "Protecting the agent's rights per a written agreement.",
  platformProvide6: "Following up the relationship through a dedicated account on the platform.",
  stepsH2: "From agent registration to presenting the asset to investors",
  stepsLead: "Neither agents nor assets are approved at random. Everything goes through review, approval, and documentation.",
  legalH2: "Don't approach this page with a 'let me just try' mindset",
  legalLead: "If you don't have a real relationship with the asset owner, don't submit. Weak applications waste your time and ours.",
};

const TR: AgentExtra = {
  heroGold: "İlişkilerinizi düzenli yatırım fırsatlarına dönüştürün",
  stat1t: "Gerçek varlıklar", stat1s: "belirsiz fikirler değil",
  stat2t: "Net bir sözleşme", stat2s: "her türlü resmi sıfattan önce",
  stat3t: "Haklar korunur", stat3s: "yazılı bir anlaşmaya göre",
  stat4t: "Düzenli sunum", stat4s: "uygun yatırımcılara",
  whoH2a: "Numara aktaran biri değil.",
  whoH2b: "Sahiple güvenilir bir ilişkiye sahip biri.",
  whoChip1: "Sahiple gerçek bir ilişki",
  whoChip2: "İlgili tarafın onayı",
  whoChip3: "Doğru ön bilgi",
  whoChip4: "Gizliliğe tam bağlılık",
  whoCardTitle: "Sahiple ilişki, gerçek sermayedir",
  whoCardText: "Sahibine gerçek bir yolu olmayan fırsat, genelde herkesin vaktini boşa harcar.",
  acceptKicker: "Geniş bir fırsat yelpazesi",
  acceptH2: "Platform üzerinden sunulabileceklere örnekler",
  respKicker: "Rol netliği herkesi korur",
  respH2: "Temsilci ne sağlar? Platform ne sunar?",
  respAgentTitle: "Temsilcinin sorumlulukları",
  respPlatformTitle: "Baraka Partners'ın sağladıkları",
  platformProvide1: "Sunmadan önce fırsatın ön incelemesi.",
  platformProvide2: "Varlık veya proje dosyasını yatırımcılara uygun şekilde düzenleme.",
  platformProvide3: "Fırsatı hassas verileri koruyacak şekilde sunma.",
  platformProvide4: "Fırsatı uygun yatırımcı veya işletmecilerle eşleştirme.",
  platformProvide5: "Temsilcinin haklarını yazılı anlaşmaya göre koruma.",
  platformProvide6: "İlişkiyi platformdaki özel bir hesap üzerinden takip etme.",
  stepsH2: "Temsilci kaydından varlığın yatırımcılara sunulmasına",
  stepsLead: "Ne temsilciler ne de varlıklar rastgele onaylanır. Her şey inceleme, onay ve belgelemeden geçer.",
  legalH2: "Bu sayfaya 'bir deneyeyim' düşüncesiyle yaklaşmayın",
  legalLead: "Varlık sahibiyle gerçek bir ilişkiniz yoksa başvurmayın. Zayıf başvurular hem sizin hem de yönetimin vaktini harcar.",
};

export const AGENT_X: Record<Locale, AgentExtra> = { ar: AR, en: EN, tr: TR, zh: EN };

export function agentX(locale: Locale): AgentExtra {
  return AGENT_X[locale] ?? EN;
}
