"use client";

import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

// import theme toggle context
import { ThemeToggleContext } from "./context";
import { DarkMode, LightMode } from "@mui/icons-material";

export function ThemeToggle() {
  // check theme is dark or light
  const theme = useTheme();

  // useContect Hook get value https://react.dev/reference/react/useContext
  const themeToggle = useContext(ThemeToggleContext);

  return (
    <IconButton
      aria-label={theme.palette.mode === "dark" ? "Enable Light Mode" : "Enable Dark Mode"}
      sx={{ ml: 1 }}
      onClick={themeToggle.toggleColorMode}
      color="inherit"
    >
      {theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}
