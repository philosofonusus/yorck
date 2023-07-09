"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { listInfoAtom } from "../AddressList/atoms";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useCopyToClipboard } from "usehooks-ts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMemo } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PortfolioTab: React.FC = () => {
  const [listInfo, setListInfo] = useAtom(listInfoAtom);
  const [value, copy] = useCopyToClipboard();

  const totalPortfolio = useMemo(
    () =>
      listInfo?.selectedRows
        ? listInfo.selectedRows
            .map((el: any) => el?.balances)
            .filter(Boolean)
            .flat()
            .filter((el: any) => el.price * el.amount > 500)
            .sort((a: any, b: any) => b.price * b.amount - a.price * a.amount)
            .reduce(function (accumulator: any, cur: any) {
              const id = cur.id,
                found = accumulator.find(function (el: any) {
                  return el.id == id;
                });
              if (found) found.amount += cur.amount;
              else accumulator.push(cur);
              return accumulator;
            }, [])
        : [],
    [listInfo?.selectedRows]
  );

  return listInfo?.selectedRows?.length ? (
    <TabsContent value="portfolio">
      <Card className="p-6 flex flex-wrap gap-4">
        {totalPortfolio.map((el: any, idx: number) => {
          return (
            <div key={idx} className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={el.logo_url} alt={el.logo_symbol} />
                <AvatarFallback>{el.logo_symbol.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-left">
                      <span
                        onClick={() => {
                          copy(el.id);
                          toast.success("Copied to clipboard");
                        }}
                        className="cursor-pointer text-sm font-semibold text-muted-foreground"
                      >
                        {el.optimized_symbol} ({el.chain})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{el.id}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <span className="text-sm font-semibold">
                  {formatter.format(el.price * el.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </Card>
    </TabsContent>
  ) : null;
};

export default PortfolioTab;
