"use server";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { redis } from "@/lib/redis";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function toggleListFavoriteAction({
  listId,
  address,
}: {
  listId: string;
  address: string;
}) {
  const list = await db
    .select()
    .from(addressLists)
    .where(eq(addressLists.id, listId))
    .then((res) => res[0]);

  if (!list) {
    throw new Error("List not found");
  }
  const newFavorites = (list.favorites as string[]).includes(address)
    ? (list.favorites as string[]).filter((a) => a !== address)
    : [...(list.favorites as string[]), address];

  await db
    .update(addressLists)
    .set({ favorites: newFavorites })
    .where(eq(addressLists.id, listId));
}

export async function deleteAddressesFromListAction({
  listId,
  addresses,
}: {
  listId: string;
  addresses: string[];
}) {
  const list = await db
    .select()
    .from(addressLists)
    .where(eq(addressLists.id, listId))
    .then((res) => res[0]);

  if (!list) {
    throw new Error("List not found");
  }
  const newAddresses = [
    ...new Set(
      (Array.isArray(list.addresses)
        ? (list.addresses as string[])
        : []
      ).filter((address) => !addresses.includes(address)),
    ),
  ];

  const newFavorites = [
    ...new Set(
      (Array.isArray(list.favorites)
        ? (list.favorites as string[])
        : []
      ).filter((address) => !addresses.includes(address)),
    ),
  ];
  // for (const address of addresses) {
  //   await redis.del(`history_list:${address}`, `account:${address}`);
  // }

  await db
    .update(addressLists)
    .set({ addresses: newAddresses, favorites: newFavorites })
    .where(eq(addressLists.id, listId));
}

export async function addAddressesToListAction({
  listId,
  addresses,
}: {
  listId: string;
  addresses: string;
}) {
  const list = await db
    .select()
    .from(addressLists)
    .where(eq(addressLists.id, listId))
    .then((res) => res[0]);

  if (!list) {
    throw new Error("List not found");
  }
  const newAddresses = [
    ...new Set([
      ...(Array.isArray(list.addresses) ? (list.addresses as string[]) : []),
      ...addresses
        .split(/[\n,]/)
        .map((address) => address.toLowerCase().trim()),
    ]),
  ];

  await db
    .update(addressLists)
    .set({ addresses: newAddresses })
    .where(eq(addressLists.id, listId));
}

export async function createListAction({
  listName,
  addresses,
  userId: userId,
}: {
  listName: string;
  userId: string;
  addresses: string;
}) {
  await db.insert(addressLists).values({
    id: nanoid(),
    name: listName,
    userId: userId,
    addresses: [
      ...new Set(
        addresses.split(/[\n,]/).map((address) => address.toLowerCase().trim()),
      ),
    ],
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
