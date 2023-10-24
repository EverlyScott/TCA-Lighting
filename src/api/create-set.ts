import { RequestHandler } from "express";
import fs from "fs/promises";
import { existsSync } from "fs";
import { Set } from "../types";
import GLOBALS from "../globals";
import fetchSets from "../fetchSets";

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

    await fs.writeFile(`src/sets/${req.params.setId}.json`, JSON.stringify(newSet, null, 2));

    await fetchSets();

    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, error: err.toString() });
  }
};

export default createSet;
