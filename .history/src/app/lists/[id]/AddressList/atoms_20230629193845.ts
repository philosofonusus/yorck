import { atom } from "jotai";
import { MonitoredAddress } from "./columns";

export const selectedAtom = atom<MonitoredAddress[]>();
