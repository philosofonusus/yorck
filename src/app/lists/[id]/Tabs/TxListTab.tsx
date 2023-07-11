"use client";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { listInfoAtom } from "../AddressList/atoms";

export default function TxListTab() {
  const [listInfo] = useAtom(listInfoAtom);

  return listInfo?.selectedRows?.length ? (
    <TabsContent value="transaction">
      <Card className="p-6"></Card>
    </TabsContent>
  ) : null;
}
