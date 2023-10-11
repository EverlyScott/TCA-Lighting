"use client";

import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { ThemeToggleContext } from "$/ThemeToggle/context";
import { lightTheme, darkTheme } from "@/theme";
import { useRecoilState } from "recoil";
import { colorSchemeAtom } from "@/atoms";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useRecoilState(colorSchemeAtom);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui", prepend: true }}>
      <ThemeToggleContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeToggleContext.Provider>
    </NextAppDirEmotionCacheProvider>
  );
}
