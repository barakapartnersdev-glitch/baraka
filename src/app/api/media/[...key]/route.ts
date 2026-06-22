// عرض الصور العامة (أغلفة الفرص وصور الدول) بلا مصادقة.
// آمن لأن المفاتيح محصورة في بادئة public-media/ فقط، وهي صور تسويقية محايدة.
import { NextRequest } from "next/server";
import { getObjectBuffer } from "@/lib/storage";
import { isPublicMediaKey } from "@/lib/public-media";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: segments } = await params;
  const key = (segments ?? []).map((s) => decodeURIComponent(s)).join("/");

  if (!isPublicMediaKey(key)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const { buffer, contentType } = await getObjectBuffer(key);
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // صور غير قابلة للتغيير (المفتاح يحوي UUID) — تخزين مؤقت طويل
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
