/** @type {import('tailwindcss').Config} */
module.exports = {
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
        'mid-blue': '#8093F1',
        'light-blue': '#B1E6F3'
      },
      fontFamily: {
        mouse: ['Mouse Memoirs', 'sans-serif'],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
