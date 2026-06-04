import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        baraka: { DEFAULT: "#0F6E56", light: "#E1F5EE", dark: "#085041" },
      },
      fontFamily: { sans: ["Tajawal", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
