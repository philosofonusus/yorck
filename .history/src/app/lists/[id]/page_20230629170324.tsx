import { Badge } from "@/components/ui/badge";
import { CardHeader, Card, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";

import Link from "next/link";

import { ListNameInput } from "./ListNameInput";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

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
        <Tabs>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Link href="/lists">
                  <ChevronLeft />
                </Link>
                <ListNameInput listId={list.id} initialListName={list.name} />
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex items-center gap-3">
                <Badge>{(list.addresses as string[]).length}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
        </Tabs>
      </Card>
    </div>
  );
}
