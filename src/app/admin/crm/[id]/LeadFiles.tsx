// قسم الملفات المرفقة داخل تفاصيل الطلب (§7) — مكوّن خادم يجلب ملفاته بنفسه.
// يعرض المرفقات (تنزيل/حذف) ويتيح رفع ملف داخلي للإدارة. الإجراءات في file-actions.
import { prisma } from "@/lib/prisma";
import { tf, fmtBytes } from "@/lib/file-i18n";
import type { Locale } from "@/lib/i18n";
import { uploadLeadFile, deleteLeadFile } from "./file-actions";

const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp";

export default async function LeadFiles({ leadId, locale }: { leadId: string; locale: Locale }) {
  const files = await prisma.crmFile.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
    select: { id: true, fileName: true, fileType: true, fileSize: true, createdAt: true },
  });

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-bold text-navy mb-3">{tf(locale, "filesTitle")}</h2>

      {files.length === 0 ? (
        <p className="text-sm text-gray-400">{tf(locale, "noFiles")}</p>
      ) : (
        <ul className="flex flex-col gap-2 mb-4">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg px-3 py-2">
              <div className="min-w-0">
                <a
                  href={`/api/crm-files/${f.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-baraka hover:underline truncate block"
                >
                  {f.fileName}
                </a>
                <span className="text-xs text-gray-400">{fmtBytes(f.fileSize)}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={`/api/crm-files/${f.id}`} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-baraka">
                  {tf(locale, "download")}
                </a>
                <form action={deleteLeadFile}>
                  <input type="hidden" name="fileId" value={f.id} />
                  <button type="submit" className="text-xs text-red-600 hover:text-red-700">
                    {tf(locale, "delete")}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* رفع ملف داخلي (إدارة) */}
      <form action={uploadLeadFile} className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
        <input type="hidden" name="leadId" value={leadId} />
        <input
          type="file"
          name="file"
          accept={ACCEPT}
          required
          className="text-xs text-gray-600 file:mr-2 file:rounded-lg file:border-0 file:bg-baraka-light file:px-3 file:py-1.5 file:text-baraka-dark"
        />
        <button type="submit" className="text-xs bg-baraka text-white rounded-lg px-4 py-1.5 hover:bg-baraka-dark transition">
          {tf(locale, "uploadInternal")}
        </button>
      </form>
    </section>
  );
}
