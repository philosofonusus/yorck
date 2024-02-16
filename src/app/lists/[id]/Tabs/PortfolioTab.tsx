"use client";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { listInfo, tableData } from "../AddressList/state";
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
import { useSelector } from "@legendapp/state/react";
import { useControls, folder } from "leva";
import { useRouter } from "next/navigation";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PortfolioTab: React.FC = () => {
  const selectedRows = useSelector(listInfo.selectedRows);
  const table = useSelector(tableData);
  const [_, copy] = useCopyToClipboard();
  const router = useRouter();

  const { minAmount } = useControls("Portfolio", {
    balances: folder({
      minAmount: 500,
    }),
  });

  const totalPortfolio = useMemo(
    () =>
      selectedRows.length
        ? selectedRows
            .flatMap((el) =>
              (
                JSON.parse(el!.balances) as Array<
                  balanceDataEntry & {
                    owner: string;
                    hits: {
                      address: string;
                      amount: number;
                    }[];
                  }
                >
              ).map((b) => {
                b.owner = el!.address;
                b.hits = [
                  {
                    amount: b.amount,
                    address: b.owner,
                  },
                ];
                return b;
              }),
            )
            .reduce(function (
              accumulator: Array<
                balanceDataEntry & {
                  hits: {
                    address: string;
                    amount: number;
                  }[];
                  owner: string;
                }
              >,
              cur,
            ) {
              const id = cur.id,
                found = accumulator.find(function (el) {
                  return el.id == id;
                });
              if (found) {
                found.amount += cur.amount;
                found.hits.push({
                  address: cur.owner,
                  amount: cur.amount,
                });
              } else accumulator.push(cur);
              return accumulator;
            }, [])
            .filter((el) => el.price! && el.price * el.amount > minAmount)
            .sort(
              (a, b) =>
                b.price! * b.amount -
                a.price! * a.amount -
                (b.price! * b.amount - a.price! * a.amount),
            )
        : [],
    [selectedRows, minAmount],
  );

  return totalPortfolio.length ? (
    <TabsContent data-lenis-prevent value="portfolio">
      <Card className="flex flex-wrap gap-4 p-6">
        {totalPortfolio.map((el, idx) => {
          return (
            <Card key={el.id + idx} className="flex items-center gap-2 p-2.5">
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
                                Holders
                              </h4>
                              {el.hits
                                ?.sort((a, b) => b.amount - a.amount)
                                .map((hit, idx) => (
                                  <>
                                    <div
                                      className="flex items-center cursor-pointer justify-between"
                                      onClick={() => {
                                        table
                                          ?.getColumn("address")
                                          ?.setFilterValue(hit.address);
                                        const tableElement =
                                          document.getElementById(
                                            "address-list",
                                          );
                                        if (tableElement) {
                                          window.scrollTo({
                                            top: tableElement?.getBoundingClientRect()
                                              .top,
                                            behavior: "smooth",
                                          });
                                        }
                                        copy(hit.address);
                                        toast.success("Copied to clipboard");
                                      }}
                                      key={hit.address + idx}
                                    >
                                      <span className="text-sm">
                                        {hit.address.slice(0, 6) +
                                          "..." +
                                          hit.address.slice(-4)}
                                      </span>
                                      <span className="text-sm">
                                        {(
                                          (hit.amount / el.amount) *
                                          100
                                        ).toFixed(2)}
                                        %
                                      </span>
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
