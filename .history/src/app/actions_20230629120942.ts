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
  console.log(
    addresses.split(/[\n,]/).map((address) => address.toLowerCase().trim())
  );
  try {
    await db
      .insert(addressLists)
      .values({
        id: nanoid(),
        name: listName,
        addresses: addresses
          .split(/[\n,]/)
          .map((address) => address.toLowerCase().trim()),
      })
      .execute();
  } catch (e) {
    console.log(e);
  }
}
