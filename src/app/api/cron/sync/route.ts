import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { monitofresh } from "@/services/monitofresh";
import { NextResponse } from "next/server";
import { env } from "../../../../../env.mjs";

export async function GET() {
  const lists = await db.select().from(addressLists);
  const addresses = lists.map((list) => list.addresses as string[]).flat();
  await monitofresh.refreshAddressData(addresses, env.API_TOKEN);
  return NextResponse.json({ ok: true });
}
