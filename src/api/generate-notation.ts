import { RequestHandler } from "express";
import {
  BarlineType,
  Dot,
  ElementStyle,
  Flow,
  Formatter,
  Note,
  Stave,
  StaveNote,
  StaveTie,
  Stem,
  Vex,
  Voice,
} from "vexflow";
import { ProgramItem, RGB, Set } from "../types";
import { createCanvas, extractImage } from "node-vexflow";
import { randomBytes } from "crypto";

const generateNotation: RequestHandler = async (req, res) => {
  try {
    const noteConversions = {
      [(1 / 128) * 4]: "128",
      [(1 / 128 + 1 / 256) * 4]: "128d",
      [(1 / 64) * 4]: "64",
      [(1 / 64 + 1 / 128) * 4]: "64d",
      [(1 / 32) * 4]: "32",
      [(1 / 32 + 1 / 64) * 4]: "32d",
      [(1 / 16) * 4]: "16",
      [(1 / 16.0 + 1 / 32) * 4]: "16d",
      [(1 / 8) * 4]: "8",
      [(1 / 8 + 1 / 16.0) * 4]: "8d",
      [(1 / 4) * 4]: "4",
      [(1 / 4 + 1 / 8) * 4]: "4d",
      [(1 / 2) * 4]: "2",
      [(1 / 2 + 1 / 4) * 4]: "2d",
      [1 * 4]: "1",
    };

    const generateNote = (length: number, noteToGenerate: ProgramItem) => {
      if (length > 0) {
        const noteType = noteConversions[length];

        if (noteType === undefined) {
          let largestLength = 0;
          const possibleLengths = Object.getOwnPropertyNames(noteConversions);

          for (let i = 0; i < possibleLengths.length; i++) {
            const possibleLargestLength = parseFloat(possibleLengths[i]);

            if (possibleLargestLength > largestLength && possibleLargestLength < length) {
              largestLength = possibleLargestLength;
            }
          }

          const firstNote = generateNote(largestLength, noteToGenerate);
          const secondNote = generateNote(length - largestLength, noteToGenerate);

          return [...firstNote, ...secondNote];
        }

        if (noteToGenerate.type === "solid") {
          const note = new StaveNote({
            keys: ["b/4"],
            duration:
              noteType +
              (noteToGenerate.rgb[0] === 0 && noteToGenerate.rgb[1] === 0 && noteToGenerate.rgb[2] === 0 ? "r" : ""),
            dots: noteType.includes("d") ? 1 : 0,
            stem_direction: Stem.DOWN,
          });

          note.setStyle(generateStyle(noteToGenerate.rgb));

          return [noteType.includes("d") ? dotted(note) : note];
        } else if (noteToGenerate.type === "fade") {
          const firstNote = generateNote(length / 2, { type: "solid", length: length / 2, rgb: noteToGenerate.from });

          const secondNote = generateNote(length / 2, { type: "solid", length: length / 2, rgb: noteToGenerate.to });

          ties.push(
            new StaveTie({
              first_note: firstNote[0],
              first_indices: [0],
              last_note: secondNote[secondNote.length - 1],
              last_indices: [0],
            }).setStyle(generateStyle([0, 0, 0]))
          );

          return [...firstNote, ...secondNote];
        }
      } else {
        return [];
      }
    };

    const generateStyle = (rgb: RGB): ElementStyle => {
      return {
        fillStyle: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        strokeStyle: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        shadowColor: "#000000",
        shadowBlur: 1,
      };
    };

    const dotted = (note: Note) => {
      Dot.buildAndAttach([note]);
      return note;
    };

    const set: Set = JSON.parse(req.query.set as string);

    if (set.program.length === 0) {
      res.setHeader("Content-Type", "image/svg+xml");
      return res.send(
        `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"><style>.text { font: bold 10px arial; }</style><text x="0" y="10" class="text">Add a note to display the score.</text></svg>`
      );
    }

    const program = set.program;

    const canvas = createCanvas();

    const renderer = new Flow.Renderer(canvas, Flow.Renderer.Backends.CANVAS);

    let beats = 0;

    for (let i = 0; i < program.length; i++) {
      beats += program[i].length;
    }

    const margin = 200;

    const systemHeight = 325;

    const context = renderer.getContext();

    let drawnBeats = 0;

    let ties: StaveTie[] = [];

    const notes = program.flatMap((item) => {
      if (drawnBeats < 4 && drawnBeats + item.length > 4) {
        const firstNoteLength = 4 - drawnBeats;

        const firstNote = generateNote(firstNoteLength, item);

        const secondNoteLength = item.length - firstNoteLength;

        const secondNote = generateNote(secondNoteLength, item);

        drawnBeats = item.length - (4 - drawnBeats);

        ties.push(
          new StaveTie({
            first_note: firstNote[0],
            first_indices: [0],
            last_note: null, //secondNote[secondNote.length - 1],
            last_indices: [0],
          }).setStyle(generateStyle(item.type === "solid" ? item.rgb : [0, 0, 0]))
        );

        ties.push(
          new StaveTie({
            first_note: null,
            first_indices: [0],
            last_note: secondNote[secondNote.length - 1],
            last_indices: [0],
          }).setStyle(generateStyle(item.type === "solid" ? item.rgb : [0, 0, 0]))
        );

        return [...firstNote, new Vex.Flow.BarNote(), ...secondNote];
      }

      drawnBeats += item.length;

      const note = generateNote(item.length, item);

      if (drawnBeats >= 4) {
        drawnBeats = 0;
        return [...note, new Vex.Flow.BarNote()];
      } else {
        return [...note];
      }
    });

    if (drawnBeats !== 4) {
      const rest = generateNote(4 - drawnBeats, { type: "solid", rgb: [0, 0, 0], length: 4 - drawnBeats });

      notes.push(...rest);
    }

    let staves: Stave[] = [];
    let voices: Voice[] = [];

    let currentStaveNotes: StaveNote[] = [];
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];

      if (note instanceof StaveNote) {
        currentStaveNotes.push(note);
      } else if (note instanceof Vex.Flow.BarNote) {
        const stave = new Flow.Stave(10, 75 * staves.length, 480);
        stave.addClef("percussion");
        if (staves.length === 0) {
          stave.addTimeSignature("4/4");
          stave.setText(set.name, Flow.StaveModifier.Position.ABOVE);
          // stave.setTempo({ bpm: set.initialBPM }, Flow.StaveTempo.Position.BEGIN);
        }
        staves.push(stave);

        const voice = new Voice({ num_beats: 4, beat_value: 4, resolution: Vex.Flow.RESOLUTION });
        voice.setStrict(false);
        voice.addTickables(currentStaveNotes);
        voices.push(voice);

        currentStaveNotes = [];
      }
    }

    if (currentStaveNotes.length > 0) {
      const stave = new Flow.Stave(10, 75 * staves.length, 480);
      stave.addClef("percussion");
      if (staves.length === 0) {
        stave.addTimeSignature("4/4");
        stave.setText(set.name, Flow.StaveModifier.Position.ABOVE);

        // const tempo = new Vex.Flow.StaveTempo(
        //   {
        //     bpm: set.initialBPM,
        //     duration: "q",
        //   },
        //   10,
        //   0
        // );

        // tempo.setStave(stave);
        // tempo.setContext(context).draw(stave, 0);

        // stave.setTempo({ bpm: set.initialBPM }, Flow.StaveTempo.Position.BEGIN);
      }
      staves.push(stave);

      const voice = new Voice({ num_beats: 4, beat_value: 4, resolution: Vex.Flow.RESOLUTION });
      voice.setStrict(false);
      voice.addTickables(currentStaveNotes);
      voices.push(voice);

      currentStaveNotes = [];
    }

    staves[staves.length - 1].setEndBarType(BarlineType.REPEAT_END);

    renderer.resize(2000, systemHeight * staves.length + margin);
    context.scale(4, 4);
    context.save();
    context.fillStyle = "white";
    context.fillRect(0, 0, 500, (systemHeight * staves.length + margin) / 4 + margin);
    context.restore();

    for (let i = 0; i < staves.length; i++) {
      staves[i].setConfigForLines([
        { visible: false },
        { visible: false },
        { visible: true },
        { visible: false },
        { visible: false },
      ]);
      staves[i].setContext(context).draw();
    }

    const formatter = new Formatter();
    formatter.joinVoices(voices);
    formatter.format(voices, 350, { context, align_rests: true });

    for (let i = 0; i < voices.length; i++) {
      voices[i].draw(context, staves[i]);
    }

    ties.forEach((tie, i) => {
      tie.setContext(context).draw();
    });

    res.setHeader("Content-Type", "image/png");
    res.send(extractImage(canvas));
  } catch (err) {
    console.error(err);
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(
      `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"><style>.text { font: bold 10px arial; fill: #ff0000; } .error { font: 5px arial; fill: #ff0000; }</style><text x="0" y="10" class="text">An error has occurred rendering notation!</text><text x="0" y="20" class="error">${err.toString()}</text></svg>`
    );
  }
};

export default generateNotation;
