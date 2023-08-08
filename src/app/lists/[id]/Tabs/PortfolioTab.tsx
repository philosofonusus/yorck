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
import { Badge } from "@/components/ui/badge";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { balanceDataEntry } from "@/lib/validations/lists";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
            .flatMap((el) =>
              (
                JSON.parse(el.balances) as Array<
                  balanceDataEntry & { owner: string; hits: string[] }
                >
              ).map((b) => {
                b.owner = el.address;
                b.hits = [b.owner];
                return b;
              })
            )
            .filter((el) => el.price! && el.price * el.amount > 500)
            .sort((a, b) => b.price! * b.amount - a.price! * a.amount)
            .reduce(function (
              accumulator: Array<
                balanceDataEntry & { hits: string[]; owner: string }
              >,
              cur
            ) {
              const id = cur.id,
                found = accumulator.find(function (el) {
                  return el.id == id;
                });
              if (found) {
                found.amount += cur.amount;
                found.hits.push(cur.owner);
              } else accumulator.push(cur);
              return accumulator;
            },
            [])
        : [],
    [selectedRows]
  );

  return totalPortfolio.length ? (
    <TabsContent data-lenis-prevent value="portfolio">
      <Card className="flex flex-wrap gap-4 p-6">
        {totalPortfolio.map((el, idx: number) => {
          return (
            <Card key={idx} className="flex items-center gap-2 p-2.5">
              <div className="relative">
                <Avatar className="w-10 h-10 bg-white">
                  <AvatarImage src={el.logo_url ?? ""} alt={el.symbol} />

                  <AvatarFallback>{el.symbol.toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-1">
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <div className="flex items-center flex-row gap-1.5">
                      <TooltipTrigger className="text-left">
                        <span className="text-sm font-semibold cursor-pointer text-muted-foreground">
                          {el.optimized_symbol} ({el.chain})
                        </span>
                      </TooltipTrigger>
                      <Popover>
                        <PopoverTrigger>
                          <Badge className="h-4 px-2 mt-1">
                            {el.hits?.length || 1}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-0">
                          <ScrollArea className="w-full h-72">
                            <div className="p-4">
                              <h4 className="mb-4 text-sm font-medium leading-none">
                                Owners
                              </h4>
                              {el.hits?.map((address) => (
                                <>
                                  <div className="text-sm" key={address}>
                                    {address.slice(0, 6) +
                                      "..." +
                                      address.slice(-4)}
                                  </div>
                                  <Separator className="my-2" />
                                </>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>
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
                  {formatter.format(el.price! * el.amount)}
                </span>
              </div>
            </Card>
          );
        })}
      </Card>
    </TabsContent>
  ) : null;
};

export default PortfolioTab;
