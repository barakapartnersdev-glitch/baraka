"use server";
// استقبال نموذج «هل ترغب بدراسة فرص استثمارية في هذه الدولة؟» وتحويله إلى Lead في الـ CRM.
// يُسجَّل المصدر DESTINATION_PAGE والوجهة ولغة الصفحة ورابطها — على نهج بقية نماذج الموقع.
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notify";
import { headers } from "next/headers";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

export interface DestinationLeadInput {
  destinationId?: string | null;
  countryKey?: string | null;
  pageLocale?: string;
  pageUrl?: string;
  name: string;
  email: string;
  phone?: string;
  investorCountry?: string; // دولة المرسِل
  investorType?: string; // individual / company / fund
  interestCountry?: string; // الدولة التي يهتم بها
  sector?: string;
  investmentSize?: string;
  message?: string;
  website?: string; // مصيدة سبام (honeypot) — يجب أن تبقى فارغة
}

export interface LeadResult {
  ok: boolean;
  error?: "name" | "email" | "server";
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function submitDestinationLead(
  input: DestinationLeadInput
): Promise<LeadResult> {
  // مصيدة السبام: إن مُلئ هذا الحقل المخفي، نتظاهر بالنجاح دون حفظ.
  if (input.website && input.website.trim()) return { ok: true };

  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const locale = isLocale(input.pageLocale) ? input.pageLocale : DEFAULT_LOCALE;

  if (name.length < 2) return { ok: false, error: "name" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "email" };

  // الحقول التي لا تملك أعمدة مخصّصة في CrmLead تُضمَّن في نص الرسالة دون فقد أي بيانات.
  const extras: string[] = [];
  if (input.investorType?.trim()) extras.push(`نوع المستثمر: ${input.investorType.trim()}`);
  if (input.interestCountry?.trim())
    extras.push(`الدولة محل الاهتمام: ${input.interestCountry.trim()}`);
  const message =
    [input.message?.trim(), extras.join(" — ")].filter(Boolean).join("\n\n") || null;

  // بيانات تقنية للحماية من السبام والتدقيق (أفضل جهد).
  let ipAddress: string | null = null;
  let userAgent: string | null = null;
  try {
    const h = await headers();
    ipAddress = h.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    userAgent = h.get("user-agent") || null;
  } catch {
    /* تجاهل */
  }

  try {
    await prisma.crmLead.create({
      data: {
        leadType: "INVESTOR_INTEREST",
        source: "DESTINATION_PAGE",
        fullName: name,
        email,
        phone: input.phone?.trim() || null,
        whatsapp: input.phone?.trim() || null,
        country: input.investorCountry?.trim() || null,
        sectorInterest: input.sector?.trim() || null,
        investmentBudget: input.investmentSize?.trim() || null,
        message,
        languageCode: locale,
        destinationId: input.destinationId || null,
        privacyAccepted: true,
        ipAddress,
        userAgent,
      },
    });

    // إشعار الإدارة (أفضل جهد — لا يكسر الحفظ عند الفشل).
    await notifyAdmins({
      type: "NEW_CRM_LEAD",
      message: `طلب جديد من صفحة وجهة استثمار${input.countryKey ? ` (${input.countryKey})` : ""} — ${name}`,
      link: "/admin/destinations/leads",
    });

    return { ok: true };
  } catch (e) {
    console.error("[submitDestinationLead]", e);
    return { ok: false, error: "server" };
  }
}
