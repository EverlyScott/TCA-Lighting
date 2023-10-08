import { RequestHandler } from "express";
import initializeLights from "../lightController";

const reloadLights: RequestHandler = (req, res) => {
  initializeLights();
  res.status(200);
  res.end();
};

export default reloadLights;
