import { MonitoredAddress } from "./columns";
import { addressLists } from "@/lib/db/schema";
import { InferModel } from "drizzle-orm";
import { observable } from "@legendapp/state";

export const listInfo = observable<
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
