import { Roboto } from "next/font/google";
import { ThemeOptions, createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const initialTheme: ThemeOptions = {
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    primary: {
      main: "#97CFDF",
    },
  },
};

export const lightTheme = createTheme({
  ...initialTheme,
  palette: {
    ...initialTheme.palette,
    mode: "light",
  },
});

export const darkTheme = createTheme({
  ...initialTheme,
  palette: {
    ...initialTheme.palette,
    mode: "dark",
  },
});
