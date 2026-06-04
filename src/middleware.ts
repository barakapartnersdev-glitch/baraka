// حماية الحافة لمسار /admin: لا يمرّ إلا من يملك جلسة بدور ADMIN.
// هذا خط دفاع أول؛ يبقى requireRole داخل التخطيط كخط دفاع ثانٍ.
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "baraka_session";

// الدور المطلوب حسب بادئة المسار
function requiredRole(
  pathname: string
): "ADMIN" | "PROJECT_OWNER" | "INVESTOR" | null {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/owner")) return "PROJECT_OWNER";
  if (pathname.startsWith("/investor")) return "INVESTOR";
  return null;
}

export async function middleware(req: NextRequest) {
  const needed = requiredRole(req.nextUrl.pathname);
  if (!needed) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const loginUrl = new URL("/login", req.url);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const secretRaw = process.env.SESSION_SECRET;
  if (!secretRaw) {
    // بيئة غير مهيّأة — امنع الوصول بدل السماح بثغرة
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(secretRaw);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== needed) {
      const denied = new URL("/login?denied=1", req.url);
      return NextResponse.redirect(denied);
    }
  } catch {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*", "/investor/:path*"],
};
