import formsPlugin from '@tailwindcss/forms';
import containerQueriesPlugin from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-fixed-dim": "#f8b48f",
        "on-secondary-container": "#00515d",
        "surface-bright": "#31394d",
        "primary-fixed": "#fbd1b9",
        "primary-container": "#d95a12", // custom Orange
        "outline-variant": "#464554",
        "outline": "#908fa0",
        "inverse-surface": "#dae2fd",
        "on-tertiary-fixed": "#002113",
        "on-error": "#690005",
        "secondary-container": "#00cbe6",
        "surface-dim": "#0b1326",
        "on-background": "#dae2fd",
        "on-primary": "#4a1c00", // custom
        "tertiary": "#4edea3",
        "on-surface-variant": "#c7c4d7",
        "on-error-container": "#ffdad6",
        "surface": "#0b1326",
        "error-container": "#93000a",
        "primary": "#f36b1f", // Custom User Override
        "background": "#0b1326",
        "tertiary-fixed": "#6ffbbe",
        "inverse-on-surface": "#283044",
        "error": "#ffb4ab",
        "on-primary-container": "#6b2800",
        "surface-container-high": "#222a3d",
        "secondary-fixed": "#a2eeff",
        "on-secondary-fixed-variant": "#004e5a",
        "secondary": "#5de6ff",
        "on-primary-fixed": "#331200",
        "inverse-primary": "#f8b48f",
        "secondary-fixed-dim": "#2fd9f4",
        "surface-container-lowest": "#060e20",
        "on-tertiary-container": "#000703",
        "on-secondary-fixed": "#001f25",
        "tertiary-fixed-dim": "#4edea3",
        "surface-variant": "#2d3449",
        "on-tertiary": "#003824",
        "on-surface": "#dae2fd",
        "on-secondary": "#00363e",
        "surface-container-highest": "#2d3449",
        "on-tertiary-fixed-variant": "#005236",
        "surface-tint": "#f36b1f",
        "tertiary-container": "#00885d",
        "surface-container": "#171f33",
        "surface-container-low": "#131b2e",
        "on-primary-fixed-variant": "#d95a12"
      },
      fontFamily: {
        "headline": ["Inter"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
    },
  },
  plugins: [
    formsPlugin,
    containerQueriesPlugin
  ],
}
