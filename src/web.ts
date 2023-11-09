import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config.json";
import GLOBALS from "./globals";
import { WebSocketServer } from "ws";
import reloadSets from "./api/reload-sets";
import reloadLights from "./api/restart-lights";
import generateNotation from "./api/generate-notation";
import editSet from "./api/edit-set";
import createSet from "./api/create-set";
import getGlobals from "./api/get-globals";
import setCurrentSetIndex from "./api/set-current-set-id";
import deleteSet from "./api/delete-set";
import bulkEditSets from "./api/bulk-edit-sets";
import fs from "fs/promises";

const initializeExpress = () => {
  const app = express();

  app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "The Class Act");
    next();
  });

  app.use(cors());

  app.use(bodyParser.json());

  app.get("/_schema.json", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(await fs.readFile("src/sets/_schema.json"));
  });

  app.post("/reload-sets", reloadSets);

  app.post("/restart-lights", reloadLights);

  app.get("/generate-notation", generateNotation);

  app.put("/sets", bulkEditSets);

  app.put("/set/:setId", editSet);

  app.post("/set/:setId", createSet);

  app.delete("/set/:setId", deleteSet);

  app.get("/globals", getGlobals);

  app.put("/current-set-id", setCurrentSetIndex);

  app.get("*", (req, res) => {
    res.status(404).send({ error: { code: 404, message: "Not Found" } });
  });

  app.listen(config.api.port, () => {
    console.log(`API listening on port ${config.api.port}`);
  });

  GLOBALS.WSS = new WebSocketServer({ port: config.api.webSocketPort }, () => {
    console.log(`WebSocket Server listening on port ${config.api.webSocketPort}`);
  });
};

export default initializeExpress;
