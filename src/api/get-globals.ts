import { RequestHandler } from "express";
import GLOBALS from "../globals";

const getGlobals: RequestHandler = (req, res) => {
  res.send(GLOBALS);
};

export default getGlobals;
