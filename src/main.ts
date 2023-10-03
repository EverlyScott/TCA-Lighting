import init from "./init";
import startLights from "./lightController";

init().then(() => {
  startLights();
});
