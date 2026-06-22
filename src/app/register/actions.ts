"use server";
// تسجيل ذاتي للمستخدمين (مستثمر أو صاحب مشروع) — حساب بحالة PENDING_REVIEW.
// لا يمنح أي صلاحية فعلية قبل اعتماد الإدارة.
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { logActivity } from "@/lib/audit";
import { notifyAdmins } from "@/lib/notify";
import { submitLead } from "@/lib/crm-submit";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export interface RegisterState {
  error?: string;
}

type RegisterRole = "INVESTOR" | "PROJECT_OWNER";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// منطق التسجيل المشترك — خاصّ (ليس إجراء خادم بذاته)؛ الدور محصور في النوعين فقط.
async function registerUser(
  role: RegisterRole,
  formData: FormData
): Promise<RegisterState> {
  const locale = await getLocale();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const investorTypeRaw = String(formData.get("investorType") ?? "").trim();
  const investorType = ["individual", "company", "fund"].includes(investorTypeRaw)
    ? investorTypeRaw
    : "individual";

  if (fullName.length < 3) {
    return { error: t(locale, "err.nameTooShort") };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: t(locale, "err.emailInvalid") };
  }
  if (password.length < 8) {
    return { error: t(locale, "err.passwordTooShort") };
  }
  if (password !== confirm) {
    return { error: t(locale, "err.passwordMismatch") };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return { error: t(locale, "err.emailTakenLogin") };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const created = await prisma.user
    .create({
      data: {
        fullName,
        email,
        phone: phone || null,
        role,
        accountStatus: "PENDING_REVIEW",
        passwordHash,
      },
      select: { id: true, role: true, fullName: true },
    })
    .catch((e: unknown) => {
      if (
        e &&
        typeof e === "object" &&
        "code" in e &&
        (e as { code?: string }).code === "P2002"
      ) {
        return null;
      }
      throw e;
    });

  if (!created) {
    return { error: t(locale, "err.emailTaken") };
  }

  // للمستثمر: أنشئ كيانه الأساسي بنوعه المختار + الدولة وتفضيلات المطابقة الأولية (تُستكمل لاحقاً)
  if (role === "INVESTOR") {
    const country = String(formData.get("country") ?? "").trim() || null;
    const investmentRange = String(formData.get("investmentRange") ?? "").trim();
    const preferredSector = String(formData.get("preferredSector") ?? "").trim();
    const profile =
      investmentRange || preferredSector
        ? { investmentRange: investmentRange || null, preferredSector: preferredSector || null }
        : undefined;
    await prisma.investorEntity.create({
      data: {
        investorId: created.id,
        name: fullName,
        type: investorType,
        country,
        ...(profile ? { profile } : {}),
      },
    });
  }

  // لصاحب المشروع/الأصل: التقط نبذة الفرصة كـ CrmLead لمراجعة الإدارة (أفضل جهد — لا يعطّل التسجيل)
  if (role === "PROJECT_OWNER") {
    try {
      const g = (k: string) => String(formData.get(k) ?? "").trim();
      const ownerLabels: Record<string, string> = {
        project_owner: "صاحب مشروع",
        asset_owner: "صاحب أصل",
        authorized_representative: "ممثل مفوّض",
      };
      const ot = g("ownerType");
      const lines = [
        g("projectDescription"),
        g("assetType") && `النوع: ${g("assetType")}`,
        g("projectStage") && `المرحلة: ${g("projectStage")}`,
        ot && `الصفة: ${ownerLabels[ot] ?? ot}`,
        g("language") && `لغة التواصل: ${g("language")}`,
      ].filter(Boolean);

      const lead = new FormData();
      lead.set("fullName", fullName);
      lead.set("email", email);
      if (phone) lead.set("phone", phone);
      lead.set("country", g("country"));
      lead.set("city", g("city"));
      lead.set("projectSector", g("sector"));
      lead.set("projectCountry", g("projectCountry"));
      lead.set("projectCity", g("projectCity"));
      lead.set("investmentBudget", g("investmentNeed"));
      lead.set("message", lines.join("\n"));
      lead.set("privacy", "1");
      await submitLead({ leadType: "OPPORTUNITY_SUBMISSION", source: "SUBMIT_PAGE", formData: lead });
    } catch (e) {
      console.error("[register-owner] تعذّر حفظ نبذة الفرصة:", e);
    }
  }

  await logActivity({
    actorId: created.id,
    action: "USER_REGISTERED",
    entityType: "User",
    entityId: created.id,
    details: { email, role },
  });

  await notifyAdmins({
    type: "NEW_REGISTRATION",
    message:
      role === "PROJECT_OWNER"
        ? `صاحب مشروع جديد سجّل: ${created.fullName}`
        : `مستثمر جديد سجّل: ${created.fullName}`,
    link: "/admin/investors",
  });

  // دخول تلقائي — لكنّ الحساب معلّق حتى الاعتماد
  await createSession({
    userId: created.id,
    role: created.role,
    fullName: created.fullName,
  });

  redirect(role === "PROJECT_OWNER" ? "/owner" : "/investor");
}

export async function registerInvestor(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  return registerUser("INVESTOR", formData);
}

export async function registerOwner(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  return registerUser("PROJECT_OWNER", formData);
}
