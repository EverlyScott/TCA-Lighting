import { Board } from "johnny-five";
import { Set } from "./types";
import { WebSocket, WebSocketServer } from "ws";

const GLOBALS = {
  SETS: [] as Set[],
  SET: undefined as any as Set, // this will be immediately assigned at start, so having an optional type would just complicate things
  BPM: 120,
  BOARD: undefined as any as Board, // this will be immediately assigned at start, so having an optional type would just complicate
  WSS: undefined as WebSocketServer,
  LIGHTS_STOPPED: true,
};

export default GLOBALS;
