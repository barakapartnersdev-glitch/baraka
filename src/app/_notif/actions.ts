"use server";
// إجراء وضع كل إشعارات المستخدم الحالي "مقروءة" — يُستدعى عند فتح الجرس.
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { markAllRead } from "@/lib/notify";

export async function markMyNotificationsRead(): Promise<void> {
  const session = await getSession();
  if (!session) return;
  await markAllRead(session.userId);
  revalidatePath("/admin");
  revalidatePath("/owner");
  revalidatePath("/investor");
}
