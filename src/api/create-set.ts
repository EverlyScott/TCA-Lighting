import { RequestHandler } from "express";
import fs from "fs/promises";
import { existsSync } from "fs";
import { Set } from "../types";
import GLOBALS from "../globals";

const createSet: RequestHandler<{ setId: string }> = async (req, res) => {
  try {
    if (existsSync(`src/sets/${req.params.setId}.json`)) {
      return res.send({ success: false, error: `Set already exists with id "${req.params.setId}"` });
    }

    const partialSet: Partial<Set> = req.body;

    const newSet: Set = {
      name: partialSet.name!,
      id: req.params.setId,
      order: GLOBALS.SETS.length,
      initialBPM: partialSet.initialBPM!,
      program: [],
    };

    await fs.writeFile(`src/sets/${newSet.id}.json`, JSON.stringify(newSet, null, 2));

    const sets = await fs.readdir("src/sets");

    let setsList: Set[] = [];

    for (let i = 0; i < sets.length; i++) {
      if (sets[i].substring(0, 1) !== "_") {
        const set: Set = JSON.parse(await fs.readFile(`src/sets/${sets[i]}`, "utf-8"));
        setsList.push(set);
      }
    }

    GLOBALS.SETS = setsList;

    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, error: err.toString() });
  }
};

export default createSet;
