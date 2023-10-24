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
    const redLed = new Led({ pin: config.arduino.pins.r });
    const greenLed = new Led({ pin: config.arduino.pins.g });
    const blueLed = new Led({ pin: config.arduino.pins.b });
    let whiteLed: Led;
    if (config.arduino.hasDedicatedWhite) {
      whiteLed = new Led({ pin: config.arduino.pins.w });
    }

    const setColor = (r: number, g: number, b: number) => {
      try {
        redLed.off();
        greenLed.off();
        blueLed.off();
        if (config.arduino.hasDedicatedWhite) {
          whiteLed.off();
        }

        if (config.arduino.hasDedicatedWhite && r === 255 && g === 255 && b === 255) {
          whiteLed.on();
        } else {
          redLed.brightness(r);
          greenLed.brightness(g);
          blueLed.brightness(b);
        }
      } catch (err) {
        console.error(err);
      }
    };

    // If lights have not been initialized yet, show that lights have been initialized by flashing on for 500ms and off for 500ms 2 times
    if (!GLOBALS.INITIALIZED_LIGHTS_FIRST_BOOT) {
      setColor(255, 0, 0);
      await sleep(250);
      setColor(0, 0, 0);
      await sleep(250);
      setColor(0, 255, 0);
      await sleep(250);
      setColor(0, 0, 0);
      await sleep(250);
      setColor(0, 0, 255);
      await sleep(250);
      setColor(0, 0, 0);
      await sleep(250);
      if (config.arduino.hasDedicatedWhite) {
        setColor(255, 255, 255);
        await sleep(250);
        setColor(0, 0, 0);
        await sleep(250);
      }

      GLOBALS.INITIALIZED_LIGHTS_FIRST_BOOT = true;
    }

    while (true) {
      if (GLOBALS.LIGHTS_STOPPED === true) {
        return;
      }
      for (let i = 0; i < GLOBALS.SET.program.length; i++) {
        const item = GLOBALS.SET.program[i];

        setColor(...item.rgb);

        try {
          GLOBALS.WSS.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                op: "light-change",
                data: item.rgb,
              })
            );
          });
        } catch (err) {
          console.error(err);
        }

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
