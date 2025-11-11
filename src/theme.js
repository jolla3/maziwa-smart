import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        // The 'grey' name is kept, but the colors are new
        grey: {
          100: "#f0f0f0", // Light text/element in dark mode
          200: "#c7c7c7",
          300: "#9f9f9f",
          400: "#777777",
          500: "#4f4f4f",
          600: "#3e3e3e",
          700: "#2e2e2e",
          800: "#1f1f1f",
          900: "#101010", // Dark background/element in dark mode
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          50: "#B3ECFF",
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        yellowAccent: {
          100: "#fff9db",
          200: "#fff3b7",
          300: "#ffee92",
          400: "#ffe86e",
          500: "#ffe14a",
          600: "#ccb93a",
          700: "#998429",
          800: "#665919",
          900: "#332c0c",
        },
      }
    : {
        // The 'grey' name is kept, but the colors are new
        grey: {
          100: "#101019", // Dark text/element in light mode
          200: "#1f1f1f",
          300: "#2e2e2e",
          400: "#3e3e3e",
          500: "#4f4f4f",
          600: "#777777",
          700: "#9f9f9f",
          800: "#c7c7c7",
          900: "#f0f0f0", // Light background/element in light mode
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0",
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          50: "#B3ECFF",
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        yellowAccent: {
          100: "#332c0c",
          200: "#665919",
          300: "#998429",
          400: "#ccb93a",
          500: "#ffe14a",
          600: "#ffe86e",
          700: "#ffee92",
          800: "#fff3b7",
          900: "#fff9db",
        },
      }),
});

// Refactored mui theme settings
// Refactored mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // 🌙 Dark mode palette
            primary: {
              main: colors.greenAccent[400],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.blueAccent[700],
              main: colors.blueAccent[500],
              light: colors.blueAccent[100],
            },
            background: {
              default: "#0A0A0A",   // 🔥 dark background
              paper: colors.primary[500],
            },
            text: {
              primary: colors.grey[100],
              secondary: colors.grey[400],
            },
          }
        : {
            // ☀️ Light mode palette
            primary: {
              main: colors.greenAccent[400],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#94e2cd",   // 🔥 aqua background
              paper: '#fafafa',     // lighter aqua for cards/paper
            },
            text: {
              primary: colors.primary[100],
              secondary: colors.primary[900],
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 40 },
      h2: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 32 },
      h3: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 24 },
      h4: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 20 },
      h5: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 16 },
      h6: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 14 },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};