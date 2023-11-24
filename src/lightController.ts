import { Led } from "johnny-five";
import GLOBALS from "./globals";
import config from "./config.json";
import { RGB } from "./types";

const FADE_MULTIPLIER = 0.03; // this seems to be the smoothest number while also not having too many issues with outdated queued commands causing a flash

function interpolate(color1: RGB, color2: RGB, percent: number): RGB {
  const r = Math.round(color1[0] + (color2[0] - color1[0]) * percent);
  const g = Math.round(color1[1] + (color2[1] - color1[1]) * percent);
  const b = Math.round(color1[2] + (color2[2] - color1[2]) * percent);

  return [r, g, b];
}

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

            if (item.type === "solid") {
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
            } else {
              for (let n = 0; n < item.length; n += FADE_MULTIPLIER) {
                const currentColor = interpolate(item.from, item.to, n / item.length);
                GLOBALS.WSS.clients.forEach((client) => {
                  client.send(
                    JSON.stringify({
                      op: "light-change",
                      data: currentColor,
                    })
                  );
                });
                await sleep(item.length * (60 / GLOBALS.BPM) * (FADE_MULTIPLIER * 1000));
              }
            }
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
        try {
          GLOBALS.WSS.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                op: "light-change",
                data: [r, g, b],
              })
            );
          });
        } catch (err) {
          console.error(err);
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

        if (item.type === "solid") {
          setColor(...item.rgb);

          await sleep(item.length * (60 / GLOBALS.BPM) * 1000);
        } else {
          for (let n = 0; n < item.length; n += FADE_MULTIPLIER) {
            const currentColor = interpolate(item.from, item.to, n / item.length);
            setColor(...currentColor);

            await sleep(item.length * (60 / GLOBALS.BPM) * (FADE_MULTIPLIER * 1000));
          }
        }
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
