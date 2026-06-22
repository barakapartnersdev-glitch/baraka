// بذور قوالب المراسلة الداخلية في InternalMessageTemplate (قابلة للتحرير من الإدارة).
// التشغيل: node prisma/seed-internal-templates.mjs
// آمن لإعادة التشغيل: لا يستبدل تعديلات الإدارة (update فارغ).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// [category, { lang: [subject, body] }]
const T = {
  welcome: ["general", {
    ar: ["أهلاً بك في عهد البركة", "مرحباً {{fullName}}،\nيسعدنا انضمامك. نحن هنا لدعمك في كل خطوة، ويمكنك مراسلتنا في أي وقت عبر هذا الصندوق."],
    en: ["Welcome to Ahd Al-Baraka", "Hello {{fullName}},\nWe are glad to have you with us. We are here to support you at every step, and you can message us anytime through this inbox."],
    tr: ["Ahd Al-Baraka'ya hoş geldiniz", "Merhaba {{fullName}},\nAramıza katıldığınız için mutluyuz. Her adımda yanınızdayız; bu kutudan istediğiniz zaman bize yazabilirsiniz."],
    zh: ["欢迎加入 Ahd Al-Baraka", "您好 {{fullName}}，\n很高兴您的加入。我们将在每一步为您提供支持，您可以随时通过此收件箱与我们联系。"],
  }],
  document_request: ["documents", {
    ar: ["طلب مستندات", "مرحباً {{fullName}}،\nنحتاج منك تزويدنا ببعض المستندات لاستكمال ملفك. يرجى الرد على هذه الرسالة بالمستندات المطلوبة في أقرب وقت."],
    en: ["Document request", "Hello {{fullName}},\nWe need a few documents from you to complete your file. Please reply to this message with the requested documents at your earliest convenience."],
    tr: ["Belge talebi", "Merhaba {{fullName}},\nDosyanızı tamamlamak için sizden birkaç belgeye ihtiyacımız var. Lütfen istenen belgelerle bu mesajı en kısa sürede yanıtlayın."],
    zh: ["文件请求", "您好 {{fullName}}，\n为完善您的档案，我们需要您提供一些文件。请尽快回复本消息并附上所需文件。"],
  }],
  contract_followup: ["contract", {
    ar: ["متابعة بخصوص العقد", "مرحباً {{fullName}}،\nنود متابعة موضوع العقد معك. يرجى إعلامنا بأي استفسار أو ملاحظة لديك لنكمل الخطوات اللازمة."],
    en: ["Contract follow-up", "Hello {{fullName}},\nWe would like to follow up regarding your contract. Please let us know of any questions or notes so we can proceed with the next steps."],
    tr: ["Sözleşme takibi", "Merhaba {{fullName}},\nSözleşmenizle ilgili takip etmek istiyoruz. Sonraki adımlara geçebilmemiz için soru veya notlarınızı bize bildirin."],
    zh: ["合同跟进", "您好 {{fullName}}，\n我们希望跟进您的合同事宜。如有任何疑问或意见，请告知我们，以便继续后续步骤。"],
  }],
  meeting_invite: ["meeting", {
    ar: ["دعوة لاجتماع", "مرحباً {{fullName}}،\nنرغب بترتيب اجتماع معك لمناقشة التفاصيل. يرجى اقتراح وقت مناسب لك وسنؤكّد الموعد."],
    en: ["Meeting invitation", "Hello {{fullName}},\nWe would like to arrange a meeting to discuss the details. Please suggest a convenient time and we will confirm."],
    tr: ["Toplantı daveti", "Merhaba {{fullName}},\nDetayları görüşmek için sizinle bir toplantı ayarlamak istiyoruz. Lütfen uygun bir zaman önerin, onaylayalım."],
    zh: ["会议邀请", "您好 {{fullName}}，\n我们希望安排一次会议讨论细节。请提出方便的时间，我们将予以确认。"],
  }],
  general_notice: ["notice", {
    ar: ["إشعار من الإدارة", "مرحباً {{fullName}}،\nنود إعلامك بالتالي:\n"],
    en: ["Notice from management", "Hello {{fullName}},\nWe would like to inform you of the following:\n"],
    tr: ["Yönetimden bildirim", "Merhaba {{fullName}},\nAşağıdaki konuda sizi bilgilendirmek isteriz:\n"],
    zh: ["管理层通知", "您好 {{fullName}}，\n谨此通知您以下事项：\n"],
  }],
};

async function main() {
  let n = 0;
  for (const [key, [category, langs]] of Object.entries(T)) {
    for (const [lang, [subject, body]] of Object.entries(langs)) {
      await prisma.internalMessageTemplate.upsert({
        where: { templateKey_languageCode: { templateKey: key, languageCode: lang } },
        update: {}, // لا نستبدل تعديلات الإدارة عند إعادة التشغيل
        create: { templateKey: key, category, languageCode: lang, subject, body, isActive: true },
      });
      n++;
    }
  }
  console.log(`✓ ensured ${n} internal message templates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
