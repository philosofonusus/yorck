export default async function AddressLists() {
  const data = await db.select().from("lists").all();
}
