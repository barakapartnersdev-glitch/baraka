"use server";
// استقبال طلب «وكيل صاحب الأصل» العام وتحويله إلى سجل AssetAgentApplication.
// مرآة لـ crm-submit / تقديم طلب السفير: تحقّق + حماية سبام + حفظ + ملفات + إشعار الإدارة + بريد تأكيد.
//
// ⚠️ يعتمد على إضافات المخطّط في ASSET_OWNER_AGENTS_INTEGRATION.md
// (نموذجا AssetAgentApplication / AssetAgentFile ونوع الإشعار ASSET_AGENT_APPLICATION_RECEIVED).
// لن يُترجم/يعمل قبل تطبيق تلك الإضافات وتشغيل `prisma generate`.
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { putObject } from "@/lib/storage";
import { notifyAdmins } from "@/lib/notify";
import { emailConfigured, sendEmail, notificationEmailHtml } from "@/lib/email";
import { isLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { agentUi } from "@/lib/agent-i18n";

export interface AgentApplyState {
  ok?: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_WINDOW_MS = 45 * 1000;
const MAX_BYTES = 10 * 1024 * 1024; // 10MB لكل ملف
const ALLOWED_EXT = new Set(["pdf", "doc", "docx", "jpg", "jpeg", "png"]);

function s(obj: Record<string, unknown>, key: string): string {
  const v = obj[key];
  return v == null ? "" : String(v).trim();
}
function arr(obj: Record<string, unknown>, key: string): string[] {
  const v = obj[key];
  return Array.isArray(v) ? v.map((x) => String(x)) : [];
}
function yn(obj: Record<string, unknown>, key: string): string | null {
  const v = s(obj, key);
  return v === "yes" || v === "no" ? v : null;
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

export async function submitAgentApplication(formData: FormData): Promise<AgentApplyState> {
  const localeRaw = String(formData.get("locale") ?? "");
  const locale: Locale = isLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE;
  const ui = agentUi(locale);

  // 1) مصيدة سبام (Honeypot) — إسقاط صامت
  if (String(formData.get("website") ?? "").trim().length > 0) {
    return { ok: true };
  }

  // 2) قراءة الإجابات
  let a: Record<string, unknown> = {};
  try {
    a = JSON.parse(String(formData.get("answers") ?? "{}"));
  } catch {
    return { error: ui.genericError };
  }

  const fullName = s(a, "fullName");
  const email = s(a, "email").toLowerCase();
  const phone = s(a, "phone");

  // 3) التحقّق
  if (fullName.length < 3) return { error: ui.nameError };
  if (!EMAIL_RE.test(email)) return { error: ui.emailError };
  if (phone.length < 5) return { error: ui.phoneError };

  // 4) حدّ المعدّل — منع تكرار نفس البريد خلال نافذة قصيرة
  try {
    const recent = await prisma.assetAgentApplication.findFirst({
      where: { email, createdAt: { gte: new Date(Date.now() - RATE_WINDOW_MS) } },
      select: { id: true },
    });
    if (recent) return { error: ui.rateError };
  } catch {
    // قبل تطبيق الهجرة لا نمنع الإرسال
  }

  const { ip, ua } = await clientMeta();

  // 5) الحفظ
  let appId: string;
  try {
    const created = await prisma.assetAgentApplication.create({
      data: {
        fullName,
        country: s(a, "country") || null,
        nationality: s(a, "nationality") || null,
        city: s(a, "city") || null,
        phone,
        whatsapp: s(a, "whatsapp") || null,
        email,
        preferredLanguage: s(a, "preferredLanguage") || locale,
        professionalType: s(a, "professionalType") || null,
        professionalTypeOther: s(a, "professionalTypeOther") || null,
        relationshipType: s(a, "relationshipType") || null,
        relationshipTypeOther: s(a, "relationshipTypeOther") || null,
        coveredAssetTypes: arr(a, "coveredAssetTypes"),
        coveredAssetTypesOther: s(a, "coveredAssetTypesOther") || null,
        coveredRegions: arr(a, "coveredRegions"),
        coveredRegionsOther: s(a, "coveredRegionsOther") || null,
        experienceYears: s(a, "experienceYears") || null,
        experienceDescription: s(a, "experienceDescription") || null,
        hasPreviousDeals: yn(a, "hasPreviousDeals"),
        previousDeals: s(a, "previousDeals") || null,
        canProvideInfo: yn(a, "canProvideInfo"),
        canContactOwner: yn(a, "canContactOwner"),
        canArrangeMeeting: yn(a, "canArrangeMeeting"),
        canProvideDocuments: yn(a, "canProvideDocuments"),
        ownerWantsDeal: yn(a, "ownerWantsDeal"),
        hasOwnerPermission: yn(a, "hasOwnerPermission"),
        linkedinUrl: s(a, "linkedinUrl") || null,
        websiteUrl: s(a, "websiteUrl") || null,
        companyUrl: s(a, "companyUrl") || null,
        infoAccuracyAck: s(a, "ackAccuracy") === "yes",
        noRepresentationAck: s(a, "ackNoRepresentation") === "yes",
        privacyAccepted: s(a, "ackPrivacy") === "yes",
        contactConsent: s(a, "ackContact") === "yes",
        ownerConsentAck: s(a, "ackOwnerConsent") === "yes",
        languageCode: locale,
        source: "asset_owner_agents_page",
        ipAddress: ip,
        userAgent: ua?.slice(0, 500) ?? null,
      },
      select: { id: true },
    });
    appId = created.id;
  } catch (e) {
    console.error("[agent-submit] تعذّر حفظ الطلب (هل طُبّقت الهجرة؟):", e);
    return { error: ui.genericError };
  }

  // 6) الملفات (أفضل جهد — لا تُفشل الطلب)
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  for (const f of files) {
    try {
      const ext = (f.name.split(".").pop() ?? "").toLowerCase();
      if (f.size > MAX_BYTES || !ALLOWED_EXT.has(ext)) continue;
      const safeName = f.name.replace(/[^\w.\-؀-ۿ ]/g, "_").slice(0, 120);
      const key = `asset-agents/${appId}/${randomUUID()}-${safeName}`;
      const buffer = Buffer.from(await f.arrayBuffer());
      await putObject(key, buffer, f.type || "application/octet-stream");
      await prisma.assetAgentFile.create({
        data: {
          applicationId: appId,
          fileName: safeName,
          storageKey: key,
          fileType: f.type || null,
          fileSize: f.size,
          fileCategory: "supporting",
          visibility: "admin_only",
        },
      });
    } catch (e) {
      console.error("[agent-submit] تعذّر تخزين ملف:", e);
    }
  }

  // 7) إشعار الإدارة
  await notifyAdmins({
    type: "ASSET_AGENT_APPLICATION_RECEIVED",
    message: `طلب وكيل صاحب أصل جديد من ${fullName}${s(a, "country") ? ` — ${s(a, "country")}` : ""}`,
    link: `/admin/asset-agents/${appId}`,
  });

  // 8) بريد تأكيد للمتقدّم (أفضل جهد)
  if (emailConfigured()) {
    try {
      await sendEmail({
        to: email,
        subject: ui.successTitle,
        html: notificationEmailHtml({ fullName, message: ui.successBody }),
      });
    } catch (e) {
      console.error("[agent-submit] تعذّر إرسال بريد التأكيد:", e);
    }
  }

  return { ok: true };
}
