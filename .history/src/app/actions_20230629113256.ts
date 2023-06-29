async function createListAction({ listName, }: {
    listName: string;

}) {
  const { listName, addresses } = values;

  await db.insert(addressLists).values({
    id: nanoid(),
    name: listName,
    addresses: addresses.split(/[\n,]/).map((address) => address.trim()),
  });
}
