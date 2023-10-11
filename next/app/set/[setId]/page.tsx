"use client";

import { Typography, useMediaQuery, useTheme, TextField, Paper } from "@mui/material";
import { usePathname } from "next/navigation";
import { NextPage } from "next";
import { Set } from "../../../../src/types";
import getGlobals from "../../../hooks/getGlobals";
import { useEffect, useMemo, useState } from "react";
import Loading from "./loading";
import config from "@/config.json";

interface IProps {
  params: IParams;
}

interface IParams {
  setId: string;
}

const fetchSet = async (setId: string) => {
  const globals = await getGlobals();

  const set = globals.SETS.find((set) => set.id === setId);

  if (set) {
    return set;
  } else {
    throw new Error("Could not find set!");
  }
};

const EditSet: NextPage<IProps> = ({ params }) => {
  const [set, setSet] = useState<Set>();
  const [imageUrl, setImageUrl] = useState("");
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  console.log(imageUrl);

  useEffect(() => {
    (async () => {
      const set = await fetchSet(params.setId);

      setSet(set);
    })();
  }, []);

  useMemo(() => {
    if (window && window.location) {
      setImageUrl(
        `http://${location.hostname}:${config.api.port}/generate-notation?set=${encodeURIComponent(
          JSON.stringify(set)
        )}`
      );
    }
  }, [set]);

  if (set) {
    return (
      <>
        <Typography variant="h4" component="h2">
          Editing {set.name}
        </Typography>
        <div style={{ display: "flex", flexDirection: isMdDown ? "column" : "initial", gap: "1rem" }}>
          <Paper sx={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column" }}>
            <TextField label="Name" value={set.name} />
            <br />
            <TextField label="ID" inputProps={{ style: { fontFamily: "monospace" } }} />
            <br />
            <TextField label="Initial BPM" type="number" />
          </Paper>
          <Paper
            sx={{
              flex: 1,
              padding: "1rem",
              width: isMdDown ? "100%" : "50%",
              minWidth: isMdDown ? "initial" : "500px",
              height: isMdDown ? "auto" : "initial",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            <img src={imageUrl} width="100%" style={{ position: "sticky", bottom: 0 }} />
          </Paper>
        </div>
      </>
    );
  } else {
    return <Loading />;
  }
};

export default EditSet;
