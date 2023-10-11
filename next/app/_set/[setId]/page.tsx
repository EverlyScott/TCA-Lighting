"use client";

import { Typography, useMediaQuery, useTheme, TextField } from "@mui/material";
import axios from "axios";
import config from "../../../../src/config.json";
import { NextPage } from "next";
import { Set } from "../../../../src/types";
import getGlobals from "../../../hooks/getGlobals";
import { useEffect, useState } from "react";
import Loading from "./loading";

interface IProps {
  params: IParams;
}

interface IParams {
  setId: string;
}

const fetchSet = async (setId: string) => {
  const globals = await getGlobals();

  const set = globals.SETS.find((set) => set.id === setId);

  // await new Promise((resolve) => setTimeout(resolve, 30000));

  if (set) {
    return set;
  } else {
    throw new Error("Could not find set!");
  }
};

const EditSet: NextPage<IProps> = ({ params }) => {
  const [set, setSet] = useState<Set>();

  useEffect(() => {
    (async () => {
      const set = await fetchSet(params.setId);

      setSet(set);
    })();
  }, []);

  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  if (set) {
    return (
      <>
        <Typography variant="h4" component="h2">
          Editing {set.name}
        </Typography>
        <div style={{ display: "flex", flexDirection: isMdDown ? "column" : "initial" }}>
          <div style={{ flex: 1 }}>
            <TextField label="Name" />
            <br />
            <TextField sx={{ width: "195px" }} label="ID" inputProps={{ style: { fontFamily: "monospace" } }} />
            <br />
            <TextField label="Initial BPM" type="number" />
          </div>
        </div>
      </>
    );
  } else {
    return <Loading />;
  }
};

export default EditSet;
