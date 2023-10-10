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
};

export const lightTheme = createTheme({
  ...initialTheme,
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
    },
    primary: {
      main: "#97CFDF",
    },
    secondary: {
      main: "#4C0F0F",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: "#4C0F0F",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...initialTheme,
  palette: {
    mode: "dark",
    background: {
      default: "#1c1c1e",
    },
    primary: {
      main: "#4C0F0F",
    },
    secondary: {
      main: "#97CFDF",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#4C0F0F",
          backgroundImage: "initial",
        },
      },
    },
  },
});
