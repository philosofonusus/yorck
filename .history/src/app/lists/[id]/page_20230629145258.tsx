import { Badge } from "@/components/ui/badge";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { ListNameInput } from "./ListNameInput";

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

  if (!list) {
    return <div>404</div>;
  }

  return (
    <div className="flex w-full items-center justify-center overflow-y-scroll py-6">
      <Card className="mx-6 w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link href="/lists">
                <ChevronLeft />
              </Link>
              <ListNameInput listId={list.id} initialListName={list.name} />
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
