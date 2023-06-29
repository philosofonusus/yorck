"use server";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { nanoid } from "nanoid";

async function createListAction({
  listName,
  addresses,
}: {
  listName: string;
  addresses: string;
}) {
  await db.insert(addressLists).values({
    id: nanoid(),
    name: listName,
    addresses: addresses.split(/[\n,]/).map((address) => address.trim()),
  });
}
