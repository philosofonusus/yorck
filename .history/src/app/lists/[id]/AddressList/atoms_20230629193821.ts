import { atom } from "jotai";

export const selectedAtom = atom<string | null>({
  key: "selectedAtom",
  default: null,
});
