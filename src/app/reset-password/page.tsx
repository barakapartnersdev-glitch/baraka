import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { dir } from "@/lib/i18n";
import { resetUi } from "@/lib/reset-i18n";
import { verifyPasswordResetToken, tokenMatchesPassword } from "@/lib/password-reset";
import ResetForms from "./ResetForms";

export async function generateMetadata(): Promise<Metadata> {
  const ui = resetUi(await getLocale());
  return { title: ui.metaTitle, robots: { index: false, follow: false } };
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const locale = await getLocale();
  const ui = resetUi(locale);

  // تحقّق فعلي من الرمز (إن وُجد) لاختيار النموذج المعروض: تعيين أو طلب رابط.
  let validToken = false;
  if (token) {
    const payload = await verifyPasswordResetToken(token);
    if (payload) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { passwordHash: true },
      });
      validToken = !!user && tokenMatchesPassword(payload.pv, user.passwordHash);
    }
  }

  const setMode = validToken;

  return (
    <main dir={dir(locale)} className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo-mark.png" alt="Baraka Partners" width={48} height={48} className="h-12 w-12 rounded-xl mb-3" />
          <h1 className="text-xl font-bold text-baraka-dark text-center">
            {setMode ? ui.setTitle : ui.requestTitle}
          </h1>
          <p className="text-sm text-gray-500 mt-1 text-center leading-relaxed">
            {setMode ? ui.setSub : ui.requestSub}
          </p>
        </div>

        <ResetForms
          locale={locale}
          mode={setMode ? "set" : "request"}
          token={token ?? null}
          showExpired={!!token && !validToken}
        />
      </div>
    </main>
  );
}
