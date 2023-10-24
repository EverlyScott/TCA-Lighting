import fs from "fs/promises";
import { RequestHandler } from "express";
import fetchSets from "../fetchSets";

const deleteSet: RequestHandler<{ setId: string }> = async (req, res) => {
  try {
    const setId = req.params.setId;

    await fs.rm(`src/sets/${setId}.json`);

    await fetchSets();

    res.status(200);
    res.end();
  } catch (err) {
    res.status(404);
    res.end();
  }
};

export default deleteSet;
