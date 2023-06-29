import { atom } from "jotai";
import { MonitoredAddress } from "./columns";

export const rowSelectionAtom = atom<MonitoredAddress[]>([]);
