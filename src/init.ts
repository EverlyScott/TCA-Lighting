import fs from "fs/promises";
import { Set } from "./types";
import GLOBALS from "./globals";

const init = async () => {
  const sets = await fs.readdir("src/sets");

  let lowestOrderSet: Set | undefined = undefined;

  for (let i = 0; i < sets.length; i++) {
    if (sets[i].substring(0, 1) === "_") break;

    const set: Set = JSON.parse(await fs.readFile(`src/sets/${sets[i]}`, "utf-8"));

    if (!lowestOrderSet || lowestOrderSet.order > set.order) {
      lowestOrderSet = set;
    }
  }

  if (!lowestOrderSet) throw new Error("Failed to initialize! Could not find a set.");

  console.log(`Setting ${lowestOrderSet.name} as initial set...`);
  GLOBALS.SET = lowestOrderSet;
  GLOBALS.BPM = lowestOrderSet.initialBPM;
};

export default init;
