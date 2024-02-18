import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { env } from "../../../../env.mjs";
import ky from "ky";

export async function GET() {
  const lists = await db.select().from(addressLists);

  const addresses = [
    ...new Set(lists.map((list) => list.addresses as string[]).flat()),
  ];

  ky.post(
    "https://yorckufresher-production.up.railway.app/refreshAddressListData",
    {
      json: {
        addresses,
      },
      headers: {
        Authorization: env.API_TOKEN,
        "Access-Control-Allow-Origin": "*",
      },
    },
  );

  return NextResponse.json({ ok: true });
}
