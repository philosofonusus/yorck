import { Badge } from "@/components/ui/badge";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChevronLeft, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { ListNameInput } from "./ListNameInput";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./AddressList/data-table";
import { columns } from "./AddressList/columns";

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
          <Tabs defaultValue="stats">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Link href="/lists">
                  <ChevronLeft />
                </Link>
                <ListNameInput listId={list.id} initialListName={list.name} />
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="transactions">TX List</TabsTrigger>
                </TabsList>
                <Button className="whitespace-nowrap gap-1.5 flex ml-1.5">
                  <RefreshCcwIcon />
                  Last Synced
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Badge>{(list.addresses as string[]).length}</Badge>
              </div>
            </CardTitle>
          </Tabs>
        </CardHeader>
        <CardContent>
          <DataTable
            listId={list.id}
            columns={columns}
            data={(list.addresses as string[]).map((address) => ({
              address,
              usd_total: "1234",
              chains: ["eth"],
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
