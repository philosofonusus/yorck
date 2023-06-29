import { ColumnDef } from "@tanstack/react-table";
import { InferModel } from "drizzle-orm";

export type addressList = InferModel<typeof addressLists>
