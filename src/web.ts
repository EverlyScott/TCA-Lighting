import express from "express";
import config from "./config.json";
import GLOBALS from "./globals";
import { WebSocketServer } from "ws";

const initializeExpress = () => {
  if (config.webUi.enabled) {
    const app = express();

    app.set("view engine", "ejs");

    app.use(express.static("public"));

    app.get("/", (req, res) => {
      res.render("index", { GLOBALS });
    });

    const server = app.listen(config.webUi.port, () => {
      console.log(`Web UI listening on port ${config.webUi.port}`);
    });

    GLOBALS.WSS = new WebSocketServer({ server }, () => {
      console.log("Initialized WS Server");
    });
  }
};

export default initializeExpress;
