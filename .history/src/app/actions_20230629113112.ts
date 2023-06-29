async function onSubmit(values: z.infer<typeof formValidationSchema>) {
  "use server";
  const { listName, addresses } = values;

  await db.insert(addressLists).values({
    id: nanoid(),
    name: listName,
    addresses: addresses.split(/[\n,]/).map((address) => address.trim()),
  });
}
