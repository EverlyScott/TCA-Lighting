import {
  Skeleton,
  Typography,
  Paper,
  Divider,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NextPage } from "next";

const Loading: NextPage = () => {
  return (
    <>
      <Typography variant="h4" component="h2">
        Current Status
      </Typography>
      <Paper sx={{ maxWidth: 1000, padding: 1 }}>
        <Skeleton variant="rectangular" sx={{ width: 100, height: 100 }} />
        <Divider sx={{ margin: "16px 0" }} />
        <Typography variant="h5" component="h3">
          Current Set
        </Typography>
        <Skeleton variant="text">
          <Typography>Example Set Name</Typography>
        </Skeleton>
        <div style={{ display: "flex" }}>
          <Button variant="contained" sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
            Previous
          </Button>
          <Divider orientation="vertical" sx={{ margin: 0 }} />
          <Button variant="contained" sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
            Next
          </Button>
        </div>
        <Divider sx={{ margin: "16px 0" }} />
        <Typography variant="h5" component="h3">
          Current BPM
        </Typography>
        <Skeleton variant="text">
          <Typography>120 BPM</Typography>
        </Skeleton>
        <Button variant="contained">Tap BPM</Button>
      </Paper>
      <Typography sx={{ marginTop: 2 }} variant="h4" component="h2">
        Sets
      </Typography>
      <Paper>
        <List>
          {new Array(4).fill("").map((_, i) => {
            return (
              <ListItem key={i} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Skeleton variant="text">
                      <Typography>1.</Typography>
                    </Skeleton>
                  </ListItemIcon>
                  <ListItemText>
                    <Skeleton variant="text">
                      <Typography>Example Set Name</Typography>
                    </Skeleton>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </>
  );
};

export default Loading;
