import { Badge } from "@/components/ui/badge";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

export default async function ListPage({
  params: { id: listId },
}: {
  params: {
    id: string;
  };
}) {
  const list = await db
    .select()
    .from(addressLists)
    .where(eq(addressLists.id, listId))
    .then((res) => res[0]);

  const [listName, setListName] = useState(list.name);

  return (
    <div className="flex w-full items-center justify-center overflow-y-scroll py-6">
      <Card className="mx-6 w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link href="/lists">
                <ChevronLeft />
              </Link>
              <input
                value={list.name}
                onChange={(e) => setListName(e.target.value)}
                className="w-fit space-x-2 bg-transparent text-2xl font-semibold outline-none first-letter:uppercase"
              />
            </div>
            <div className="flex items-center gap-3">
              <Badge>{(list.addresses as string[]).length}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
