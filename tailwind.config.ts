import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // تمّ توحيد الهوية على الكحلي/الذهبي: baraka أصبح كحليّاً ليُعمّم التصميم على كل الصفحات.
        baraka: { DEFAULT: "#0f2b52", light: "#eef2f8", dark: "#0a1f3c" },
        navy: { DEFAULT: "#0a1f3c", 700: "#0f2b52", 600: "#13315e" },
        gold: { DEFAULT: "#c9a24b", soft: "#e3c987" },
      },
      fontFamily: { sans: ["Tajawal", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
