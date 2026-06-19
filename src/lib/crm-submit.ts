// النواة المشتركة لاستقبال طلبات نماذج الموقع وتحويلها إلى CrmLead.
// تخدم النماذج الأربعة (اهتمام بفرصة / تقديم فرصة / تواصل / سريع) بمنطق موحّد:
// تحقّق + حماية سبام + درجة جدية + حفظ + إشعار الإدارة + بريد تأكيد للعميل.
import "server-only";
import { headers } from "next/headers";
import type { LeadType, LeadSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notify";
import { emailConfigured, sendEmail, crmConfirmationEmailHtml } from "@/lib/email";
import { getLocale } from "@/lib/i18n-server";
import { tc } from "@/lib/crm-i18n";
import {
  computeLeadScore,
  priorityFromScore,
  normalizeCode,
  SENDER_ROLES,
  PREFERRED_CONTACTS,
} from "@/lib/crm";
import { processLeadFiles } from "@/lib/crm-files";

export interface LeadFormState {
  ok?: boolean;
  error?: string;
  leadId?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_WINDOW_MS = 45 * 1000; // منع تكرار نفس البريد خلال 45 ثانية

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
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

// إنشاء طلب من بيانات نموذج. يقرأ مجموعة حقول فائقة تغطّي كل النماذج؛
// كل نموذج يرسل ما يخصّه فقط، والباقي يبقى فارغاً.
export async function submitLead(opts: {
  leadType: LeadType;
  source: LeadSource;
  formData: FormData;
}): Promise<LeadFormState> {
  const { leadType, source, formData } = opts;
  const locale = await getLocale();

  // 1) فخّ النحل (Honeypot) — حقل خفي يملؤه الروبوت فقط. إسقاط صامت.
  if (str(formData, "website").length > 0) {
    return { ok: true };
  }

  // 2) قراءة الحقول
  const fullName = str(formData, "fullName");
  const email = str(formData, "email").toLowerCase();
  const phone = str(formData, "phone") || null;
  const whatsapp = str(formData, "whatsapp") || null;
  const country = str(formData, "country") || null;
  const city = str(formData, "city") || null;
  const companyName = str(formData, "companyName") || null;
  const message = str(formData, "message") || null;
  const investmentBudget = str(formData, "investmentBudget") || null;
  const sectorInterest = str(formData, "sectorInterest") || null;
  const senderRole = normalizeCode(SENDER_ROLES, str(formData, "senderRole")) ?? null;
  const preferredContact =
    normalizeCode(PREFERRED_CONTACTS, str(formData, "preferredContact")) ?? null;
  const privacyAccepted = formData.get("privacy") != null;
  const relatedOpportunityIdRaw = str(formData, "relatedOpportunityId") || null;

  // حقول تقديم الفرصة (تُقرأ فقط إن وُجدت)
  const projectSector = str(formData, "projectSector") || null;
  const projectCountry = str(formData, "projectCountry") || null;
  const projectCity = str(formData, "projectCity") || null;
  const hasFeasibility = str(formData, "hasFeasibility") || null;
  const hasLicensing = str(formData, "hasLicensing") || null;

  // 3) التحقّق
  if (fullName.length < 3) return { error: tc(locale, "err.name") };
  if (!EMAIL_RE.test(email)) return { error: tc(locale, "err.email") };
  if (!privacyAccepted) return { error: tc(locale, "err.privacy") };

  // 4) حدّ المعدّل — منع إرسال متكرر من نفس البريد خلال نافذة قصيرة
  try {
    const recent = await prisma.crmLead.findFirst({
      where: { email, createdAt: { gte: new Date(Date.now() - RATE_WINDOW_MS) } },
      select: { id: true },
    });
    if (recent) return { error: tc(locale, "err.rate") };
  } catch {
    // إن فشل الفحص (مثلاً قبل الهجرة) لا نمنع الإرسال
  }

  // 5) ربط الفرصة — يُقبل فقط معرّف فرصة منشورة فعلاً
  let relatedOpportunityId: string | null = null;
  if (relatedOpportunityIdRaw && leadType === "INVESTOR_INTEREST") {
    const opp = await prisma.opportunity.findFirst({
      where: { id: relatedOpportunityIdRaw, state: "PUBLISHED" },
      select: { id: true },
    });
    relatedOpportunityId = opp?.id ?? null;
  }

  // 6) درجة الجدية والأهمية الابتدائية
  const leadScore = computeLeadScore({
    investmentBudget,
    companyName,
    message,
    relatedOpportunityId,
    country,
    email,
    whatsapp,
    phone,
    preferredContact,
  });
  const priority = priorityFromScore(leadScore);

  const { ip, ua } = await clientMeta();

  // 7) الحفظ
  let leadId: string;
  try {
    const lead = await prisma.crmLead.create({
      data: {
        leadType,
        source,
        status: "NEW",
        priority,
        leadScore,
        fullName,
        email,
        phone,
        whatsapp,
        country,
        city,
        companyName,
        senderRole,
        preferredContact,
        investmentBudget,
        sectorInterest,
        message,
        languageCode: locale,
        relatedOpportunityId,
        projectSector,
        projectCountry,
        projectCity,
        hasFeasibility,
        hasLicensing,
        privacyAccepted,
        ipAddress: ip,
        userAgent: ua?.slice(0, 500) ?? null,
      },
      select: { id: true },
    });
    leadId = lead.id;
  } catch (e) {
    console.error("[crm-submit] تعذّر حفظ الطلب (هل شُغّلت الهجرة؟):", e);
    return { error: tc(locale, "err.generic") };
  }

  // 8) سجل نشاط أوّلي (أفضل جهد)
  try {
    await prisma.crmActivityLog.create({
      data: { leadId, actionType: "created", description: `source:${source}` },
    });
  } catch (e) {
    console.error("[crm-submit] تعذّر تسجيل النشاط:", e);
  }

  // 9) إشعار الإدارة (داخلي + بريد إن كان مُفعّلاً)
  await notifyAdmins({
    type: "NEW_CRM_LEAD",
    message: `طلب جديد (${leadType}) من ${fullName}${country ? ` — ${country}` : ""}`,
    link: `/admin/crm/${leadId}`,
  });

  // 10) بريد تأكيد للعميل بلغته (أفضل جهد)
  if (emailConfigured()) {
    await sendEmail({
      to: email,
      subject: tc(locale, "email.confirmSubject"),
      html: crmConfirmationEmailHtml(locale, { fullName }),
    });
  }

  // 11) مرفقات الملفات إن وُجدت — أي نموذج فيه <input name="files"> (أفضل جهد)
  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > 0) {
    try {
      await processLeadFiles(leadId, files, locale);
    } catch (e) {
      console.error("[crm-submit] تعذّر معالجة المرفقات:", e);
    }
  }

  return { ok: true, leadId };
}
