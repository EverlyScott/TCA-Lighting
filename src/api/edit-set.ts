import e, { RequestHandler } from "express";
import { Set } from "../types";
import fs from "fs/promises";
import GLOBALS from "../globals";

const editSet: RequestHandler<{ setId: string }> = async (req, res) => {
  try {
    const newSet: Set = req.body.set;

    if (req.params.setId !== newSet.id) {
      fs.rm(`src/sets/${req.params.setId}.json`);
    }

    fs.writeFile(`src/sets/${newSet.id}.json`, JSON.stringify(newSet, null, 2));

    const sets = await fs.readdir("src/sets");

    const setsList: Set[] = [];

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

export default editSet;
