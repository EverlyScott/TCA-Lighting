import fs from "fs";
import init from "./init";
import initializeLights from "./lightController";
import initializeExpress from "./web";
import initializeBPMController from "./bpmController";

if (!fs.existsSync("src/config.json")) {
  throw new Error("No config present! Please copy src/config.template.json to src/config.json.");
}

init().then(() => {
  initializeExpress();
  initializeLights();
  initializeBPMController();
});
