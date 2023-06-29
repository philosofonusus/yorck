import { addressLists } from "@/lib/db/schema";
import { InferModel } from "drizzle-orm";
import { atom } from "jotai";
export const listInfoAtom = atom<
  InferModel<typeof addressLists> & {
    selectedAddresses: string[]
  }
>({});
