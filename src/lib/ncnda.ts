// نص اتفاقية عدم الإفصاح وعدم الالتفاف (NCNDA) وتوليد نسخة HTML موقّعة قابلة للحفظ والطباعة.
// النص أدناه مبدئي — استبدله بالنص القانوني المعتمد عند توفّره (عدّل NCNDA_CLAUSES و NCNDA_VERSION).
// وحدة خالصة بلا اعتماديات خادم لتكون قابلة للاستيراد في الواجهة والخادم معاً.

export const NCNDA_VERSION = "v1-2026-06";

export const NCNDA_CLAUSES: string[] = [
  "تُبرَم هذه الاتفاقية بين «شركاء البركة» (التي تديرها عهد البركة) بصفتها الوسيط والطرف المُفصِح، والطرف الموقّع أدناه بصفته المتلقّي للمعلومات.",
  "تشمل المعلومات السرّية كل ما يُتاح للمتلقّي عبر المنصة بشأن الفرصة الاستثمارية محل الاهتمام، بما في ذلك البيانات المالية والتشغيلية والمستندات وهوية الأطراف ومواقعها، سواء أُتيحت كتابةً أو شفهيّاً أو إلكترونيّاً.",
  "يلتزم المتلقّي بالحفاظ على سرّية هذه المعلومات وعدم إفشائها لأي طرف ثالث، وبعدم استخدامها لأي غرض سوى تقييم الفرصة محل الاهتمام.",
  "يلتزم المتلقّي بعدم الالتفاف على المنصة أو التواصل المباشر مع صاحب المشروع أو أي طرف ذي صلة بقصد إتمام صفقة خارج المنصة أو تجاوز دورها، طوال مدة الاتفاقية.",
  "تبقى هوية صاحب المشروع وموقعه الدقيق محجوبة ما لم يصدر إفصاح صريح من إدارة المنصة.",
  "تسري التزامات السرّية لمدة ثلاث (٣) سنوات من تاريخ التوقيع، أو حتى تصبح المعلومات علنيّة دون إخلال من المتلقّي، أيّهما أسبق.",
  "يقرّ المتلقّي بأن التوقيع الإلكتروني عبر المنصة مُلزِم وبمنزلة التوقيع الخطّي.",
  "يخضع تفسير هذه الاتفاقية وأي نزاع ينشأ عنها للأنظمة المعمول بها، وتختص بنظره الجهة القضائية المتّفق عليها بين الطرفين.",
];

export interface NcndaDocParams {
  signerName: string;
  opportunityRef: string;
  signedAt: Date;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// يولّد نسخة HTML كاملة (RTL) من الاتفاقية الموقّعة — تُخزَّن كما هي كأثر دائم.
export function buildNcndaHtml(params: NcndaDocParams): string {
  const date = params.signedAt.toLocaleString("ar", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const clauses = NCNDA_CLAUSES.map((c) => `<li>${escapeHtml(c)}</li>`).join(
    "\n      "
  );
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>اتفاقية NCNDA — شركاء البركة</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Tajawal', system-ui, sans-serif; color: #1a1a1a; line-height: 1.9; max-width: 800px; margin: 32px auto; padding: 0 24px; }
  .head { text-align: center; border-bottom: 2px solid #0F6E56; padding-bottom: 16px; margin-bottom: 24px; }
  .brand { color: #0F6E56; font-weight: 700; font-size: 20px; }
  h1 { font-size: 22px; margin: 16px 0 4px; }
  .meta { color: #555; font-size: 14px; }
  ol { padding-inline-start: 20px; }
  li { margin-bottom: 12px; }
  .sign { margin-top: 32px; border-top: 1px dashed #bbb; padding-top: 16px; font-size: 15px; }
  .sign .row { margin-bottom: 6px; }
  .label { color: #555; }
  .val { font-weight: 700; }
  .foot { margin-top: 28px; color: #888; font-size: 12px; text-align: center; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <div class="head">
    <div class="brand">شركاء البركة</div>
    <h1>اتفاقية عدم الإفصاح وعدم الالتفاف (NCNDA)</h1>
    <div class="meta">المرجع: ${escapeHtml(params.opportunityRef)} — النسخة: ${NCNDA_VERSION}</div>
  </div>
  <ol>
      ${clauses}
  </ol>
  <div class="sign">
    <div class="row"><span class="label">الموقّع:</span> <span class="val">${escapeHtml(params.signerName)}</span></div>
    <div class="row"><span class="label">تاريخ التوقيع:</span> <span class="val">${escapeHtml(date)}</span></div>
    <div class="row"><span class="label">طريقة التوقيع:</span> توقيع إلكتروني عبر منصة شركاء البركة</div>
  </div>
  <div class="foot">نسخة محفوظة من الاتفاقية الموقّعة إلكترونيّاً. للطباعة كـ PDF استخدم خاصية الطباعة في المتصفح.</div>
</body>
</html>`;
}
