import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { env } from "../../../../env.mjs";
import ky from "ky";

export const dynamic = "force-dynamic";

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
      timeout: false,
      headers: {
        Authorization: env.API_TOKEN,
      },
    },
  );

  return NextResponse.json({ ok: true });
}
