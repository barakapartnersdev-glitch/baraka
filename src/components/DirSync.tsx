"use client";
// مزامنة اتجاه ولغة وسم <html> مع اللغة الحالية عند كل تنقّل.
// السبب: وسم <html lang dir> يعيش في التخطيط الجذر (app/layout.tsx) فوق مقطع [locale]،
// والتنقّل الناعم (router.push بين بادئات اللغة) لا يُعيد تصيير التخطيط الجذر،
// فتبقى قيمة dir/lang مجمّدة على ما ضُبط في أول تحميل (RTL للزائر العربي) → صفحات
// الإنجليزية/التركية/الصينية تظهر بالمقلوب. هذا المكوّن يضبطها على العميل تفاعليّاً.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { parseLocaleFromPath, dir, type Locale } from "@/lib/i18n";

export default function DirSync({ fallbackLocale }: { fallbackLocale: Locale }) {
  const pathname = usePathname();

  useEffect(() => {
    // المحتوى العام يحمل بادئة اللغة في المسار (أحدث مصدر بعد التنقّل الناعم)؛
    // البوّابات/المصادقة بلا بادئة → نعتمد اللغة التي حلّها الخادم (fallbackLocale).
    const { locale } = parseLocaleFromPath(pathname);
    const resolved: Locale = locale ?? fallbackLocale;
    const el = document.documentElement;
    el.lang = resolved;
    el.dir = dir(resolved);
  }, [pathname, fallbackLocale]);

  return null;
}
