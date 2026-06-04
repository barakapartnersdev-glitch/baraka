# دليل النشر على Vercel — منصة شركاء البركة

استضافة على **Vercel** + قاعدة **Neon** + تخزين **Cloudflare R2** + بريد **Resend** + دومينك الحالي.

> ملاحظة: على Vercel لا يوجد قرص دائم، لذا **تخزين R2 إلزامي** لميزة الملفات/الوثائق وعلامة NCNDA المائية.

---

## 1) الحسابات التي تنشئها وما تجمعه

| المزوّد | الغرض | ما تجمعه | متغيّر البيئة |
|---|---|---|---|
| **Neon** (لديك غالباً) | قاعدة بيانات PostgreSQL | Connection String | `DATABASE_URL` |
| **GitHub** | مستودع يربطه Vercel | مستودع خاص بالمشروع | — |
| **Vercel** | استضافة التطبيق | — (تضبط المتغيّرات فقط) | — |
| **Cloudflare R2** | تخزين الملفات (S3) | Access Key, Secret, Bucket, Endpoint | `S3_*` |
| **Resend** | إرسال البريد | API Key + نطاق موثّق | `RESEND_API_KEY`, `EMAIL_FROM` |
| **مسجّل الدومين** | DNS | صلاحية لوحة DNS | `APP_BASE_URL` |
| (تولّده بنفسك) | سرّ الجلسة | سلسلة عشوائية 32+ حرف | `SESSION_SECRET` |

---

## 2) المستودع (GitHub)

1. ادفع المشروع إلى مستودع على GitHub. ✅ (تم الرفع إلى `barakapartnersdev-glitch/baraka`).
2. ✅ مجلّد `prisma/migrations/0_init` جاهز ومحفوظ في Git (تم عمل baseline للقاعدة الحالية). Vercel سيطبّق الهجرات تلقائياً عبر `vercel.json`.
3. ✅ `postinstall: prisma generate` موجود في `package.json` — يُولّد عميل Prisma على كل بناء.
4. ✅ `vercel.json` يضبط أمر البناء تلقائياً، فلا حاجة لتعديله يدوياً في لوحة Vercel.

---

## 3) قاعدة البيانات — Neon

1. من لوحة Neon افتح مشروعك ← **Connection string**.
2. انسخ سلسلتين:
   - **Pooled** (تحتوي `-pooler`) ← `DATABASE_URL` (اتصال زمن التشغيل على Vercel).
   - **Direct** (بدون `-pooler`) ← `DIRECT_URL` (يستخدمها `prisma migrate deploy` أثناء البناء).
3. تأكّد أن كلتيهما تنتهيان بـ `?sslmode=require`.

> لماذا اثنتان؟ بيئة Vercel بلا خوادم (serverless) تحتاج اتصالاً **مجمّعاً** لتفادي استنزاف اتصالات القاعدة، بينما الهجرات تحتاج اتصالاً **مباشراً**. المخطط معدّ لذلك عبر `url` + `directUrl`.

---

## 4) التخزين — Cloudflare R2 (إلزامي)

1. أنشئ حساب Cloudflare ← من القائمة **R2**.
2. **Create bucket** باسم مثل `baraka-files`.
3. **Manage R2 API Tokens** ← أنشئ Token بصلاحية **Object Read & Write** ← ستحصل على:
   - Access Key ID ← `S3_ACCESS_KEY_ID`
   - Secret Access Key ← `S3_SECRET_ACCESS_KEY`
4. Endpoint بصيغة: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` ← `S3_ENDPOINT`
   (تجد ACCOUNT_ID في صفحة R2.)
5. القيم الأخرى: `S3_BUCKET=baraka-files` ، `S3_REGION=auto`.

---

## 5) البريد — Resend

1. أنشئ حساب Resend ← **Domains** ← **Add Domain** وأدخل دومينك (`yourdomain.com`).
2. Resend سيعرض **سجلات DNS** (SPF/DKIM) — الصقها كما هي في لوحة DNS لدى مسجّل دومينك، وانتظر التحقّق (Verified).
3. **API Keys** ← Create ← `RESEND_API_KEY`.
4. `EMAIL_FROM` = `شركاء البركة <no-reply@yourdomain.com>` (يجب أن يكون النطاق هو الموثّق).

> بدون هذه الخطوة تعمل المنصة والإشعارات الداخلية، لكن لا يُرسَل بريد فعلي.

---

## 6) سرّ الجلسة

شغّل محليّاً وانسخ الناتج:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
← `SESSION_SECRET`

---

## 7) النشر على Vercel

1. [vercel.com](https://vercel.com) ← **Add New… → Project** ← استورد مستودع GitHub.
2. Framework Preset: **Next.js** (يُكتشف تلقائيّاً).
3. **Build Command** — اتركه كما هو؛ `vercel.json` يضبطه تلقائياً إلى:
   ```
   prisma generate && prisma migrate deploy && next build
   ```
4. **Environment Variables** ← أضف كل المتغيّرات من القسم (٩) أدناه.
5. اضغط **Deploy**.

---

## 8) ربط الدومين

1. Vercel ← Project ← **Settings → Domains** ← Add ← `yourdomain.com`.
2. Vercel يعرض **السجل المطلوب بالضبط** (سجل A للنطاق الجذر، أو CNAME للنطاق الفرعي مثل `app.yourdomain.com`).
3. أضِف ذلك السجل في لوحة DNS لدى مسجّل الدومين، وانتظر التحقّق.
4. اضبط `APP_BASE_URL` في متغيّرات Vercel على `https://yourdomain.com` (يُستخدم في روابط البريد).

---

## 9) متغيّرات البيئة (الصقها في Vercel)

```
DATABASE_URL=postgresql://...-pooler.neon.tech/...?sslmode=require
DIRECT_URL=postgresql://...neon.tech/...?sslmode=require
SESSION_SECRET=<سلسلة 32+ حرف>
APP_BASE_URL=https://yourdomain.com

S3_ACCESS_KEY_ID=<من R2>
S3_SECRET_ACCESS_KEY=<من R2>
S3_BUCKET=baraka-files
S3_REGION=auto
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com

RESEND_API_KEY=<من Resend>
EMAIL_FROM=شركاء البركة <no-reply@yourdomain.com>
```

---

## 10) أول حساب «إدارة» (مهم)

التسجيل الذاتي ينشئ **مستثمراً أو صاحب مشروع فقط** — لا مدير. لإنشاء أول مدير:

> ⚠️ ملف `prisma/seed.mjs` الحالي **يحذف كل البيانات** ثم يزرع بيانات تجريبية — لا تشغّله على الإنتاج كما هو.

يوجد سكربت آمن للإنتاج: `prisma/seed-admin.mjs` — ينشئ (أو يحدّث) **حساب المدير فقط** دون حذف أي بيانات، وآمن لإعادة التشغيل. مرّر بياناتك عبر متغيّرات البيئة:

```bash
# Linux/macOS أو بيئة Vercel
ADMIN_EMAIL=you@domain.com ADMIN_PASSWORD="سرّ-قوي-10-أحرف-فأكثر" ADMIN_NAME="اسمك" npm run db:seed:admin
```

```powershell
# على Windows / PowerShell
$env:ADMIN_EMAIL="you@domain.com"; $env:ADMIN_PASSWORD="سرّ-قوي"; $env:ADMIN_NAME="اسمك"; npm run db:seed:admin
```

شغّله مرّة واحدة مقابل قاعدة الإنتاج (تأكّد أن `DATABASE_URL` في بيئتك يشير إلى قاعدة الإنتاج). يتحقّق السكربت من صلاحية البريد وطول كلمة المرور (10 أحرف فأكثر) قبل لمس القاعدة.

---

## 11) التحقّق بعد النشر

1. افتح `https://yourdomain.com` ← الصفحة الرئيسية تظهر.
2. `/register` ← سجّل مستثمراً ← يصل المدير إشعار (+ بريد إن فُعّل).
3. ادخل كمدير ← `/admin/investors` ← اعتمد الحساب.
4. أنشئ فرصة (صاحب مشروع) ← الإدارة تصوغ النسخ وتنشر ← تظهر في `/opportunities` ببطاقتها.
5. ارفع وثيقة في فرصة ← تُخزَّن في R2 ← نزّلها (تظهر بعلامة مائية للمستثمر الموقّع).
6. جرّب زر تبديل اللغة (عربي/إنجليزي) في الرأس.

---

## ملخّص الإلزامي مقابل الاختياري

- **إلزامي للتشغيل:** Neon (`DATABASE_URL` + `DIRECT_URL`)، `SESSION_SECRET`، Vercel، الدومين.
- **إلزامي على Vercel لميزة الملفات:** Cloudflare R2 (`S3_*`).
- **اختياري (بريد فعلي):** Resend (`RESEND_API_KEY`, `EMAIL_FROM`) — وإلا تكفي الإشعارات الداخلية.
