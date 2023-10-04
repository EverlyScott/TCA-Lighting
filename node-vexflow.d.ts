declare module "node-vexflow" {
  import { JSDOM } from "jsdom";

  const dom: JSDOM;

  function createCanvas(): HTMLCanvasElement;

  function extractImage(canvas: HTMLCanvasElement): Buffer;

  function writeImage(canvas: HTMLCanvasElement, filename: string): void;

  export { dom, createCanvas, extractImage, writeImage };
}
