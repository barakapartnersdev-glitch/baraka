// عرض الفرصة الاستثمارية بتصميم فاخر (كحلي/ذهبي) مدفوع ببيانات الفرصة الحقيقية.
// مكوّن خادم: يستقبل البيانات المترجمة + شرائح (نموذج الاهتمام، زر المشاركة) ويبنيها.
import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { dir as dirOf } from "@/lib/i18n";
import styles from "./OpportunityShowcase.module.css";

export interface ShowcaseData {
  title: string;
  summary?: string;
  details?: string;
  highlights?: string;
  imageUrl?: string | null;
  gallery?: string[];
  galleryIllustrative?: boolean; // الصور تعبيرية للقطاع (لا تخص المشروع الفعلي)
  sector: string;
  country: string;
  city?: string | null;
  range?: string | null;
  annualReturn?: string;
  paybackPeriod?: string;
}

type L = {
  sector: string;
  country: string;
  city: string;
  investmentSize: string;
  annualReturn: string;
  paybackPeriod: string;
  whyTitle: string;
  whyNote: string;
  financialTitle: string;
  financialNote: string;
  detailsTitle: string;
  galleryTitle: string;
  galleryIllustrativeNote: string;
  notesTitle: string;
  disclaimers: string[];
  ctaTitle: string;
  ctaDesc: string;
  interestBtn: string;
  back: string;
};

const LABELS: Record<Locale, L> = {
  ar: {
    sector: "القطاع",
    country: "الدولة",
    city: "المدينة",
    investmentSize: "حجم الاستثمار",
    annualReturn: "العائد السنوي المتوقع",
    paybackPeriod: "فترة الاسترداد المتوقعة",
    whyTitle: "لماذا هذه الفرصة؟",
    whyNote: "أبرز النقاط التي تميّز هذه الفرصة",
    financialTitle: "الملخص الاستثماري",
    financialNote: "أرقام أولية قبل العناية الواجبة",
    detailsTitle: "تفاصيل إضافية",
    galleryTitle: "صور توضيحية",
    galleryIllustrativeNote: "صور تعبيرية للقطاع — ليست للمشروع الفعلي",
    notesTitle: "ملاحظات مهمة",
    disclaimers: [
      "المعلومات الواردة في هذه الصفحة لأغراض تعريفية أولية، وقابلة للتحديث بعد استكمال الدراسات.",
      "لا تشكّل هذه الصفحة عرضاً ملزماً أو دعوة نهائية للاستثمار، ويجب إجراء العناية الواجبة قبل أي قرار.",
      "التفاصيل الحساسة والمواقع الدقيقة وبيانات الأطراف تُكشف للمستثمر المعتمد بعد توقيع اتفاقية عدم الإفصاح.",
    ],
    ctaTitle: "لنناقش كيف يمكن أن تكون جزءاً من هذه الفرصة",
    ctaDesc: "فريق شركاء البركة جاهز للإجابة على استفساراتك وتزويدك بالتفاصيل حسب مستوى الاعتماد والسرية.",
    interestBtn: "أنا مهتم بهذه الفرصة",
    back: "→ كل الفرص",
  },
  en: {
    sector: "Sector",
    country: "Country",
    city: "City",
    investmentSize: "Investment size",
    annualReturn: "Expected annual return",
    paybackPeriod: "Expected payback period",
    whyTitle: "Why this opportunity?",
    whyNote: "The points that set this opportunity apart",
    financialTitle: "Investment highlights",
    financialNote: "Preliminary figures before due diligence",
    detailsTitle: "Additional details",
    galleryTitle: "Gallery",
    galleryIllustrativeNote: "Representative sector imagery — not the actual project",
    notesTitle: "Important notes",
    disclaimers: [
      "The information on this page is preliminary and indicative, and may be updated after studies are completed.",
      "This page is not a binding offer or a final invitation to invest; due diligence is required before any decision.",
      "Sensitive details, exact locations and party data are disclosed to approved investors after a non-disclosure agreement.",
    ],
    ctaTitle: "Let's discuss how you can be part of this opportunity",
    ctaDesc: "The Baraka Partners team is ready to answer your questions and share details according to your approval and confidentiality level.",
    interestBtn: "I'm interested in this opportunity",
    back: "← All opportunities",
  },
  tr: {
    sector: "Sektör",
    country: "Ülke",
    city: "Şehir",
    investmentSize: "Yatırım büyüklüğü",
    annualReturn: "Beklenen yıllık getiri",
    paybackPeriod: "Beklenen geri ödeme süresi",
    whyTitle: "Neden bu fırsat?",
    whyNote: "Bu fırsatı öne çıkaran noktalar",
    financialTitle: "Yatırım özeti",
    financialNote: "Durum tespitinden önce ön rakamlar",
    detailsTitle: "Ek ayrıntılar",
    galleryTitle: "Görseller",
    galleryIllustrativeNote: "Sektörü temsil eden görseller — asıl proje değildir",
    notesTitle: "Önemli notlar",
    disclaimers: [
      "Bu sayfadaki bilgiler ön niteliktedir ve çalışmalar tamamlandıktan sonra güncellenebilir.",
      "Bu sayfa bağlayıcı bir teklif veya nihai bir yatırım daveti değildir; herhangi bir karardan önce durum tespiti gereklidir.",
      "Hassas ayrıntılar, kesin konumlar ve taraf bilgileri, gizlilik sözleşmesinden sonra onaylı yatırımcıya açıklanır.",
    ],
    ctaTitle: "Bu fırsatın parçası olmanı konuşalım",
    ctaDesc: "Baraka Partners ekibi sorularını yanıtlamaya ve onay ile gizlilik seviyene göre ayrıntıları paylaşmaya hazır.",
    interestBtn: "Bu fırsatla ilgileniyorum",
    back: "← Tüm fırsatlar",
  },
  zh: {
    sector: "行业",
    country: "国家",
    city: "城市",
    investmentSize: "投资规模",
    annualReturn: "预期年回报率",
    paybackPeriod: "预期回本周期",
    whyTitle: "为何选择此机会？",
    whyNote: "让此机会脱颖而出的要点",
    financialTitle: "投资概要",
    financialNote: "尽职调查前的初步数据",
    detailsTitle: "更多详情",
    galleryTitle: "示意图片",
    galleryIllustrativeNote: "代表行业的示意图片 — 并非实际项目",
    notesTitle: "重要提示",
    disclaimers: [
      "本页信息为初步及介绍性内容，研究完成后可能更新。",
      "本页不构成具有约束力的要约或最终投资邀请；任何决定前均须进行尽职调查。",
      "敏感细节、确切位置及各方数据将在签署保密协议后向经批准的投资者披露。",
    ],
    ctaTitle: "让我们探讨您如何参与这一机会",
    ctaDesc: "Baraka Partners 团队随时为您解答疑问，并根据您的审批与保密级别提供详情。",
    interestBtn: "我对此机会感兴趣",
    back: "← 所有机会",
  },
};

function lines(s?: string): string[] {
  if (!s) return [];
  return s
    .split("\n")
    .map((x) => x.replace(/^[-•*·\s]+/, "").trim())
    .filter(Boolean);
}

export default function OpportunityShowcase({
  locale,
  data,
  backHref,
  shareSlot,
  leadSlot,
}: {
  locale: Locale;
  data: ShowcaseData;
  backHref: string;
  shareSlot?: ReactNode;
  leadSlot?: ReactNode;
}) {
  const L = LABELS[locale] ?? LABELS.ar;
  const dir = dirOf(locale);

  const chips = [data.sector, data.country, data.city].filter(Boolean) as string[];

  const metrics: { icon: string; label: string; value: string }[] = [
    { icon: "🏷️", label: L.sector, value: data.sector },
    { icon: "🌍", label: L.country, value: data.country },
    ...(data.city ? [{ icon: "📍", label: L.city, value: data.city }] : []),
  ];

  const finance: { label: string; value: string }[] = [
    ...(data.range ? [{ label: L.investmentSize, value: data.range }] : []),
    ...(data.annualReturn ? [{ label: L.annualReturn, value: data.annualReturn }] : []),
    ...(data.paybackPeriod ? [{ label: L.paybackPeriod, value: data.paybackPeriod }] : []),
  ];

  const features = lines(data.highlights);
  const gallery = (data.gallery ?? []).filter(Boolean);

  const heroBg = data.imageUrl
    ? `url(${data.imageUrl})`
    : "linear-gradient(135deg, #13315e, #0a1f3c)";

  return (
    <div className={styles.showcase} dir={dir}>
      <div className={styles.wrap}>
        <div className={styles.utility}>
          <Link href={backHref} className={styles.back}>
            {L.back}
          </Link>
          {shareSlot}
        </div>

        <div className={styles.layout}>
          <div className={styles.content}>
            {/* البطل */}
            <section className={styles.hero}>
              <div className={styles.heroMedia} style={{ backgroundImage: heroBg }} />
              <div className={styles.heroOverlay} />
              <div className={styles.heroBody}>
                {chips.length > 0 && (
                  <div className={styles.chips}>
                    {chips.map((c, i) => (
                      <span key={i} className={styles.chip}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className={styles.heroTitle}>{data.title}</h1>
                {data.summary && <p className={styles.heroSummary}>{data.summary}</p>}
                <div className={styles.heroActions}>
                  <a className={styles.btnPrimary} href="#interest">
                    {L.interestBtn}
                  </a>
                </div>
              </div>
            </section>

            {/* شريط المؤشّرات */}
            <section className={styles.metricStrip}>
              {metrics.map((m, i) => (
                <div key={i} className={styles.metric}>
                  <span className={styles.metricIcon}>{m.icon}</span>
                  <span className={styles.metricLabel}>{m.label}</span>
                  <span className={styles.metricValue}>{m.value}</span>
                </div>
              ))}
            </section>

            {/* الملخص المالي */}
            {finance.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>{L.financialTitle}</h2>
                  <span className={styles.sectionNote}>{L.financialNote}</span>
                </div>
                <div className={styles.finance}>
                  {finance.map((f, i) => (
                    <div key={i} className={styles.financeCard}>
                      <div className={styles.financeLabel}>{f.label}</div>
                      <div className={styles.financeNum}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* لماذا هذه الفرصة */}
            {features.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>{L.whyTitle}</h2>
                  <span className={styles.sectionNote}>{L.whyNote}</span>
                </div>
                <div className={styles.features}>
                  {features.map((f, i) => (
                    <article key={i} className={styles.featureCard}>
                      <span className={styles.featureCheck}>✓</span>
                      <p className={styles.featureText}>{f}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* تفاصيل إضافية */}
            {data.details && (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>{L.detailsTitle}</h2>
                </div>
                <div className={styles.prose}>{data.details}</div>
              </section>
            )}

            {/* المعرض — صور الفرصة أو صور تعبيرية للقطاع */}
            {gallery.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>{L.galleryTitle}</h2>
                  {data.galleryIllustrative && (
                    <span className={styles.sectionNote}>{L.galleryIllustrativeNote}</span>
                  )}
                </div>
                <div className={styles.gallery}>
                  {gallery.map((src, i) => (
                    <div
                      key={i}
                      className={styles.galleryItem}
                      style={{ backgroundImage: `url(${src})` }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ملاحظات */}
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>{L.notesTitle}</h2>
              </div>
              <div className={styles.disclosure}>
                <ul>
                  {L.disclaimers.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* دعوة للتواصل */}
            <section className={styles.ctaBand} id="interest">
              <div>
                <h2>{L.ctaTitle}</h2>
                <p>{L.ctaDesc}</p>
              </div>
              <a className={styles.btnPrimary} href="#lead-form">
                {L.interestBtn}
              </a>
            </section>
          </div>

          {/* الشريط الجانبي: نموذج الاهتمام */}
          <aside className={styles.sidebar} id="lead-form">
            {leadSlot}
          </aside>
        </div>
      </div>
    </div>
  );
}
