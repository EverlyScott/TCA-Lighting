"use client";

import React from "react";
import IconButton from "@mui/material/IconButton";
import { DarkMode, LightMode } from "@mui/icons-material";
import useColorScheme from "../../hooks/useColorScheme";

export function ThemeToggle() {
  const [[theme, mode], setMode] = useColorScheme();

  const handleToggleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <IconButton
      aria-label={mode === "dark" ? "Enable Light Mode" : "Enable Dark Mode"}
      sx={{ ml: 1 }}
      onClick={handleToggleTheme}
      color="inherit"
    >
      {mode === "dark" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}
