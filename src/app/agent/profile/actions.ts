"use server";
// بوّابة الوكيل: تحديث بيانات الاتصال + تغيير كلمة المرور.
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAgentAccount } from "@/lib/agent-account";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";

export interface ProfileState {
  ok?: boolean;
  error?: string;
}

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function updateAgentProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const account = await getAgentAccount(session.userId);
  if (!account) return { error: tg(locale, "common.actionFailed") };

  const phone = s(formData, "phone");
  if (phone.replace(/[^\d]/g, "").length < 7) return { error: tg(locale, "profile.err.name") };

  await prisma.assetAgentApplication.update({
    where: { id: account.applicationId },
    data: {
      phone,
      whatsapp: s(formData, "whatsapp") || null,
      linkedinUrl: s(formData, "linkedinUrl") || null,
      websiteUrl: s(formData, "websiteUrl") || null,
      companyUrl: s(formData, "companyUrl") || null,
    },
  });
  await prisma.user.update({ where: { id: session.userId }, data: { phone } });
  revalidatePath("/agent/profile");
  return { ok: true };
}

export async function changeAgentPassword(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("new") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (next.length < 8 || next !== confirm) return { error: tg(locale, "profile.err.password") };

  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { passwordHash: true } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: tg(locale, "profile.err.password") };
  await prisma.user.update({ where: { id: session.userId }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: true };
}
