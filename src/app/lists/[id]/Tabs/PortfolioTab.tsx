"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { selectedRowsAtom } from "../AddressList/atoms";
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
  const selectedRows = useAtomValue(selectedRowsAtom);
  const [_, copy] = useCopyToClipboard();

  const totalPortfolio = useMemo(
    () =>
      selectedRows.length
        ? selectedRows
            .map((el: any) => JSON.parse(el.balances))
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
    [selectedRows]
  );

  return totalPortfolio.length ? (
    <TabsContent data-lenis-prevent value="portfolio">
      <Card className="flex flex-wrap gap-4 p-6">
        {totalPortfolio.map((el: any, idx: number) => {
          return (
            <div key={idx} className="flex items-center gap-2">
              <Avatar className="w-10 h-10 bg-white">
                <AvatarImage src={el.logo_url} alt={el.symbol} />
                <AvatarFallback>{el.symbol.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger className="text-left">
                      <span className="text-sm font-semibold cursor-pointer text-muted-foreground">
                        {el.optimized_symbol} ({el.chain})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      className="cursor-pointer"
                      onClick={() => {
                        copy(el.id);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      {el.id}
                    </TooltipContent>
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
