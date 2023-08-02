import { Badge } from "@/components/ui/badge";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { ChevronLeft, CogIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListNameInput } from "./ListNameInput";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./AddressList/data-table";
import { columns } from "./AddressList/columns";
import StatsTab from "./Tabs/StatsTab";
import { redis } from "@/lib/redis";
import { statsCalculator } from "@/lib/statsCalculator";
import PortfolioTab from "./Tabs/PortfolioTab";
import TxListTab from "./Tabs/TxListTab";
import { currentUser } from "@clerk/nextjs";
import z from "zod";
import { redirect, notFound } from "next/navigation";
import { accountDataSchema, txDataSchema } from "@/lib/validations/lists";

const listDataSchema = z.record(
  z.string(),
  z.object({
    account: accountDataSchema,
    history_list: z.array(txDataSchema),
  })
);

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
    return notFound();
  }
  const data = listDataSchema.parse(
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
  );
  return (
    <div className="flex items-center justify-center w-full py-6 overflow-y-scroll">
      <Card className="w-full mx-6">
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
                  className="w-8 h-8 p-0 rounded-full"
                >
                  <CogIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
            <StatsTab />
            <PortfolioTab />
            <TxListTab />
          </Tabs>
        </CardHeader>
        <CardContent>
          <DataTable
            list={list}
            columns={columns}
            data={Object.keys(data).map((address) => {
              const addressData = data[address];
              let winrate = 0;
              let roi = 0;

              if (addressData.history_list) {
                const _result = statsCalculator(addressData.history_list);
                winrate = _result.winrate;
                roi = _result.roi;
              }

              return {
                address,
                net_curve: JSON.stringify(addressData.account.net_curve),
                isFavorite: (list.favorites as string[]).includes(address),
                usd_total: addressData.account.usd_total.toString(),
                history_list: JSON.stringify(addressData.history_list),
                balances: JSON.stringify(addressData.account.balances),
                chains: addressData.account.used_chains,
                winrate,
                roi,
              };
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
