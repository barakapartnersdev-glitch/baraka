// حماية الحافة + توجيه اللغة في الرابط.
// 1) المسارات المحمية (/admin /owner /investor): تتطلب جلسة بالدور المناسب (خط دفاع أول؛ requireRole خط ثانٍ).
// 2) المحتوى العام: يُسبَق بلغة في الرابط (/ar /en /tr /zh)؛ المسار بلا لغة يُعاد توجيهه للّغة المكتشفة.
// 3) تُضبط ترويسة x-locale لكل طلب لتقرأها getLocale في الخادم.
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  parseLocaleFromPath,
  shouldLocalizePath,
  type Locale,
} from "@/lib/i18n";

const COOKIE_NAME = "baraka_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

// الدور المطلوب حسب بادئة المسار
function requiredRole(
  pathname: string
): "ADMIN" | "PROJECT_OWNER" | "INVESTOR" | "AMBASSADOR" | null {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/owner")) return "PROJECT_OWNER";
  if (pathname.startsWith("/investor")) return "INVESTOR";
  if (pathname.startsWith("/ambassador")) return "AMBASSADOR";
  return null;
}

// كشف اللغة المفضّلة: كوكي → Accept-Language → الافتراضية
function detectLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  const accept = req.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const code = part.trim().split(";")[0].split("-")[0].toLowerCase();
    if (isLocale(code)) return code;
  }
  return DEFAULT_LOCALE;
}

// يمرّر الطلب مع حقن ترويسة x-locale لتصل إلى مكوّنات الخادم
function passWithLocale(req: NextRequest, locale: Locale): NextResponse {
  const headers = new Headers(req.headers);
  headers.set("x-locale", locale);
  const res = NextResponse.next({ request: { headers } });
  if (req.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: ONE_YEAR });
  }
  return res;
}

// خط الدفاع الأول للمسارات المحمية
async function enforceRole(req: NextRequest): Promise<NextResponse | null> {
  const needed = requiredRole(req.nextUrl.pathname);
  if (!needed) return null;

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const loginUrl = new URL("/login", req.url);
  if (!token) return NextResponse.redirect(loginUrl);

  const secretRaw = process.env.SESSION_SECRET;
  if (!secretRaw) return NextResponse.redirect(loginUrl);

  try {
    const secret = new TextEncoder().encode(secretRaw);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== needed) {
      return NextResponse.redirect(new URL("/login?denied=1", req.url));
    }
  } catch {
    return NextResponse.redirect(loginUrl);
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // (1) مسارات غير مترجمة (بوّابات/مصادقة): حماية الدور + ضبط x-locale من الكوكي
  if (!shouldLocalizePath(pathname)) {
    const denied = await enforceRole(req);
    if (denied) return denied;
    const headers = new Headers(req.headers);
    headers.set("x-locale", detectLocale(req));
    return NextResponse.next({ request: { headers } });
  }

  // (2) محتوى عام مُسبَق بلغة صحيحة → مرّره مع x-locale
  const { locale } = parseLocaleFromPath(pathname);
  if (locale) return passWithLocale(req, locale);

  // (3) محتوى عام بلا لغة → أعد التوجيه للّغة المكتشفة (مؤقّت؛ الهدف يعتمد على المستخدم)
  const detected = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${detected}` : `/${detected}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // طبّق على كل المسارات عدا أصول Next وواجهات API وأي ملف بامتداد (يشمل sitemap.xml/robots.txt/favicon.ico).
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
