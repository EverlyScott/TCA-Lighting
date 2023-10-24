import e, { RequestHandler } from "express";
import { Set } from "../types";
import fs from "fs/promises";
import GLOBALS from "../globals";
import fetchSets from "../fetchSets";

const editSet: RequestHandler<{ setId: string }> = async (req, res) => {
  try {
    const newSet: Set = req.body.set;

    if (req.params.setId !== newSet.id) {
      fs.rm(`src/sets/${req.params.setId}.json`);
    }

    await fs.writeFile(`src/sets/${newSet.id}.json`, JSON.stringify(newSet, null, 2));

    await fetchSets();

    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, error: err.toString() });
  }
};

export default editSet;
