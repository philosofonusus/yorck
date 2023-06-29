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
  const data = await db.insert(addressLists).values({
    id: nanoid(),
    name: listName,
    addresses: addresses
      .split(/[\n,]/)
      .map((address) => address.toLowerCase().trim()),
  });
}

export async function deleteListAction({ listId }: { listId: string }) {
  //@ts-ignore
  await db.delete(addressLists).where({ id: listId });
}
