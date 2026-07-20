export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgba(226, 232, 240, 1)", // slate-200
        input: "rgba(226, 232, 240, 1)", // slate-200
        ring: "rgba(59, 130, 246, 1)", // blue-500
        background: "rgba(248, 250, 252, 1)", // slate-50
        foreground: "rgba(15, 23, 42, 1)", // slate-900
        primary: {
          DEFAULT: "rgba(37, 99, 235, 1)", // blue-600
          foreground: "rgba(255, 255, 255, 1)",
        },
        secondary: {
          DEFAULT: "rgba(241, 245, 249, 1)", // slate-100
          foreground: "rgba(15, 23, 42, 1)",
        },
        destructive: {
          DEFAULT: "rgba(239, 68, 68, 1)", // red-500
          foreground: "rgba(255, 255, 255, 1)",
        },
        muted: {
          DEFAULT: "rgba(241, 245, 249, 1)", // slate-100
          foreground: "rgba(100, 116, 139, 1)", // slate-500
        },
        accent: {
          DEFAULT: "rgba(241, 245, 249, 1)", // slate-100
          foreground: "rgba(15, 23, 42, 1)",
        },
        popover: {
          DEFAULT: "rgba(255, 255, 255, 1)",
          foreground: "rgba(15, 23, 42, 1)",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 1)",
          foreground: "rgba(15, 23, 42, 1)",
        },
        // HRMS Theme Colors
        hrms: {
          blue: {
            light: "#eff6ff",
            DEFAULT: "#3b82f6",
            dark: "#1d4ed8",
          },
          green: {
            light: "#f0fdf4",
            DEFAULT: "#22c55e",
            dark: "#15803d",
          },
          purple: {
            light: "#faf5ff",
            DEFAULT: "#a855f7",
            dark: "#7e22ce",
          },
          amber: {
            light: "#fffbeb",
            DEFAULT: "#f59e0b",
            dark: "#b45309",
          },
          rose: {
            light: "#fff1f2",
            DEFAULT: "#f43f5e",
            dark: "#be123c",
          },
          indigo: {
            light: "#eef2ff",
            DEFAULT: "#6366f1",
            dark: "#4338ca",
          },
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        hover: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};