// مسار تنزيل محمي لملفات «وكلاء أصحاب الأصول».
// الإدارة ترى الكل؛ الوكيل يرى ملفاته الخاصة فقط (ما رفعه أو ما يخص أصوله).
// ⚠️ يعتمد على نموذج AssetAgentFile (انظر ASSET_OWNER_AGENTS_INTEGRATION.md).
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
  const file = await prisma.assetAgentFile.findUnique({
    where: { id },
    select: {
      fileName: true,
      storageKey: true,
      agentUserId: true,
      submittedAsset: { select: { agentUserId: true } },
    },
  });
  if (!file) return new Response("غير موجود", { status: 404 });

  let allowed = false;
  if (session.role === "ADMIN") allowed = true;
  else if (session.role === "ASSET_OWNER_AGENT") {
    allowed = file.agentUserId === session.userId || file.submittedAsset?.agentUserId === session.userId;
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
