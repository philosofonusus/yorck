import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";

export default async function AddressLists() {
  const data = await db.select().from(addressLists).all();
}
