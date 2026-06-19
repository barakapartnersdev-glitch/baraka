// بذر قوالب ردود الـ CRM بأربع لغات (ar/en/tr/zh) — المرحلة الثانية §11 + ملحق اللغات.
// آمن للتكرار (upsert على [templateKey, languageCode]). تشغيل: node prisma/seed-crm-templates.mjs
// يملأ جدول CrmEmailTemplate بقوالب جاهزة يعدّلها الأدمن لاحقاً ويستخدمها زر «نسخ الرد».
import { readFileSync } from "node:fs";

// تحميل .env يدويّاً (العميل لا يحمّلها وحده عند التشغيل المباشر)
for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

// كل قالب: نوعه + النسخ الأربع {subject, body}. العناصر النائبة: {{name}} {{opportunity}}
const TEMPLATES = {
  investor_initial_reply: {
    type: "investor",
    ar: { subject: "شكراً لاهتمامك بالفرصة — شركاء البركة", body: "مرحباً {{name}}،\n\nشكراً لاهتمامك بفرصة {{opportunity}}. تسلّمنا طلبك وسيتواصل معك أحد مستشاري العلاقات الاستثمارية قريباً لمناقشة التفاصيل والخطوات التالية.\n\nمع التحية،\nفريق شركاء البركة" },
    en: { subject: "Thank you for your interest — Baraka Partners", body: "Hello {{name}},\n\nThank you for your interest in {{opportunity}}. We have received your request, and one of our investor relations advisors will contact you shortly to discuss the details and next steps.\n\nBest regards,\nThe Baraka Partners team" },
    tr: { subject: "İlginiz için teşekkürler — Baraka Partners", body: "Merhaba {{name}},\n\n{{opportunity}} fırsatına gösterdiğiniz ilgi için teşekkür ederiz. Talebinizi aldık; yatırımcı ilişkileri danışmanlarımızdan biri ayrıntıları ve sonraki adımları görüşmek için kısa süre içinde sizinle iletişime geçecek.\n\nSaygılarımızla,\nBaraka Partners ekibi" },
    zh: { subject: "感谢您的关注 — Baraka Partners", body: "您好 {{name}}，\n\n感谢您对 {{opportunity}} 的关注。我们已收到您的请求，我们的投资者关系顾问将很快与您联系，讨论细节和后续步骤。\n\n此致，\nBaraka Partners 团队" },
  },
  investor_request_info: {
    type: "investor",
    ar: { subject: "نحتاج بعض المعلومات لإكمال طلبك", body: "مرحباً {{name}}،\n\nلمتابعة اهتمامك بفرصة {{opportunity}}، نحتاج بعض المعلومات الإضافية: حجم الاستثمار المتوقّع، القطاعات المفضّلة، والجدول الزمني للاستثمار. يسعدنا أن ترسلها لنا في ردّك.\n\nمع التحية،\nفريق شركاء البركة" },
    en: { subject: "A few details to proceed with your request", body: "Hello {{name}},\n\nTo proceed with your interest in {{opportunity}}, we need a few additional details: your expected investment size, preferred sectors, and investment timeline. Please share them in your reply.\n\nBest regards,\nThe Baraka Partners team" },
    tr: { subject: "Talebinizi ilerletmek için birkaç bilgi", body: "Merhaba {{name}},\n\n{{opportunity}} ile ilgilenmenizi ilerletmek için birkaç ek bilgiye ihtiyacımız var: beklenen yatırım büyüklüğü, tercih edilen sektörler ve yatırım zaman çizelgesi. Lütfen yanıtınızda paylaşın.\n\nSaygılarımızla,\nBaraka Partners ekibi" },
    zh: { subject: "为推进您的请求需要一些信息", body: "您好 {{name}}，\n\n为推进您对 {{opportunity}} 的意向，我们需要一些补充信息：您的预期投资规模、偏好行业以及投资时间安排。请在回复中提供。\n\n此致，\nBaraka Partners 团队" },
  },
  investor_send_file: {
    type: "investor",
    ar: { subject: "ملف الفرصة الاستثمارية — {{opportunity}}", body: "مرحباً {{name}}،\n\nنرفق لك ملف فرصة {{opportunity}}. نأمل الاطّلاع عليه، ويسعدنا الإجابة عن أي استفسار أو ترتيب مكالمة لمناقشته.\n\nمع التحية،\nفريق شركاء البركة" },
    en: { subject: "Opportunity file — {{opportunity}}", body: "Hello {{name}},\n\nPlease find attached the file for {{opportunity}}. We hope you find it useful and would be glad to answer any questions or arrange a call to discuss it.\n\nBest regards,\nThe Baraka Partners team" },
    tr: { subject: "Fırsat dosyası — {{opportunity}}", body: "Merhaba {{name}},\n\n{{opportunity}} fırsatına ait dosyayı ekte bulabilirsiniz. Faydalı olmasını umar, sorularınızı yanıtlamaktan veya görüşmek için bir arama ayarlamaktan memnuniyet duyarız.\n\nSaygılarımızla,\nBaraka Partners ekibi" },
    zh: { subject: "投资机会资料 — {{opportunity}}", body: "您好 {{name}}，\n\n随附 {{opportunity}} 的资料文件。希望对您有帮助，我们很乐意解答任何问题或安排通话进一步讨论。\n\n此致，\nBaraka Partners 团队" },
  },
  nda_request: {
    type: "investor",
    ar: { subject: "توقيع اتفاقية عدم الإفصاح (NDA/NCNDA)", body: "مرحباً {{name}}،\n\nقبل مشاركة التفاصيل الكاملة لفرصة {{opportunity}}، يلزم توقيع اتفاقية عدم الإفصاح وعدم الالتفاف (NCNDA) لحماية الطرفين. نرسل لك الاتفاقية للتوقيع، وبعدها تُفتح لك التفاصيل الكاملة.\n\nمع التحية،\nفريق شركاء البركة" },
    en: { subject: "Sign the Non-Disclosure Agreement (NDA/NCNDA)", body: "Hello {{name}},\n\nBefore sharing the full details of {{opportunity}}, a Non-Disclosure & Non-Circumvention Agreement (NCNDA) must be signed to protect both parties. We are sending it for your signature; the full details unlock afterwards.\n\nBest regards,\nThe Baraka Partners team" },
    tr: { subject: "Gizlilik Sözleşmesini imzalayın (NDA/NCNDA)", body: "Merhaba {{name}},\n\n{{opportunity}} fırsatının tüm ayrıntılarını paylaşmadan önce, her iki tarafı korumak için bir Gizlilik ve Dolanmama Sözleşmesi (NCNDA) imzalanmalıdır. Sözleşmeyi imzanız için gönderiyoruz; ardından tüm ayrıntılar açılır.\n\nSaygılarımızla,\nBaraka Partners ekibi" },
    zh: { subject: "签署保密协议（NDA/NCNDA）", body: "您好 {{name}}，\n\n在分享 {{opportunity}} 的完整细节之前，需要签署一份保密及不规避协议（NCNDA）以保护双方。我们将协议发送给您签署，签署后即可解锁完整细节。\n\n此致，\nBaraka Partners 团队" },
  },
  owner_initial_reply: {
    type: "owner",
    ar: { subject: "تسلّمنا فرصتك الاستثمارية — شركاء البركة", body: "مرحباً {{name}}،\n\nشكراً لتقديمك فرصتك الاستثمارية إلى شركاء البركة. تسلّمنا طلبك وسيبدأ فريق المراجعة بدراسته، وسنعود إليك بالخطوات التالية أو بأي معلومات نحتاجها.\n\nمع التحية،\nفريق شركاء البركة" },
    en: { subject: "We received your opportunity — Baraka Partners", body: "Hello {{name}},\n\nThank you for submitting your investment opportunity to Baraka Partners. We have received it, our review team will begin assessing it, and we will get back to you with next steps or any information we need.\n\nBest regards,\nThe Baraka Partners team" },
    tr: { subject: "Fırsatınızı aldık — Baraka Partners", body: "Merhaba {{name}},\n\nYatırım fırsatınızı Baraka Partners'a sunduğunuz için teşekkür ederiz. Başvurunuzu aldık; inceleme ekibimiz değerlendirmeye başlayacak ve sonraki adımlar ya da ihtiyaç duyduğumuz bilgilerle size döneceğiz.\n\nSaygılarımızla,\nBaraka Partners ekibi" },
    zh: { subject: "我们已收到您的项目 — Baraka Partners", body: "您好 {{name}}，\n\n感谢您向 Baraka Partners 提交投资机会。我们已收到，审核团队将开始评估，并就后续步骤或所需信息与您联系。\n\n此致，\nBaraka Partners 团队" },
  },
  owner_request_docs: {
    type: "owner",
    ar: { subject: "طلب وثائق لاستكمال مراجعة فرصتك", body: "مرحباً {{name}}،\n\nلاستكمال مراجعة فرصتك، نحتاج بعض الوثائق: دراسة الجدوى (إن وُجدت)، وثائق الملكية أو الترخيص، وأي بيانات مالية متاحة. يمكنك إرسالها رداً على هذا البريد.\n\nمع التحية،\nفريق شركاء البركة" },
    en: { subject: "Documents needed to complete your review", body: "Hello {{name}},\n\nTo complete the review of your opportunity, we need some documents: the feasibility study (if available), ownership or licensing documents, and any available financials. You may send them in reply to this email.\n\nBest regards,\nThe Baraka Partners team" },
    tr: { subject: "İncelemeyi tamamlamak için belgeler gerekli", body: "Merhaba {{name}},\n\nFırsatınızın incelemesini tamamlamak için bazı belgelere ihtiyacımız var: fizibilite çalışması (varsa), mülkiyet veya lisans belgeleri ve mevcut mali veriler. Bu e-postaya yanıt olarak gönderebilirsiniz.\n\nSaygılarımızla,\nBaraka Partners ekibi" },
    zh: { subject: "需要文件以完成对您项目的审核", body: "您好 {{name}}，\n\n为完成对您项目的审核，我们需要一些文件：可行性研究（如有）、所有权或许可证文件，以及任何可提供的财务资料。您可回复此邮件发送。\n\n此致，\nBaraka Partners 团队" },
  },
  opportunity_reject: {
    type: "owner",
    ar: { subject: "بخصوص فرصتك المقدّمة إلى شركاء البركة", body: "مرحباً {{name}}،\n\nشكراً لثقتك بشركاء البركة. بعد دراسة فرصتك بعناية، نعتذر عن عدم إمكانية المضي بها في الوقت الحالي لعدم توافقها مع معايير منصّتنا الحالية. نقدّر تفهّمك ونرحّب بفرصك المستقبلية.\n\nمع التحية،\nفريق شركاء البركة" },
    en: { subject: "Regarding the opportunity you submitted", body: "Hello {{name}},\n\nThank you for trusting Baraka Partners. After carefully reviewing your opportunity, we regret that we are unable to proceed with it at this time as it does not align with our platform's current criteria. We appreciate your understanding and welcome your future opportunities.\n\nBest regards,\nThe Baraka Partners team" },
    tr: { subject: "Sunduğunuz fırsat hakkında", body: "Merhaba {{name}},\n\nBaraka Partners'a duyduğunuz güven için teşekkür ederiz. Fırsatınızı dikkatle inceledikten sonra, mevcut platform kriterlerimizle örtüşmediği için şu anda ilerleyemediğimiz için üzgünüz. Anlayışınız için teşekkür eder, gelecekteki fırsatlarınızı bekleriz.\n\nSaygılarımızla,\nBaraka Partners ekibi" },
    zh: { subject: "关于您提交的项目", body: "您好 {{name}}，\n\n感谢您对 Baraka Partners 的信任。在仔细审核您的项目后，由于其与我们平台当前的标准不符，很遗憾目前无法继续推进。感谢您的理解，欢迎您未来再次提交项目。\n\n此致，\nBaraka Partners 团队" },
  },
  arrange_meeting: {
    type: "general",
    ar: { subject: "ترتيب اجتماع لمناقشة {{opportunity}}", body: "مرحباً {{name}}،\n\nيسعدنا ترتيب اجتماع لمناقشة {{opportunity}}. هل يناسبك اجتماع أونلاين هذا الأسبوع؟ أرسل لنا وقتين مناسبين وسنؤكّد الموعد ورابط الاجتماع.\n\nمع التحية،\nفريق شركاء البركة" },
    en: { subject: "Arranging a meeting to discuss {{opportunity}}", body: "Hello {{name}},\n\nWe would be glad to arrange a meeting to discuss {{opportunity}}. Would an online meeting this week suit you? Send us two convenient times and we will confirm the slot and the meeting link.\n\nBest regards,\nThe Baraka Partners team" },
    tr: { subject: "{{opportunity}} görüşmek için toplantı ayarlama", body: "Merhaba {{name}},\n\n{{opportunity}} konusunu görüşmek için bir toplantı ayarlamaktan memnuniyet duyarız. Bu hafta çevrimiçi bir toplantı sizin için uygun olur mu? İki uygun saat gönderin; zamanı ve toplantı bağlantısını teyit edelim.\n\nSaygılarımızla,\nBaraka Partners ekibi" },
    zh: { subject: "安排会议讨论 {{opportunity}}", body: "您好 {{name}}，\n\n我们很乐意安排会议讨论 {{opportunity}}。本周线上会议是否方便？请告知两个合适的时间，我们将确认时间并发送会议链接。\n\n此致，\nBaraka Partners 团队" },
  },
  followup_no_reply: {
    type: "general",
    ar: { subject: "متابعة بخصوص {{opportunity}}", body: "مرحباً {{name}}،\n\nنتابع معك بخصوص {{opportunity}}. ما زلنا مهتمّين بمساعدتك؛ إن كنت لا تزال مهتمّاً، يسعدنا معرفة الوقت المناسب للتواصل. وإن تغيّرت أولوياتك، أخبرنا لنحدّث سجلّك.\n\nمع التحية،\nفريق شركاء البركة" },
    en: { subject: "Following up regarding {{opportunity}}", body: "Hello {{name}},\n\nWe are following up regarding {{opportunity}}. We remain glad to help; if you are still interested, let us know a good time to connect. If your priorities have changed, just tell us so we can update your record.\n\nBest regards,\nThe Baraka Partners team" },
    tr: { subject: "{{opportunity}} ile ilgili takip", body: "Merhaba {{name}},\n\n{{opportunity}} konusunda sizi takip ediyoruz. Yardımcı olmaktan memnuniyet duyarız; hâlâ ilgileniyorsanız, görüşmek için uygun bir zaman bildirin. Öncelikleriniz değiştiyse, kaydınızı güncelleyebilmemiz için bize bildirin.\n\nSaygılarımızla,\nBaraka Partners ekibi" },
    zh: { subject: "关于 {{opportunity}} 的跟进", body: "您好 {{name}}，\n\n我们就 {{opportunity}} 与您跟进。我们仍很乐意提供帮助；若您仍有兴趣，请告知方便联系的时间。若您的优先事项有所变化，也请告知，以便我们更新您的记录。\n\n此致，\nBaraka Partners 团队" },
  },
  thank_you_ack: {
    type: "general",
    ar: { subject: "تم استلام طلبك — شركاء البركة", body: "مرحباً {{name}}،\n\nشكراً لتواصلك مع شركاء البركة. تم استلام طلبك بنجاح وسيراجعه فريقنا ويتواصل معك في أقرب وقت ممكن.\n\nمع التحية،\nفريق شركاء البركة" },
    en: { subject: "Your request was received — Baraka Partners", body: "Hello {{name}},\n\nThank you for contacting Baraka Partners. Your request has been received successfully; our team will review it and contact you as soon as possible.\n\nBest regards,\nThe Baraka Partners team" },
    tr: { subject: "Talebiniz alındı — Baraka Partners", body: "Merhaba {{name}},\n\nBaraka Partners ile iletişime geçtiğiniz için teşekkür ederiz. Talebiniz başarıyla alındı; ekibimiz inceleyip en kısa sürede sizinle iletişime geçecek.\n\nSaygılarımızla,\nBaraka Partners ekibi" },
    zh: { subject: "已收到您的请求 — Baraka Partners", body: "您好 {{name}}，\n\n感谢您联系 Baraka Partners。您的请求已成功收到；我们的团队将进行审核并尽快与您联系。\n\n此致，\nBaraka Partners 团队" },
  },
};

const LANGS = ["ar", "en", "tr", "zh"];

async function main() {
  let count = 0;
  for (const [templateKey, def] of Object.entries(TEMPLATES)) {
    for (const lang of LANGS) {
      const v = def[lang];
      await prisma.crmEmailTemplate.upsert({
        where: { templateKey_languageCode: { templateKey, languageCode: lang } },
        update: { subject: v.subject, body: v.body, templateType: def.type, isActive: true },
        create: {
          templateKey,
          languageCode: lang,
          templateType: def.type,
          subject: v.subject,
          body: v.body,
          isActive: true,
        },
      });
      count++;
    }
  }
  const total = await prisma.crmEmailTemplate.count();
  console.log(`✅ Seeded/updated ${count} CRM reply templates (${Object.keys(TEMPLATES).length} keys × ${LANGS.length} langs). Table total: ${total}.`);
}

main()
  .catch((e) => {
    console.error("❌ seed-crm-templates failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
