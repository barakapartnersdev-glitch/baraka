// تنزيل مرفقات الـ CRM — للإدارة فقط (مرفقات الطلبات داخلية وسرّية).
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
  if (session.role !== "ADMIN") return new Response("ممنوع", { status: 403 });

  const { id } = await params;
  const file = await prisma.crmFile.findUnique({
    where: { id },
    select: { fileName: true, storageKey: true, fileType: true },
  });
  if (!file) return new Response("غير موجود", { status: 404 });

  const { buffer, contentType } = await getObjectBuffer(file.storageKey);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": file.fileType || contentType,
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
