import fs from "fs/promises";
import { Set } from "./types";
import GLOBALS from "./globals";
import { Board } from "johnny-five";
import config from "./config.json";

const init = async () => {
  console.log("Initializing...");

  const sets = await fs.readdir("src/sets");

  let lowestOrderSet: Set | undefined = undefined;

  let setsList: Set[] = [];

  for (let i = 0; i < sets.length; i++) {
    if (sets[i].substring(0, 1) !== "_") {
      const set: Set = JSON.parse(await fs.readFile(`src/sets/${sets[i]}`, "utf-8"));

      setsList.push(set);

      if (!lowestOrderSet || lowestOrderSet.order > set.order) {
        lowestOrderSet = set;
      }
    }
  }

  GLOBALS.SETS = setsList;

  if (lowestOrderSet) {
    console.log(`Setting ${lowestOrderSet.name} as initial set`);
  } else {
    console.log("No sets found! Using built-in set.");

    lowestOrderSet = {
      name: "No Sets Found",
      id: "no-sets",
      initialBPM: -1,
      order: 0,
      program: [],
    };
  }

  GLOBALS.SET = lowestOrderSet;
  GLOBALS.BPM = lowestOrderSet.initialBPM;

  if (config.arduino.enabled) {
    console.log(`Initializing arduino on com port ${config.arduino.comPort}`);
    GLOBALS.BOARD = new Board({ port: config.arduino.comPort });
  } else {
    console.log("Arduino disabled; using fake object.");
    GLOBALS.BOARD = {
      on: () => {},
    } as any as Board;
  }

  console.log("Finished initializing");
};

export default init;
