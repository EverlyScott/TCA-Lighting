export type RGB = [number, number, number];

export interface Set {
  name: string;
  id: string;
  order: number;
  initialBPM: number;
  program: Program;
}

export type Program = ProgramItem[];

export type ProgramItem = FadeProgramItem | SolidProgramItem;

export interface FadeProgramItem {
  type: "fade";
  from: RGB;
  to: RGB;
  length: number;
}

export interface SolidProgramItem {
  type: "solid";
  rgb: RGB;
  length: number;
}
