// علامة مائية على ملفات PDF — نص لاتيني (خطوط pdf-lib القياسية لا تدعم العربية).
import "server-only";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

export async function watermarkPdf(
  input: Buffer,
  text: string
): Promise<Buffer> {
  const pdf = await PDFDocument.load(input, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();
    const size = 18;
    // نكرّر النص قطرياً عبر الصفحة
    for (let y = 40; y < height; y += 140) {
      page.drawText(text, {
        x: 30,
        y,
        size,
        font,
        color: rgb(0.6, 0.6, 0.6),
        opacity: 0.25,
        rotate: degrees(30),
      });
    }
  }

  const out = await pdf.save();
  return Buffer.from(out);
}
