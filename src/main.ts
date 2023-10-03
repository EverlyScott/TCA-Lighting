import init from "./init";
import initializeLights from "./lightController";
import initializeExpress from "./web";

init().then(() => {
  initializeExpress();
  initializeLights();
});
