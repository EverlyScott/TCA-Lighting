import { RequestHandler } from "express";
import fs from "fs/promises";
import { Set } from "../types";
import GLOBALS from "../globals";
import { resetTaps } from "../bpmController";

const setCurrentSetId: RequestHandler = async (req, res) => {
  const newId: string = req.body.id;

  try {
    const set: Set = JSON.parse(await fs.readFile(`src/sets/${newId}.json`, "utf-8"));

    GLOBALS.SET = set;

    GLOBALS.BPM = set.initialBPM;

    resetTaps();

    res.status(200);
    res.end();
  } catch {
    res.status(404).send({ error: `Could not find set with ID ${newId}` });
  }
};

export default setCurrentSetId;
