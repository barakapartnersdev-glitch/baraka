"use server";
// إجراءات الخادم للمصادقة: الدخول والخروج.
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, type Role } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export interface LoginState {
  error?: string;
}

const HOME_BY_ROLE: Record<Role, string> = {
  ADMIN: "/admin",
  PROJECT_OWNER: "/owner",
  INVESTOR: "/investor",
  AMBASSADOR: "/ambassador",
  ASSET_OWNER_AGENT: "/agent", // بوّابة الوكيل (المرحلة 2)؛ لا حسابات وكلاء بعد
};

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const locale = await getLocale();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: t(locale, "err.loginRequired") };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // مقارنة ثابتة الزمن قدر الإمكان: نتحقق دائماً حتى مع غياب المستخدم
  const valid =
    user != null && (await bcrypt.compare(password, user.passwordHash));

  if (!user || !valid) {
    return { error: t(locale, "err.loginInvalid") };
  }
  if (user.accountStatus === "SUSPENDED") {
    return { error: t(locale, "err.accountSuspended") };
  }

  await createSession({
    userId: user.id,
    role: user.role,
    fullName: user.fullName,
  });

  redirect(HOME_BY_ROLE[user.role]);
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
