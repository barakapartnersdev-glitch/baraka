import { TONE_CLASSES } from "@/lib/states";

export default function Badge({ label, tone }: { label: string; tone: string }) {
  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-md ${TONE_CLASSES[tone] ?? TONE_CLASSES.gray}`}>
      {label}
    </span>
  );
}
