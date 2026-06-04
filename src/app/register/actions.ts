"use server";
// تسجيل ذاتي للمستخدمين (مستثمر أو صاحب مشروع) — حساب بحالة PENDING_REVIEW.
// لا يمنح أي صلاحية فعلية قبل اعتماد الإدارة.
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { logActivity } from "@/lib/audit";
import { notifyAdmins } from "@/lib/notify";
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
