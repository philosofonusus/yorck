import { Badge } from "@/components/ui/badge";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { ChevronLeft, CogIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { ListNameInput } from "./ListNameInput";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./AddressList/data-table";
import { columns } from "./AddressList/columns";
import StatsTab from "./Tabs/StatsTab";
import { redis } from "@/lib/redis";
import { statsCalculator } from "@/lib/statsCalculator";
import PortfolioTab from "./Tabs/PortfolioTab";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ListPage({
  params: { id: listId },
}: {
  params: {
    id: string;
  };
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/signin");
  }

  const list = await db
    .select()
    .from(addressLists)
    .where(and(eq(addressLists.id, listId), eq(addressLists.userId, user.id)))
    .then((res) => res[0]);

  if (!list) {
    return <div>404</div>;
  }
  const data = new Map(
    Object.entries(
      Object.assign(
        {},
        ...(await Promise.allSettled(
          (list.addresses as string[]).map(async (address) => {
            return {
              [address]: {
                account: await redis.get(`account:${address}`),
                history_list: await redis.get(`history_list:${address}`),
              },
            };
          })
        ).then((res) => res.map((r: any) => r.value)))
      )
    )
  );

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
            {/*@ts-ignore*/}
            <PortfolioTab data={data} />
            <TabsContent value="transactions">
              <Card></Card>
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent>
          <DataTable
            list={list}
            columns={columns}
            data={(list.addresses as string[])
              .map((address) => {
                const addressData = data.get(address);
                let winrate = 0;
                let roi = 0;
                //@ts-ignore
                if (addressData?.history_list) {
                  //@ts-ignore
                  const _result = statsCalculator(addressData?.history_list);
                  winrate = _result.winrate;
                  roi = _result.roi;
                }
                return {
                  address,
                  isFavorite: (list.favorites as string[]).includes(address),
                  //@ts-ignore
                  usd_total: addressData?.account?.usd_total,
                  //@ts-ignore
                  history_list: addressData?.history_list,
                  chains: ["eth"],
                  winrate,
                  roi,
                };
              })
              .filter(Boolean)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
