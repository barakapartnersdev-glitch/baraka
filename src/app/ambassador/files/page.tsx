// بوّابة السفير: ملفاتي.
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import UploadForm from "./UploadForm";

export const dynamic = "force-dynamic";

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function FilesPage() {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const t = (k: string) => ta(locale, k);

  const files = await prisma.ambassadorFile.findMany({
    where: { ambassadorUserId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{t("files.title")}</h1>
      <p className="text-gray-500 text-sm mb-5">{t("files.subtitle")}</p>

      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
        <UploadForm locale={locale} />
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">{t("files.empty")}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-3 p-4 text-sm">
              <span className="text-gray-800 truncate" dir="ltr">{f.fileName}</span>
              <span className="flex items-center gap-4 shrink-0">
                <span className="text-xs text-gray-400" dir="ltr">{fmtDate(f.createdAt)}</span>
                <a
                  href={`/api/ambassador-files/${f.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-baraka hover:underline"
                >
                  {t("admin.action.download")}
                </a>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
