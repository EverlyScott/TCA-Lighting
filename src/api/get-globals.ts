import { RequestHandler } from "express";
import GLOBALS from "../globals";

const getGlobals: RequestHandler = (req, res) => {
  const globalsCopy = Object.assign({}, GLOBALS);

  globalsCopy.BOARD = null;
  globalsCopy.WSS = null;

  res.send(globalsCopy);
};

export default getGlobals;
