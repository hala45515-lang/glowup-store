/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // GlowCart Brand Colors
        glow: {
          bg: "#FFF8F5",
          primary: "#C4614A",
          accent: "#E8A598",
          text: "#2C1810",
          secondary: "#F2D4C8",
        },
        primary: {
          DEFAULT: "#C4614A",
          foreground: "#FFF8F5",
          hover: "#A84E39",
          light: "#D4816E",
        },
        accent: {
          DEFAULT: "#E8A598",
          foreground: "#2C1810",
          hover: "#D8857A",
        },
        secondary: {
          DEFAULT: "#F2D4C8",
          foreground: "#2C1810",
        },
        muted: {
          DEFAULT: "#F2D4C8",
          foreground: "#7A4A3A",
        },
        border: "#E8C4B8",
        input: "#F2D4C8",
        ring: "#C4614A",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2C1810",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
