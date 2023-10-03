import config from "./config.json";
import { Board } from "johnny-five";
import { Set } from "./types";

interface Globals {
  SET: Set;
  BPM: number;
  BOARD: Board;
}

const GLOBALS: Globals = {
  SET: undefined as any as Set, // this will be immediately assigned at start, so having an optional type would just complicate things
  BPM: 120,
  BOARD: new Board({ port: config.port }),
};

export default GLOBALS;
