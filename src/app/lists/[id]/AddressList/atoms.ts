import { atom } from "jotai";
import { focusAtom } from "jotai-optics";

export const listInfoAtom = atom<any>({
  selectedRows: [],
});

export const selectedRowsAtom = focusAtom(listInfoAtom, (optic) =>
  optic.prop("selectedRows")
);
