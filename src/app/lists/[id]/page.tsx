import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { redis } from "@/lib/redis";
import { statsCalculator } from "@/lib/statsCalculator";
import { accountDataSchema, txDataSchema } from "@/lib/validations/lists";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import z from "zod";
import { columns } from "./AddressList/columns";
import { DataTable } from "./AddressList/data-table";
import { LevaCog } from "./LevaCog";
import { ListNameInput } from "./ListNameInput";
import PortfolioTab from "./Tabs/PortfolioTab";
import StatsTab from "./Tabs/StatsTab";
import TxListTab from "./Tabs/TxListTab";

const listDataSchema = z.record(
  z.string(),
  z.object({
    account: accountDataSchema,
    history_list: z.array(txDataSchema),
  }),
);

export default async function ListPage({
  params: { id: listId },
}: {
  params: {
    id: string;
  };
}) {
  console.time("ssr");
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

  console.time("data");
  const data = listDataSchema.parse(
    Object.assign(
      {},
      ...(await Promise.all(
        (list.addresses as string[]).map(async (address) => {
          const [account, history_list] = await Promise.all([
            redis.get(`account:${address}`),
            redis.get(`history_list:${address}`),
          ]);

          return {
            [address]: {
              account,
              history_list,
            },
          };
        }),
      )),
    ),
  );
  console.timeEnd("data");
  console.timeEnd("ssr");

  return (
    <div className="container flex items-center justify-center w-full py-6 overflow-y-scroll">
      <Card className="w-full">
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
                <LevaCog />
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
                stableCoinTotal: addressData.account.balances
                  .filter((el) => new RegExp(/USD|DAI/, "g").test(el.symbol))
                  .map((el: any) => {
                    return el.amount * el.price;
                  })
                  .reduce((a: number, b: number) => a + b, 0),
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
