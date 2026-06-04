// تنزيل نسخة اتفاقية NCNDA الموقّعة — لا تُخدَم إلا للمستثمر صاحب الطلب أو الإدارة.
import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getObjectBuffer } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return new Response("غير مصرّح", { status: 401 });

  const { id } = await params;
  const interest = await prisma.interest.findUnique({
    where: { id },
    select: { investorId: true, ncndaDocKey: true },
  });
  if (!interest || !interest.ncndaDocKey) {
    return new Response("غير موجود", { status: 404 });
  }

  const allowed =
    session.role === "ADMIN" || session.userId === interest.investorId;
  if (!allowed) return new Response("ممنوع", { status: 403 });

  const { buffer } = await getObjectBuffer(interest.ncndaDocKey);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="ncnda-${id}.html"`,
      "Cache-Control": "private, no-store",
    },
  });
}
