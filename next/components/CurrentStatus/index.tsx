"use client";

import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import config from "../../../src/config.json";

type Color = [number, number, number];

const CurrentStatus: React.FC = () => {
  const [rgb, setRgb] = useState<Color>([0, 0, 0]);
  const [wsActive, setWsActive] = useState(false);

  const handleWsOpen = () => {
    setWsActive(true);
  };

  const handleMessage = (evt: MessageEvent) => {
    const message = JSON.parse(evt.data);

    if (message.op === "light-change") {
      setRgb(message.data);
    }
  };

  const handleWsClose = () => {
    setWsActive(false);
  };

  useEffect(() => {
    const ws = new WebSocket(`ws://${location.hostname}:${config.webUi.webSocketPort}`);

    ws.addEventListener("open", handleWsOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", handleWsClose);

    return () => {
      ws.removeEventListener("open", handleWsOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("close", handleWsClose);

      ws.close();
    };
  }, []);

  if (wsActive) {
    return (
      <div
        style={{
          border: "1px solid #000000",
          width: 100,
          aspectRatio: 1 / 1,
          backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        }}
      ></div>
    );
  } else {
    return <Skeleton variant="rectangular" sx={{ width: 100, height: 100 }} />;
  }
};

export default CurrentStatus;
