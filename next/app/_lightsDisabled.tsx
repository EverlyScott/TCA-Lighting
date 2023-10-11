"use client";

import { Typography, Button, Divider } from "@mui/material";

interface IProps {
  show: boolean;
}

const LightsDisabledMessage: React.FC<IProps> = ({ show }) => {
  const handleRestartLights = () => {};

  return (
    <>
      {show && (
        <>
          <Typography>
            <strong>Lights have been disabled due to an issue!</strong>
          </Typography>
          <Button variant="contained" onClick={handleRestartLights}>
            Restart
          </Button>
          <Divider sx={{ margin: "16px 0" }} />
        </>
      )}
    </>
  );
};

export default LightsDisabledMessage;
