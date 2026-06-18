// نواة المصادقة والصلاحيات — جلسات موقّعة عبر كوكي HttpOnly (jose).
// تُستخدم في مكوّنات الخادم وإجراءات الخادم فقط. لا تُستورد في الواجهة.
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

export type Role = "ADMIN" | "PROJECT_OWNER" | "INVESTOR" | "AMBASSADOR";

export interface SessionUser {
  userId: string;
  role: Role;
  fullName: string;
}

const COOKIE_NAME = "baraka_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 أيام

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET مفقود أو قصير — أضِف قيمة لا تقل عن 32 حرفاً في .env");
  }
  return new TextEncoder().encode(secret);
}

// إنشاء جلسة جديدة بعد تحقق الدخول
export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ role: user.role, fullName: user.fullName })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

// إنهاء الجلسة (خروج)
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

// قراءة الجلسة الحالية إن وُجدت وكانت صالحة
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) return null;
    return {
      userId: payload.sub,
      role: payload.role as Role,
      fullName: payload.fullName as string,
    };
  } catch {
    return null;
  }
}

// حارس الصلاحيات على مستوى الخادم — يُستدعى في أعلى الصفحات/الإجراءات المحمية.
// يعيد التوجيه لصفحة الدخول عند غياب الجلسة أو عدم تطابق الدور.
export async function requireRole(...allowed: Role[]): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (allowed.length > 0 && !allowed.includes(session.role)) {
    redirect("/login?denied=1");
  }
  return session;
}
