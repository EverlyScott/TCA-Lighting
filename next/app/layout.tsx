import { Layout } from "@/types";
import type { Metadata } from "next";
import ThemeRegistry from "$/ThemeRegistry";
import AppBar from "$/AppBar";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import AppBarMargin from "$/AppBar/margin";
import RecoilRoot from "$/RecoilRoot";

export const metadata: Metadata = {
  title: "TCA Lighting System",
};

const Layout: Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          <ThemeRegistry>
            <div id="root">
              <AppBar pageTitle={metadata.title as string} />
              <AppBarMargin />
              <div style={{ marginTop: 32 }}>
                <noscript>
                  <Typography sx={{ textAlign: "center" }} variant="h3" component="h2">
                    Please enable JavaScript!
                  </Typography>
                </noscript>
                {children}
              </div>
            </div>
          </ThemeRegistry>
        </RecoilRoot>
      </body>
    </html>
  );
};

export default Layout;
