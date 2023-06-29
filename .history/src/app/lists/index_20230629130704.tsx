import { db } from "@/lib/db";

export default async function AddressLists() {
  const data = await db.select().from("lists").all();
}
