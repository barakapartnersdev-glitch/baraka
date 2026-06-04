// قراءة حالة الحساب الحيّة من قاعدة البيانات.
// لا تُؤخذ الحالة من التوكن لأنها قد تتغيّر بعد اعتماد الإدارة دون إعادة دخول.
import "server-only";
import { prisma } from "@/lib/prisma";
import type { AccountStatus } from "@prisma/client";

export async function getAccountStatus(
  userId: string
): Promise<AccountStatus | null> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { accountStatus: true },
  });
  return u?.accountStatus ?? null;
}

export async function isVerified(userId: string): Promise<boolean> {
  return (await getAccountStatus(userId)) === "ACTIVE";
}
