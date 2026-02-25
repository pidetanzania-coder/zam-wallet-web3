import { withAccountKitUi, createColorSet } from "@account-kit/react/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default withAccountKitUi(config, {
  colors: {
    "btn-primary": createColorSet("#06d6a0", "#06d6a0"),
    "btn-secondary": createColorSet("#f1f5f9", "#1e1e3a"),
    "btn-auth": createColorSet("#f1f5f9", "#1e1e3a"),
    "fg-accent-brand": createColorSet("#00b4d8", "#06d6a0"),
    "fg-primary": createColorSet("#0f172a", "#f1f5f9"),
    "fg-secondary": createColorSet("#64748b", "#94a3b8"),
    "fg-tertiary": createColorSet("#94a3b8", "#64748b"),
    "fg-invert": createColorSet("#ffffff", "#0a0a14"),
    "fg-disabled": createColorSet("#cbd5e1", "#4b5563"),
    "fg-critical": createColorSet("#ef4444", "#f87171"),
    "bg-surface-default": createColorSet("#ffffff", "#0a0a14"),
    "bg-surface-subtle": createColorSet("#f8fafc", "#111127"),
    "bg-surface-inset": createColorSet("#f1f5f9", "#1e1e3a"),
    "bg-surface-critical": createColorSet("#fef2f2", "#1c0f0f"),
    "bg-surface-error": createColorSet("#fef2f2", "#1c0f0f"),
    "bg-surface-success": createColorSet("#f0fdf4", "#0f1c14"),
    "bg-surface-warning": createColorSet("#fffbeb", "#1c1a0f"),
    active: createColorSet("#06d6a0", "#00b4d8"),
    static: createColorSet("#e2e8f0", "#2a2a4a"),
    critical: createColorSet("#ef4444", "#f87171"),
  },
  borderRadius: "lg",
});
