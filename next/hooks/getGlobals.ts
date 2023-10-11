import axios from "axios";
import config from "../../src/config.json";
import type GLOBALS from "../../src/globals";

const getGlobals = async () => {
  const globals = await axios.get<typeof GLOBALS>(`http://127.0.0.1:${config.webUi.port}/api/globals`);

  if (globals.status === 200) {
    return globals.data;
  } else {
    throw new Error(globals.statusText);
  }
};

export default getGlobals;
