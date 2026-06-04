import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        baraka: { DEFAULT: "#0F6E56", light: "#E1F5EE", dark: "#085041" },
        navy: { DEFAULT: "#0a1f3c", 700: "#0f2b52", 600: "#13315e" },
        gold: { DEFAULT: "#c9a24b", soft: "#e3c987" },
      },
      fontFamily: { sans: ["Tajawal", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
