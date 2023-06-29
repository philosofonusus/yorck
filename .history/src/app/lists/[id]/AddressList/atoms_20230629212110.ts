import { addressLists } from "@/lib/db/schema";
import { InferModel } from "drizzle-orm";
import { atom } from "jotai";
import { MonitoredAddress } from "./columns";

export const listInfoAtom = atom<
  | (InferModel<typeof addressLists> & {
      selectedRows: MonitoredAddress[];
    })
  | null
>(null);
