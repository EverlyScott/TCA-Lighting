import { NextPage } from "next";
import { Typography, Paper, Button, Divider } from "@mui/material";
import LightsDisabledMessage from "./_lightsDisabled";
import CurrentSetControls from "./_currentSetControls";
import TapBPM from "./_tapBPM";
import SetsList from "./_setsList";
import CurrentStatus from "$/CurrentStatus";
import getGlobals from "../hooks/getGlobals";

const Home: NextPage = async () => {
  const globals = await getGlobals();

  return (
    <>
      <Typography variant="h4" component="h2">
        Current Status
      </Typography>
      <Paper sx={{ maxWidth: 1000, padding: 1 }}>
        <CurrentStatus />
        <Divider sx={{ margin: "16px 0" }} />
        <LightsDisabledMessage show={globals.LIGHTS_STOPPED} />
        <Typography variant="h5" component="h3">
          Current Set
        </Typography>
        <Typography>{globals.SET.name}</Typography>
        <CurrentSetControls currentSet={globals.SET} sets={globals.SETS} />
        <Divider sx={{ margin: "16px 0" }} />
        <Typography variant="h5" component="h3">
          Current BPM
        </Typography>
        <Typography>{globals.BPM} BPM</Typography>
        <TapBPM />
      </Paper>
      <Typography sx={{ marginTop: 2 }} variant="h4" component="h2">
        Sets
      </Typography>
      <Paper>
        <SetsList sets={globals.SETS} />
      </Paper>
    </>
  );
};

export default Home;
