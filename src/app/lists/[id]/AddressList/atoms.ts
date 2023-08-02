import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { MonitoredAddress } from "./columns";
import { addressLists } from "@/lib/db/schema";
import { InferModel } from "drizzle-orm";

export const listInfoAtom = atom<
  {
    selectedRows: MonitoredAddress[];
  } & Omit<InferModel<typeof addressLists>, "favorites" | "addresses"> & {
      addresses: string[];
      favorites: string[];
    }
>({
  id: "",
  name: "",
  userId: "",
  created_at: new Date(),
  updated_at: new Date(),
  synced_at: null,
  selectedRows: [],
  favorites: [],
  addresses: [],
});

export const selectedRowsAtom = focusAtom(listInfoAtom, (optic) =>
  optic.prop("selectedRows")
);
