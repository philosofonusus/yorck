import { Badge } from "@/components/ui/badge";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChevronLeft, CogIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { faker } from "@faker-js/faker";
import Link from "next/link";

import { ListNameInput } from "./ListNameInput";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./AddressList/data-table";
import { columns } from "./AddressList/columns";
import StatsTab from "./Tabs/StatsTab";

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
              </div>
              <div className="flex items-center gap-3">
                <Badge>{(list.addresses as string[]).length}</Badge>

                <Button
                  variant="secondary"
                  className="h-8 w-8 rounded-full p-0"
                >
                  <CogIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <StatsTab />
            <TabsContent value="portfolio">
              <Card></Card>
            </TabsContent>
            <TabsContent value="transactions">
              <Card></Card>
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent>
          <DataTable
            list={list}
            columns={columns}
            data={(list.addresses as string[]).map((address) => ({
              address,
              isFavorite: (list.favorites as string[]).includes(address),
              usd_total: faker.finance.amount(1000, 10000, 2),
              chains: ["eth"],
              winrate:
                faker.number.int({
                  min: 1,
                  max: 10,
                }) /
                faker.number.int({
                  min: 1,
                  max: 10,
                }),
              roi: faker.number.int(100),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
