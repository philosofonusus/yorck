"use server";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { nanoid } from "nanoid";

export async function createListAction({
  listName,
  addresses,
}: {
  listName: string;
  addresses: string;
}) {
  console.log("🚀 ~ file: actions.ts:13 ~ addresses:", addresses)
  const data = await db.insert(addressLists).values({
    id: nanoid(),
    name: listName,
    addresses: addresses.split(/[\n,]/).map((address) => address.trim()),
  });
  console.log("🚀 ~ file: actions.ts:18 ~ data ~ data:", data);
}
