async function createListAction({ listName, addresses }: { listName: string }) {
  await db.insert(addressLists).values({
    id: nanoid(),
    name: listName,
    addresses: addresses.split(/[\n,]/).map((address) => address.trim()),
  });
}
