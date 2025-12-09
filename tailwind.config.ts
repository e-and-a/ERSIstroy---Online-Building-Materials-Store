import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FAE9EC",
          100: "#F3CCD3",
          200: "#E89AA8",
          300: "#D65D76",
          400: "#B03A57",
          500: "#8A1A39",
          600: "#6D011D",
          700: "#5A0017",
          800: "#420010",
          900: "#230006"
        }
      }
    }
  },
  plugins: []
};

export default config;
