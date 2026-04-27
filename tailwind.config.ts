import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0d0f14",
        surface: "#141720",
        surface2: "#1c2030",
        border: "#252a3a",
        accent: "#4f8ef7",
        accent2: "#f7c948",
        accent3: "#5ef7a4",
        accent4: "#f7635e",
        text: "#e8eaf0",
        muted: "#6b7394",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Syne", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
