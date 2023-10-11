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

            if (GLOBALS.WSS) {
              GLOBALS.WSS.clients.forEach((client) => {
                client.send(
                  JSON.stringify({
                    op: "light-change",
                    data: item.rgb,
                  })
                );
              });
            }

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

    const setColor = (r: number, g: number, b: number) => {
      redLed.off();
      greenLed.off();
      blueLed.off();

      redLed.brightness(r);
      greenLed.brightness(g);
      blueLed.brightness(b);
    };

    // If lights have not been initialized yet, show that lights have been initialized by flashing on for 500ms and off for 500ms 2 times
    if (!GLOBALS.INITIALIZED_LIGHTS_FIRST_BOOT) {
      for (let i = 0; i < 4; i++) {
        if (i % 2 === 0) {
          setColor(0, 0, 0);
        } else {
          setColor(255, 255, 255);
        }

        await sleep(500);
      }

      GLOBALS.INITIALIZED_LIGHTS_FIRST_BOOT = true;
    }

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
