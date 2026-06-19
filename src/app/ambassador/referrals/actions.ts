"use server";
// إجراء ترشيح مستثمر من بوّابة السفير — ينشئ AmbassadorReferral + CrmLead مرتبط (عند توفّر بريد) + إشعار الإدارة.
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notify";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import {
  REF_INVESTOR_TYPES,
  REF_RELATIONSHIP,
  REF_SERIOUSNESS,
  REF_CONSENT,
  SECTORS,
  INVESTMENT_RANGES,
  normalizeOption,
  normalizeMulti,
} from "@/lib/ambassador-form";

export interface ReferralFormState {
  ok?: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const m = (fd: FormData, k: string) => fd.getAll(k).map((v) => String(v).trim()).filter(Boolean);

export async function submitReferral(
  _prev: ReferralFormState,
  formData: FormData
): Promise<ReferralFormState> {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();

  const investorName = s(formData, "investorName");
  if (investorName.length < 2) return { error: ta(locale, "ref.errName") };

  const contactEmail = s(formData, "contactEmail").toLowerCase();
  const investorCountry = s(formData, "investorCountry") || null;
  const investmentRange = normalizeOption(INVESTMENT_RANGES, s(formData, "investmentRange"));
  const investorCompany = s(formData, "investorCompany") || null;

  let referralId: string;
  try {
    const ref = await prisma.ambassadorReferral.create({
      data: {
        ambassadorUserId: session.userId,
        investorName,
        investorCompany,
        investorCountry,
        investorCity: s(formData, "investorCity") || null,
        investorType: normalizeOption(REF_INVESTOR_TYPES, s(formData, "investorType")),
        interestedSectors: normalizeMulti(SECTORS, m(formData, "interestedSectors")),
        investmentRange,
        relationshipWithAmbassador: normalizeOption(REF_RELATIONSHIP, s(formData, "relationship")),
        seriousnessLevel: normalizeOption(REF_SERIOUSNESS, s(formData, "seriousness")),
        consentConfirmed: normalizeOption(REF_CONSENT, s(formData, "consent")),
        contactEmail: contactEmail || null,
        contactPhone: s(formData, "contactPhone") || null,
        linkedinUrl: s(formData, "linkedinUrl") || null,
        website: s(formData, "website") || null,
        description: s(formData, "description") || null,
        ambassadorNotes: s(formData, "notes") || null,
        status: "NEW",
      },
      select: { id: true },
    });
    referralId = ref.id;
  } catch (e) {
    console.error("[referral] تعذّر حفظ الترشيح:", e);
    return { error: ta(locale, "common.actionFailed") };
  }

  // CrmLead مرتبط — فقط عند توفّر بريد المستثمر (احتراماً للخصوصية)
  if (EMAIL_RE.test(contactEmail)) {
    try {
      const lead = await prisma.crmLead.create({
        data: {
          leadType: "INVESTOR_INTEREST",
          source: "INVESTMENT_AMBASSADORS_PAGE",
          status: "NEW",
          fullName: investorName,
          email: contactEmail,
          phone: s(formData, "contactPhone") || null,
          country: investorCountry,
          companyName: investorCompany,
          investmentBudget: investmentRange,
          message: `ترشيح من السفير: ${session.fullName}`,
          senderRole: "broker",
          languageCode: locale,
        },
        select: { id: true },
      });
      await prisma.ambassadorReferral.update({ where: { id: referralId }, data: { crmLeadId: lead.id } });
    } catch (e) {
      console.error("[referral] تعذّر ربط الترشيح بالـ CRM:", e);
    }
  }

  try {
    await prisma.ambassadorActivityLog.create({
      data: {
        ambassadorUserId: session.userId,
        relatedEntityType: "Referral",
        relatedEntityId: referralId,
        actionType: "created",
        createdById: session.userId,
      },
    });
  } catch {}

  await notifyAdmins({
    type: "AMBASSADOR_NEW_REFERRAL",
    message: `ترشيح مستثمر جديد من السفير ${session.fullName}: ${investorName}`,
    link: "/admin/ambassadors/referrals",
  });

  return { ok: true };
}
