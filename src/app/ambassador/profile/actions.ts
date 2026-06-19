"use server";
// بوّابة السفير: تحديث بيانات الاتصال وتغيير كلمة المرور.
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";

export interface ProfileState {
  ok?: boolean;
  error?: string;
}

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (fullName.length < 3) return { error: ta(locale, "err.name") };

  await prisma.user.update({
    where: { id: session.userId },
    data: { fullName, phone: phone || null },
  });
  revalidatePath("/ambassador/profile");
  return { ok: true };
}

export async function changePassword(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("new") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (next.length < 8 || next !== confirm) return { error: ta(locale, "profile.err.password") };

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { passwordHash: true },
  });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    return { error: ta(locale, "profile.err.password") };
  }
  await prisma.user.update({
    where: { id: session.userId },
    data: { passwordHash: await bcrypt.hash(next, 10) },
  });
  return { ok: true };
}
