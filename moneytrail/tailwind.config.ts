import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand & Primary
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        // Text
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        body: "rgb(var(--color-body) / <alpha-value>)",
        mute: "rgb(var(--color-mute) / <alpha-value>)",
        faint: "rgb(var(--color-faint) / <alpha-value>)",
        // Surface
        hairline: "rgb(var(--color-hairline) / <alpha-value>)",
        "hairline-soft": "rgb(var(--color-hairline-soft) / <alpha-value>)",
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        "canvas-elevated": "rgb(var(--color-canvas-elevated) / <alpha-value>)",
        // Links
        link: "rgb(var(--color-link) / <alpha-value>)",
        "link-deep": "rgb(var(--color-link-deep) / <alpha-value>)",
        "link-soft": "rgb(var(--color-link-soft) / <alpha-value>)",
        // Semantic
        error: "rgb(var(--color-error) / <alpha-value>)",
        "error-deep": "rgb(var(--color-error-deep) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        "warning-soft": "rgb(var(--color-warning-soft) / <alpha-value>)",
        "warning-deep": "rgb(var(--color-warning-deep) / <alpha-value>)",
        // Accent
        violet: "rgb(var(--color-violet) / <alpha-value>)",
        "violet-soft": "rgb(var(--color-violet-soft) / <alpha-value>)",
        cyan: "rgb(var(--color-cyan) / <alpha-value>)",
        "cyan-soft": "rgb(var(--color-cyan-soft) / <alpha-value>)",
        pink: "rgb(var(--color-pink) / <alpha-value>)",
        magenta: "rgb(var(--color-magenta) / <alpha-value>)",
        // Positive/Negative (mapped)
        positive: "rgb(var(--color-positive) / <alpha-value>)",
        "positive-deep": "rgb(var(--color-positive-deep) / <alpha-value>)",
        negative: "rgb(var(--color-negative) / <alpha-value>)",
        "negative-deep": "rgb(var(--color-negative-deep) / <alpha-value>)",
        "negative-bg": "rgb(var(--color-negative-bg) / <alpha-value>)",
        "primary-pale": "rgb(var(--color-primary-pale) / <alpha-value>)",
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        md: "12px",
        lg: "16px",
        "pill-category": "64px",
        pill: "100px",
        full: "9999px",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "40px",
        "3xl": "64px",
        "4xl": "96px",
        section: "128px",
      },
      fontFamily: {
        display: ["Geist", "Arial", "sans-serif"],
        body: ["Geist", "Arial", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["3rem", { lineHeight: "3rem", fontWeight: "600", letterSpacing: "-2.4px" }],
        "heading-lg": ["2rem", { lineHeight: "2.5rem", fontWeight: "600", letterSpacing: "-1.28px" }],
        "heading-md": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600", letterSpacing: "-0.4px" }],
        "label-sm": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500", letterSpacing: "-0.28px" }],
        "mono-eyebrow": ["0.75rem", { lineHeight: "1rem", fontWeight: "500", letterSpacing: "0" }],
        "body-lg": ["1rem", { lineHeight: "1.5rem", fontWeight: "400", letterSpacing: "0" }],
        "body-md": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400", letterSpacing: "0" }],
        "body-sm": ["0.75rem", { lineHeight: "1rem", fontWeight: "400", letterSpacing: "0" }],
        "button-lg": ["1rem", { lineHeight: "1.25rem", fontWeight: "500", letterSpacing: "0" }],
        "button-md": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500", letterSpacing: "0" }],
      },
    },
  },
  plugins: [],
};
export default config;
