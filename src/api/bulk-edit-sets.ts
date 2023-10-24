import { RequestHandler } from "express";
import { Set } from "../types";
import fs from "fs/promises";
import { existsSync } from "fs";
import fetchSets from "../fetchSets";

const bulkEditSets: RequestHandler = async (req, res) => {
  try {
    const newSets: Set[] = req.body.sets;

    console.log(newSets);

    for (let i = 0; i < newSets.length; i++) {
      const newSet = newSets[i];

      if (existsSync(`src/sets/${newSet.id}.json`)) {
        await fs.writeFile(`src/sets/${newSet.id}.json`, JSON.stringify(newSet, null, 2));
      } else {
        return res.status(400).send({
          success: false,
          error: `Set with ID ${newSet.id} does not already exist! This could be because you are creating a new set in bulk or modifying a set's ID in bulk, both of which are not allowed.`,
        });
      }
    }

    await fetchSets();

    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, error: err.toString() });
  }
};

export default bulkEditSets;
