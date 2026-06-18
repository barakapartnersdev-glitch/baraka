// مسار تنزيل محمي لملفات سفراء الاستثمار — لا يُخدَم ملف إلا بعد التحقق من الدور والملكية.
// الإدارة ترى كل الملفات؛ السفير يرى ملفاته الخاصة فقط (ما يملكه أو ما يرتبط بحسابه/ترشيحاته/رسائله).
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
  const file = await prisma.ambassadorFile.findUnique({
    where: { id },
    select: {
      fileName: true,
      storageKey: true,
      ambassadorUserId: true,
      applicationId: true,
      referral: { select: { ambassadorUserId: true } },
      message: { select: { ambassadorUserId: true } },
    },
  });
  if (!file) return new Response("غير موجود", { status: 404 });

  let allowed = false;
  if (session.role === "ADMIN") {
    allowed = true;
  } else if (session.role === "AMBASSADOR") {
    if (file.ambassadorUserId === session.userId) allowed = true;
    else if (file.referral?.ambassadorUserId === session.userId) allowed = true;
    else if (file.message?.ambassadorUserId === session.userId) allowed = true;
    else if (file.applicationId) {
      // ملف مرفوع وقت التقديم — يُتاح للسفير إن كان مرتبطاً بحسابه
      const acc = await prisma.ambassadorAccount.findUnique({
        where: { userId: session.userId },
        select: { applicationId: true },
      });
      allowed = acc?.applicationId === file.applicationId;
    }
  }
  if (!allowed) return new Response("ممنوع", { status: 403 });

  const { buffer, contentType } = await getObjectBuffer(file.storageKey);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
