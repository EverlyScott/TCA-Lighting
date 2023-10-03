export interface Set {
  name: string;
  order: number;
  initialBPM: number;
  program: Program;
}

export type Program = ProgramItem[];

export interface ProgramItem {
  rgb: [number, number, number];
  length: number;
}
