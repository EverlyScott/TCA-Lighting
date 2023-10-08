import { atom } from "recoil";

const localStorageEffect =
  (key: any) =>
  ({ setSelf, onSet }: any) => {
    try {
      const savedValue = localStorage.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
    } catch (e) {}
    onSet((newValue: any) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (e) {}
    });
  };

export type ColorScheme = "light" | "dark";

export const colorSchemeAtom = atom<ColorScheme>({
  key: "colorScheme",
  default: "dark",
  effects: [localStorageEffect("colorScheme")],
});
