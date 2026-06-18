// نواة استقبال طلب الانضمام كسفير استثمار من النموذج العام (4 لغات).
// تحقّق + حماية سبام + تخزين الطلب + ملفات + إنشاء CrmLead مرتبط + إشعار الإدارة + بريد تأكيد.
// أفضل جهد في الأجزاء الثانوية: لا يفشل حفظ الطلب الأساسي بسبب CRM/بريد/ملف اختياري.
import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notify";
import { emailConfigured, sendEmail } from "@/lib/email";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { type Locale } from "@/lib/i18n";
import { computeLeadScore, priorityFromScore } from "@/lib/crm";
import {
  WORK_TYPES,
  YEARS_EXPERIENCE,
  INVESTOR_TYPES,
  SECTORS,
  INVESTMENT_RANGES,
  RELATIONSHIP_TYPES,
  YES_NO,
  REGION_KNOWLEDGE,
  LANGUAGES,
  FILE_FIELDS,
  REQUIRED_CONSENTS,
  normalizeOption,
  normalizeMulti,
  parseList,
} from "@/lib/ambassador-form";
import { storeAmbassadorUpload, validateUpload } from "@/lib/ambassador-files";

export interface AmbassadorFormState {
  ok?: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_WINDOW_MS = 45 * 1000;

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function multi(fd: FormData, key: string): string[] {
  return fd.getAll(key).map((v) => String(v).trim()).filter(Boolean);
}

async function clientMeta(): Promise<{ ip: string | null; ua: string | null }> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for");
    const ip = fwd ? fwd.split(",")[0].trim() : h.get("x-real-ip");
    return { ip: ip || null, ua: h.get("user-agent") };
  } catch {
    return { ip: null, ua: null };
  }
}

// قالب بريد تأكيد مختصر بلغة المتقدّم
function confirmationHtml(locale: Locale, fullName: string): string {
  const rtl = locale === "ar";
  const safeName = fullName.replace(/[<>&]/g, "");
  return `<!DOCTYPE html><html lang="${locale}" dir="${rtl ? "rtl" : "ltr"}"><body style="font-family:Tajawal,Arial,sans-serif;background:#F8FAF9;padding:24px;color:#1a1a1a;margin:0">
  <div style="max-width:520px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px;text-align:${rtl ? "right" : "left"}">
    <div style="color:#0F6E56;font-weight:700;font-size:18px;margin-bottom:12px">BARAKA PARTNERS</div>
    <p style="margin:0 0 8px">${safeName}،</p>
    <p style="margin:0;line-height:1.9">${ta(locale, "email.body")}</p>
    <p style="color:#888;font-size:12px;margin-top:24px">${ta(locale, "email.subject")}</p>
  </div></body></html>`;
}

export async function submitAmbassadorApplication(formData: FormData): Promise<AmbassadorFormState> {
  const locale = await getLocale();

  // 1) فخّ النحل — حقل خفي يملؤه الروبوت فقط (اسم مختلف عن حقل website الحقيقي)
  if (str(formData, "honeypot").length > 0) {
    return { ok: true };
  }

  // 2) قراءة الحقول النصية
  const fullName = str(formData, "fullName");
  const email = str(formData, "email").toLowerCase();
  const phone = str(formData, "phone");

  // 3) التحقّق الأساسي
  if (fullName.length < 3) return { error: ta(locale, "err.name") };
  if (!EMAIL_RE.test(email)) return { error: ta(locale, "err.email") };
  if (phone.replace(/[^\d]/g, "").length < 7) return { error: ta(locale, "err.phone") };

  // 4) الإقرارات الإلزامية — جميعها مطلوبة
  for (const c of REQUIRED_CONSENTS) {
    if (formData.get(c.field) == null) return { error: ta(locale, "err.consent") };
  }

  // 5) التحقّق المسبق من الملفات (نوع/حجم) قبل أي حفظ
  const photo = formData.get("photo");
  const filesToStore: { file: File; category: string }[] = [];
  if (photo instanceof File && photo.size > 0) {
    const v = validateUpload(photo);
    if (!v.ok) return { error: ta(locale, v.error === "size" ? "err.fileSize" : "err.fileType") };
    filesToStore.push({ file: photo, category: "personal_photo" });
  }
  for (const f of FILE_FIELDS) {
    for (const item of formData.getAll(f.name)) {
      if (item instanceof File && item.size > 0) {
        const v = validateUpload(item);
        if (!v.ok) return { error: ta(locale, v.error === "size" ? "err.fileSize" : "err.fileType") };
        filesToStore.push({ file: item, category: f.category });
      }
    }
  }

  // 6) حدّ المعدّل — منع إرسال متكرر من نفس البريد خلال نافذة قصيرة
  try {
    const recent = await prisma.ambassadorApplication.findFirst({
      where: { email, createdAt: { gte: new Date(Date.now() - RATE_WINDOW_MS) } },
      select: { id: true },
    });
    if (recent) return { error: ta(locale, "err.rate") };
  } catch {
    // قبل الهجرة قد يفشل الفحص — لا نمنع الإرسال
  }

  const { ip, ua } = await clientMeta();

  // 7) باقي الحقول المثبّتة
  const residenceCountry = str(formData, "residenceCountry") || null;
  const workType = normalizeOption(WORK_TYPES, str(formData, "workType"));
  const investmentRange = normalizeOption(INVESTMENT_RANGES, str(formData, "investmentRange"));
  const relationshipType = normalizeOption(RELATIONSHIP_TYPES, str(formData, "relationshipType"));
  const previousExperience = normalizeOption(YES_NO, str(formData, "previousExperience"));
  const preferredLanguage = normalizeOption(LANGUAGES, str(formData, "preferredLanguage"));
  const yearsOfExperience = normalizeOption(YEARS_EXPERIENCE, str(formData, "yearsOfExperience"));
  const spokenLanguages = normalizeMulti(LANGUAGES, multi(formData, "spokenLanguages"));
  const investorTypes = normalizeMulti(INVESTOR_TYPES, multi(formData, "investorTypes"));
  const coveredSectors = normalizeMulti(SECTORS, multi(formData, "coveredSectors"));
  const coveredCountries = parseList(str(formData, "coveredCountries"));
  const companyName = str(formData, "companyName") || null;
  const experienceSummary = str(formData, "experienceSummary") || null;

  // أسئلة تقييم تُحفظ في answers (قيم نصّية فقط — بلا null لتفادي إشكال JSON)
  const answers: Record<string, string> = {};
  const camV = normalizeOption(YES_NO, str(formData, "canArrangeMeetings"));
  if (camV) answers.canArrangeMeetings = camV;
  const negV = normalizeOption(YES_NO, str(formData, "negotiationExperience"));
  if (negV) answers.negotiationExperience = negV;
  const regV = normalizeOption(REGION_KNOWLEDGE, str(formData, "regionKnowledge"));
  if (regV) answers.regionKnowledge = regV;

  // 8) حفظ الطلب (السجل الأساسي)
  let applicationId: string;
  try {
    const app = await prisma.ambassadorApplication.create({
      data: {
        fullName,
        nationality: str(formData, "nationality") || null,
        residenceCountry,
        city: str(formData, "city") || null,
        phone: phone || null,
        whatsapp: str(formData, "whatsapp") || null,
        email,
        preferredLanguage,
        spokenLanguages,
        currentTitle: str(formData, "currentTitle") || null,
        companyName,
        professionalRole: str(formData, "professionalRole") || null,
        yearsOfExperience,
        workType,
        website: str(formData, "website") || null,
        linkedinUrl: str(formData, "linkedinUrl") || null,
        otherLinks: str(formData, "otherLinks") || null,
        coveredCountries,
        investorTypes,
        coveredSectors,
        investmentRange,
        relationshipType,
        previousExperience,
        experienceSummary,
        motivation: str(formData, "motivation") || null,
        addedValue: str(formData, "addedValue") || null,
        conflictOfInterest: str(formData, "conflictOfInterest") || null,
        answers,
        infoAccuracyAck: true,
        privacyAccepted: true,
        applicationAck: true,
        noRepresentationAck: true,
        contactConsent: true,
        status: "NEW",
        languageCode: locale,
        source: "investment_ambassadors_page",
        ipAddress: ip,
        userAgent: ua?.slice(0, 500) ?? null,
      },
      select: { id: true },
    });
    applicationId = app.id;
  } catch (e) {
    console.error("[ambassador-submit] تعذّر حفظ الطلب (هل شُغّلت الهجرة؟):", e);
    return { error: ta(locale, "err.generic") };
  }

  // 9) تخزين الملفات (تم التحقّق منها مسبقاً) — أفضل جهد
  let photoKey: string | null = null;
  for (const { file, category } of filesToStore) {
    try {
      const res = await storeAmbassadorUpload(file, { applicationId, category });
      if (category === "personal_photo" && res.ok && res.storageKey) photoKey = res.storageKey;
    } catch (e) {
      console.error("[ambassador-submit] تعذّر تخزين ملف:", e);
    }
  }
  if (photoKey) {
    try {
      await prisma.ambassadorApplication.update({ where: { id: applicationId }, data: { photoKey } });
    } catch {}
  }

  // 10) إنشاء CrmLead مرتبط (يظهر الطلب في الـ CRM) — أفضل جهد
  try {
    const leadScore = computeLeadScore({
      investmentBudget: investmentRange,
      companyName,
      message: experienceSummary,
      country: residenceCountry,
      email,
      whatsapp: str(formData, "whatsapp"),
      phone,
    });
    const lead = await prisma.crmLead.create({
      data: {
        leadType: "INVESTMENT_AMBASSADOR_APPLICATION",
        source: "INVESTMENT_AMBASSADORS_PAGE",
        status: "NEW",
        priority: priorityFromScore(leadScore),
        leadScore,
        fullName,
        email,
        phone: phone || null,
        whatsapp: str(formData, "whatsapp") || null,
        country: residenceCountry,
        city: str(formData, "city") || null,
        companyName,
        investmentBudget: investmentRange,
        message: experienceSummary,
        languageCode: locale,
        privacyAccepted: true,
        ipAddress: ip,
        userAgent: ua?.slice(0, 500) ?? null,
      },
      select: { id: true },
    });
    await prisma.ambassadorApplication.update({
      where: { id: applicationId },
      data: { crmLeadId: lead.id },
    });
  } catch (e) {
    console.error("[ambassador-submit] تعذّر ربط الطلب بالـ CRM:", e);
  }

  // 11) سجل نشاط أوّلي — أفضل جهد
  try {
    await prisma.ambassadorActivityLog.create({
      data: {
        relatedEntityType: "Application",
        relatedEntityId: applicationId,
        actionType: "created",
        description: "investment_ambassadors_page",
      },
    });
  } catch (e) {
    console.error("[ambassador-submit] تعذّر تسجيل النشاط:", e);
  }

  // 12) إشعار الإدارة (داخلي + بريد إن كان مُفعّلاً)
  await notifyAdmins({
    type: "AMBASSADOR_APPLICATION_RECEIVED",
    message: `طلب انضمام سفير استثمار جديد من ${fullName}${residenceCountry ? ` — ${residenceCountry}` : ""}`,
    link: `/admin/ambassadors/${applicationId}`,
  });

  // 13) بريد تأكيد للمتقدّم بلغته (أفضل جهد)
  if (emailConfigured()) {
    await sendEmail({
      to: email,
      subject: ta(locale, "email.subject"),
      html: confirmationHtml(locale, fullName),
    });
  }

  return { ok: true };
}
