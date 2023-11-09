import GLOBALS from "./globals";
import { MessageEvent } from "ws";

const PRECISION = 5;
let taps = [];

export const resetTaps = () => {
  taps = [];
};

const initializeBPMController = () => {
  let lastSentBpm = 0;

  const handleMessage = (evt: MessageEvent) => {
    const message = JSON.parse(evt.data.toString());
    if (message.op === "bpm") {
      taps.push(Date.now());
      let ticks = [];

      if (taps.length >= 2) {
        for (let i = 0; i < taps.length; i++) {
          if (i >= 1) {
            ticks.push(Math.round((60 / (taps[i] / 1000 - taps[i - 1] / 1000)) * 100) / 100);
          }
        }
      }

      if (taps.length >= 24) {
        taps.shift();
      }

      if (ticks.length >= 2) {
        let n = 0;

        for (let i = ticks.length - 1; i >= 0; i--) {
          n += ticks[i];
          if (ticks.length - i >= PRECISION) break;
        }

        GLOBALS.BPM = n / PRECISION;
      }
    }
  };

  GLOBALS.WSS.clients.forEach((client) => {
    client.addEventListener("message", handleMessage);
  });

  GLOBALS.WSS.addListener("connection", (client) => {
    client.addEventListener("message", handleMessage);
    client.send(JSON.stringify({ op: "bpm", currentBpm: GLOBALS.BPM }));
  });

  setInterval(() => {
    if (GLOBALS.BPM !== lastSentBpm) {
      GLOBALS.WSS.clients.forEach((client) => {
        client.send(JSON.stringify({ op: "bpm", currentBpm: GLOBALS.BPM }));
      });
      lastSentBpm = GLOBALS.BPM;
    }
  }, 250);
};

export default initializeBPMController;
