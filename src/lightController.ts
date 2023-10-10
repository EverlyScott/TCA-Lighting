import { Led } from "johnny-five";
import GLOBALS from "./globals";
import config from "./config.json";

const initializeLights = () => {
  GLOBALS.LIGHTS_STOPPED = false;

  if (GLOBALS.SET.program.length === 0) {
    GLOBALS.LIGHTS_STOPPED = true;
  }

  if (!config.arduino.enabled) {
    // Still send websockets for light if arduino is disabled
    (async () => {
      if (GLOBALS.SET.program.length)
        while (true) {
          if (GLOBALS.LIGHTS_STOPPED === true) {
            return;
          }
          for (let i = 0; i < GLOBALS.SET.program.length; i++) {
            const item = GLOBALS.SET.program[i];

            GLOBALS.WSS.clients.forEach((client) => {
              client.send(
                JSON.stringify({
                  op: "light-change",
                  data: item.rgb,
                })
              );
            });

            await sleep(item.length * (60 / GLOBALS.BPM) * 1000);
          }
        }
    })();
  }

  GLOBALS.BOARD.on("ready", async () => {
    console.log("ready");

    const redLed = new Led({ pin: 9 });
    const greenLed = new Led({ pin: 10 });
    const blueLed = new Led({ pin: 11 });

    while (true) {
      if (GLOBALS.LIGHTS_STOPPED === true) {
        return;
      }
      for (let i = 0; i < GLOBALS.SET.program.length; i++) {
        const item = GLOBALS.SET.program[i];

        redLed.off();
        greenLed.off();
        blueLed.off();

        redLed.brightness(item.rgb[0]);
        greenLed.brightness(item.rgb[1]);
        blueLed.brightness(item.rgb[2]);

        GLOBALS.WSS.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              op: "light-change",
              data: item.rgb,
            })
          );
        });

        await sleep(item.length * (60 / GLOBALS.BPM) * 1000);
      }
    }
  });
};

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export default initializeLights;
