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

const initializeExpress = () => {
  const app = express();

  app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "The Class Act");
    next();
  });

  app.use(cors());

  app.use(bodyParser.json());

  app.post("/reload-sets", reloadSets);

  app.post("/restart-lights", reloadLights);

  app.get("/generate-notation", generateNotation);

  app.patch("/set/:setId", editSet);

  app.post("/set/:setId", createSet);

  app.get("/globals", getGlobals);

  app.get("*", (req, res) => {
    res.status(404).send({ error: { code: 404, message: "Not Found" } });
  });

  // const errorHandler: ErrorRequestHandler = (err, req, res) => {
  //   // next.renderError(err, req, res, req.path);
  //   res.send("a");
  // };

  // app.use(errorHandler);

  // app.get("/", (req, res) => {
  //   res.render("index", { GLOBALS });
  // });

  // app.get("/sets/create", (req, res) => {
  //   res.render("create-set");
  // });

  // app.get("/sets/:setId", (req, res, next) => {
  //   const set = GLOBALS.SETS.find((set) => set.id === req.params.setId);

  //   if (set) {
  //     res.render("edit-set", { set });
  //   } else {
  //     next();
  //   }
  // });

  app.listen(config.api.port, () => {
    console.log(`Web UI listening on port ${config.api.port}`);
  });

  GLOBALS.WSS = new WebSocketServer({ port: config.api.webSocketPort }, () => {
    console.log(`WebSocket Server listening on port ${config.api.webSocketPort}`);
  });
};

export default initializeExpress;
