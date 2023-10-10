import fs from "fs/promises";
import { Set } from "../types";
import GLOBALS from "../globals";
import { RequestHandler } from "express";

const reloadSets: RequestHandler = async (req, res) => {
  console.log("Reloading sets...");

  const sets = await fs.readdir("src/sets");

  let setList: Set[] = [];

  for (let i = 0; i < sets.length; i++) {
    if (sets[i].substring(0, 1) !== "_") {
      const set: Set = JSON.parse(await fs.readFile(`src/sets/${sets[i]}`, "utf-8"));
      setList.push(set);
    }
  }

  GLOBALS.SETS = setList;

  res.status(200);
  res.end();
};

export default reloadSets;
