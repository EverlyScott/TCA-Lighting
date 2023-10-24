import fs from "fs/promises";
import { Set } from "./types";
import GLOBALS from "./globals";

export type PerSetFunction = (set: Set) => any;

const fetchSets = async (perSetFunction?: PerSetFunction) => {
  const sets = await fs.readdir("src/sets");

  let setList: Set[] = [];

  for (let i = 0; i < sets.length; i++) {
    if (sets[i].substring(0, 1) !== "_") {
      const set: Set = JSON.parse(await fs.readFile(`src/sets/${sets[i]}`, "utf-8"));

      if (setList.find((currentSet) => currentSet.order === set.order)) {
        console.log(`Set with id ${set.id} has the same order value as another set! Modifying to random number`);
        set.order = Math.floor(Math.random() * 100);
      }

      if (perSetFunction) await perSetFunction(set); //function may be async, so we await it to make sure we don't go ahead of any code that may need to be ran

      setList.push(set);
    }
  }

  setList.sort((a, b) => (a.order > b.order ? 1 : a.order < b.order ? -1 : 0));

  GLOBALS.SETS = setList;

  return sets;
};

export default fetchSets;
