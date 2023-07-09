'use client';
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { listInfoAtom } from "../AddressList/atoms";
import { useMemo } from "react";

export default function TxListTab() {
  const [listInfo, setListInfo] = useAtom(listInfoAtom);

  const transactionHistoryList = useMemo(
    () =>
      listInfo.selectedRows
        .map((el: any) =>
          el.history_list.map((tx: any) => ({
            ...tx,
            owner_address: el,
          }))
        )
        .filter(Boolean)
        .flat()
        .filter((el: any) => {
          return (
            ((+el.sends?.[0]?.amount > 0 && +el.sends?.[0]?.price > 0) ||
              (+el.receives?.[0]?.amount > 0 &&
                +el.receives?.[0]?.price > 0)) &&
            el.is_scam === false
          );
        })
        .filter((el: any) => {
          // if (minTxValue) {
          //   const txValue = el.sends[0]
          //     ? el.sends[0].amount * el.sends[0].price
          //     : el.receives[0]
          //     ? el.receives[0].amount * el.receives[0].price
          //     : 0;
          //   return txValue >= +minTxValue;
          // }
          return true;
        })
        .sort((a: any, b: any) => b.time_at - a.time_at),
    [listInfo.selectedRows]
  );
  return listInfo?.selectedRows?.length ? (
    <TabsContent value="transaction">
      <Card className="p-6"></Card>
    </TabsContent>
  ) : null;
}
