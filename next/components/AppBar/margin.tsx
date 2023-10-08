"use client";

import { useMediaQuery, useTheme } from "@mui/material";

const AppBarMargin: React.FC = () => {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  return <div style={{ height: isMdDown ? 56 : 64 }} />;
};

export default AppBarMargin;
