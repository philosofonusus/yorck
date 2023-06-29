"use server";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function addAddressToListAction({
  listId,
  addresses,
}: {
  listId: string;
  addresses: string;
}) {
  const list = await db.select(addressLists)
  if (!list) {
    throw new Error("List not found");
  }
  const newAddresses = new Set([
    ...list.addresses,
    ...addresses.split(/[\n,]/).map((address) => address.toLowerCase().trim()),
  ]);
  await db
    .update(addressLists)
    .set({ addresses: newAddresses })
    .whereId(listId);
}

export async function createListAction({
  listName,
  addresses,
}: {
  listName: string;
  addresses: string;
}) {
  await db.insert(addressLists).values({
    id: nanoid(),
    name: listName,
    addresses: new Set(
      addresses.split(/[\n,]/).map((address) => address.toLowerCase().trim())
    ),
  });
}

export async function deleteListAction({ listId }: { listId: string }) {
  await db.delete(addressLists).where(eq(addressLists.id, listId));
}

export async function renameListAction({
  listId,
  listName,
}: {
  listId: string;
  listName: string;
}) {
  await db
    .update(addressLists)
    .set({ name: listName })
    .where(eq(addressLists.id, listId));
}
