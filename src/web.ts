import express, { ErrorRequestHandler } from "express";
import Next from "next";
import fs from "fs/promises";
import { existsSync } from "fs";
import bodyParser from "body-parser";
import config from "./config.json";
import GLOBALS from "./globals";
import { WebSocketServer } from "ws";
import { Set } from "./types";
import reloadSets from "./api/reload-sets";
import reloadLights from "./api/restart-lights";
import generateNotation from "./api/generate-notation";
import editSet from "./api/edit-set";
import createSet from "./api/create-set";
import getGlobals from "./api/get-globals";

const initializeExpress = () => {
  if (config.webUi.enabled) {
    const next = Next({ dev: process.env.NODE_ENV === "development", customServer: true, dir: "next" });

    next
      .prepare()
      .then(() => {
        const app = express();
        const handle = next.getRequestHandler();

        app.use((req, res, next) => {
          res.setHeader("X-Powered-By", "TCA");
          next();
        });

        app.use(bodyParser.json());

        app.post("/api/reload-sets", reloadSets);

        app.post("/api/restart-lights", reloadLights);

        app.get("/api/generate-notation", generateNotation);

        app.patch("/api/set/:setId", editSet);

        app.post("/api/set/:setId", createSet);

        app.get("/api/globals", getGlobals);

        app.get("/api*", (req, res) => {
          res.status(404).send({ error: { code: 404, message: "Not Found" } });
        });

        app.get("*", (req, res) => {
          return handle(req, res);
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

        app.listen(config.webUi.port, () => {
          console.log(`Web UI listening on port ${config.webUi.port}`);
        });

        GLOBALS.WSS = new WebSocketServer({ port: config.webUi.webSocketPort }, () => {
          console.log(`WebSocket Server listening on port ${config.webUi.webSocketPort}`);
        });
      })
      .catch((err) => {
        console.log("Failed to initialize web server! Starting backup.");
        console.error(err);

        // spin up basic express server so the user knows an error occurred
        const app = express();

        app.get("*", (req, res) => {
          res.setHeader("Content-Type", "text/html");
          res.send(`<h1 style="color: #ff0000">Failed to initialize web server!</h1>`);
        });

        app.listen(config.webUi.port, () => {
          console.log(`Web UI listening on port ${config.webUi.port}`);
        });
      });
  }
};

export default initializeExpress;
