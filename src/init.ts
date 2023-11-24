import fs from "fs/promises";
import { Set } from "./types";
import GLOBALS from "./globals";
import { Board } from "johnny-five";
import config from "./config.json";
import fetchSets from "./fetchSets";

const init = async () => {
  console.log("Initializing...");

  let lowestOrderSet: Set | undefined = undefined;

  await fetchSets((set) => {
    if (!lowestOrderSet || lowestOrderSet.order > set.order) {
      lowestOrderSet = set;
    }
  });

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
    GLOBALS.BOARD = new Board({ port: config.arduino.comPort, repl: false });
  } else {
    console.log("Arduino disabled; using fake object.");
    GLOBALS.BOARD = {
      on: () => {},
    } as any as Board;
  }

  console.log("Finished initializing");
};

export default init;
