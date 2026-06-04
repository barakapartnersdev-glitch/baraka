// مسار التنزيل المحمي — لا يُخدَم أي ملف إلا بعد التحقق من الدور وملكية الفرصة
// وحالة NCNDA. تُوضع علامة مائية على PDF لغير الإدارة.
import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getObjectBuffer } from "@/lib/storage";
import { watermarkPdf } from "@/lib/watermark";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return new Response("غير مصرّح", { status: 401 });

  const { id } = await params;
  const file = await prisma.opportunityFile.findUnique({
    where: { id },
    include: { opportunity: { select: { id: true, ownerId: true } } },
  });
  if (!file) return new Response("غير موجود", { status: 404 });

  // قواعد الإتاحة حسب الدور
  let allowed = false;
  if (session.role === "ADMIN") {
    allowed = true;
  } else if (session.role === "PROJECT_OWNER") {
    allowed = file.opportunity.ownerId === session.userId;
  } else if (session.role === "INVESTOR") {
    if (file.visibility === "POST_NCNDA" && file.approved) {
      const interest = await prisma.interest.findUnique({
        where: {
          opportunityId_investorId: {
            opportunityId: file.opportunityId,
            investorId: session.userId,
          },
        },
        select: { status: true },
      });
      allowed = interest?.status === "NCNDA_SIGNED";
    }
  }
  if (!allowed) return new Response("ممنوع", { status: 403 });

  const { buffer, contentType } = await getObjectBuffer(file.storageKey);
  const isPdf =
    contentType === "application/pdf" ||
    file.fileName.toLowerCase().endsWith(".pdf");

  let out: Buffer = buffer;
  let ct = contentType;

  // علامة مائية لغير الإدارة على ملفات PDF
  if (session.role !== "ADMIN" && isPdf) {
    const stamp = `BARAKA PARTNERS - CONFIDENTIAL - ${session.fullName} - ${new Date()
      .toISOString()
      .slice(0, 10)}`;
    out = await watermarkPdf(buffer, stamp);
    ct = "application/pdf";
  }

  return new Response(new Uint8Array(out), {
    headers: {
      "Content-Type": ct,
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
        file.fileName
      )}`,
      "Cache-Control": "private, no-store",
    },
  });
}
