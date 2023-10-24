import fs from "fs/promises";
import { Set } from "../types";
import GLOBALS from "../globals";
import { RequestHandler } from "express";
import fetchSets from "../fetchSets";

const reloadSets: RequestHandler = async (req, res) => {
  console.log("Reloading sets...");

  await fetchSets();

  res.status(200);
  res.end();
};

export default reloadSets;
