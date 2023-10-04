import express from "express";
import fs from "fs/promises";
import { createCanvas, extractImage } from "node-vexflow";
import { Flow, Formatter, StaveNote, Stem, Voice } from "vexflow";
import { Fraction } from "vexflow";
import config from "./config.json";
import GLOBALS from "./globals";
import { WebSocketServer } from "ws";
import { Program, Set } from "./types";

const initializeExpress = () => {
  if (config.webUi.enabled) {
    const app = express();

    app.set("view engine", "ejs");

    app.use(express.static("public"));

    app.post("/api/reload-sets", async (req, res) => {
      console.log("Reloading sets...");

      const sets = await fs.readdir("src/sets");

      let setsList: Set[] = [];

      for (let i = 0; i < sets.length; i++) {
        if (sets[i].substring(0, 1) !== "_") {
          const set: Set = JSON.parse(await fs.readFile(`src/sets/${sets[i]}`, "utf-8"));
          setsList.push(set);
        }
      }

      GLOBALS.SETS = setsList;

      res.status(200);
      res.end();
    });

    app.get("/api/generate-notation", async (req, res) => {
      const program: Program = JSON.parse(req.query.program as string);

      const canvas = createCanvas();

      const renderer = new Flow.Renderer(canvas, Flow.Renderer.Backends.CANVAS);
      renderer.resize(2000, 2000);

      const context = renderer.getContext();
      context.scale(4, 4);
      context.save();
      context.fillStyle = "white";
      context.fillRect(0, 0, 500, 500);
      context.restore();

      const stave = new Flow.Stave(10, 10, 480, { num_lines: 1 });
      stave.addClef("percussion", undefined);
      stave.setText("Notation", Flow.StaveModifier.Position.ABOVE);
      stave.setContext(context).draw();

      let beats = 0;

      for (let i = 0; i < program.length; i++) {
        beats += program[i].length;
      }

      let programBeats = 0;

      const voice = new Voice({ num_beats: beats, beat_value: 4 });
      voice.addTickables(
        program.map((item, index) => {
          programBeats += item.length;
          return new StaveNote({
            keys: ["b/4"],
            duration:
              new Fraction(item.length, 4).simplify().denominator.toString() +
              (item.rgb[0] === 0 && item.rgb[1] === 0 && item.rgb[2] === 0 ? "r" : ""),
            stem_direction: Stem.DOWN,
          });
        })
      );
      new Formatter().joinVoices([voice]).format([voice], 350);

      voice.draw(context, stave);

      res.setHeader("Content-Type", "image/png");
      res.send(extractImage(canvas));
    });

    app.get("/", (req, res) => {
      res.render("index", { GLOBALS });
    });

    app.get("/sets/create", (req, res) => {
      res.render("create-set");
    });

    app.get("/sets/:setId", (req, res) => {
      const set = GLOBALS.SETS.find((set) => set.id === req.params.setId);

      res.render("edit-set", { set });
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
