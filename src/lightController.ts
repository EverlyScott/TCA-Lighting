import { Led } from "johnny-five";
import GLOBALS from "./globals";

const startLights = () => {
  GLOBALS.BOARD.on("ready", async () => {
    console.log("ready");

    const redLed = new Led({ pin: 9 });
    const greenLed = new Led({ pin: 10 });
    const blueLed = new Led({ pin: 11 });

    while (true) {
      for (let i = 0; i < GLOBALS.SET.program.length; i++) {
        const item = GLOBALS.SET.program[i];

        redLed.off();
        greenLed.off();
        blueLed.off();

        redLed.brightness(item.rgb[0]);
        greenLed.brightness(item.rgb[1]);
        blueLed.brightness(item.rgb[2]);

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

export default startLights;
