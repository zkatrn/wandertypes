import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2A4D7C",
          light: "#5B8FD6",
          dark: "#1E3A5F",
        },
        secondary: {
          DEFAULT: "#E6B8D4",
          light: "#F4D9E8",
          dark: "#D196BC",
        },
        accent: {
          DEFAULT: "#FFBB96",
          light: "#FFCFB3",
          dark: "#FF9F6D",
        },
        mountain: {
          green: "#00A676",
          cream: "#F7F9F9",
          sand: "#E0D0C1",
          rose: "#A76D60",
          brown: "#601700",
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
