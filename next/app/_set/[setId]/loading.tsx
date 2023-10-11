import { Skeleton, TextField, Typography } from "@mui/material";
import { NextPage } from "next";

const Loading: NextPage = () => {
  return (
    <>
      <Skeleton variant="text">
        <Typography variant="h4" component="h2">
          Editing Example Set Name
        </Typography>
      </Skeleton>

      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <TextField label="Name" disabled />
          <br />
          <TextField sx={{ width: "195px" }} label="ID" inputProps={{ style: { fontFamily: "monospace" } }} disabled />
          <br />
          <TextField label="Initial BPM" type="number" disabled />
        </div>
      </div>
    </>
  );
};

export default Loading;
