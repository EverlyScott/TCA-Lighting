import { Button, IconButton, AppBar as MuiAppBar, Toolbar, Typography } from "@mui/material";
import { ThemeToggle } from "$/ThemeToggle";

interface IProps {
  pageTitle: string;
}

const AppBar: React.FC<IProps> = ({ pageTitle }) => {
  return (
    <MuiAppBar>
      <Toolbar>
        <div style={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              display: "inline",
              ":hover": {
                textDecoration: "underline",
              },
            }}
          >
            <a style={{ color: "inherit", textDecoration: "inherit" }} href="/">
              {pageTitle}
            </a>
          </Typography>
        </div>
        <ThemeToggle />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
