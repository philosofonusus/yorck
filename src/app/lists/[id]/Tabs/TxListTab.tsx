"use client";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { selectedRowsAtom } from "../AddressList/atoms";
import { useMemo } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { chainList } from "@/lib/chainlist";
import {
  bulkCexLookup,
  bulkProjectLookup,
  bulkTokenLookup,
} from "@/app/_actions/dictionary";
import { useAsyncMemo } from "@/lib/use-async-memo";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const TxEntry = ({
  tx,
  dictionary,
}: {
  tx: any;
  dictionary: {
    [key: string]: any;
  };
}) => {
  const [_, copy] = useCopyToClipboard();
  return (
    <div className="flex items-center justify-between w-full py-5 border-b border-b-accent last-of-type:border-none">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold">
          {new Date(+((tx.time_at as string) + "000")).toLocaleString("en-GB")}
        </span>
        <div className="flex items-center gap-1">
          <Image
            src={chainList.find((elx) => elx.id === tx.chain)!.logo_url}
            width={16}
            alt={tx.chain}
            height={16}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-left">
                <span className="font-semibold cursor-pointer">
                  {tx.id.slice(0, 6) + "..." + tx.id.slice(-4)}
                </span>
              </TooltipTrigger>
              <TooltipContent
                className="cursor-pointer"
                onClick={() => {
                  copy(tx.id);
                  toast.success("Copied to clipboard");
                }}
              >
                {tx.id}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex flex-col">
        {tx.sends
          ?.filter((elx: any) => dictionary?.[elx?.token_id] && elx.price > 0)
          .map((ely: any, idx: number) => {
            return (
              <div key={idx} className="flex items-center gap-2">
                -{" "}
                {dictionary[ely.token_id].logo_url ? (
                  <Image
                    src={dictionary[ely.token_id].logo_url}
                    width={16}
                    alt={ely.token_id}
                    height={16}
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-accent" />
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-left">
                      <span className="font-semibold cursor-pointer">
                        {dictionary[tx.token_id]?.optimized_symbol}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      className="cursor-pointer"
                      onClick={() => {
                        copy(tx.token_id);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      {tx.token_id}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>
                  {tx.amount} ({formatter.format(tx.price * tx.amount)})
                </span>
              </div>
            );
          })}
        {tx.receives
          ?.filter((elx: any) => dictionary?.[elx?.token_id] && elx.price > 0)
          .map((ely: any, idx: number) => {
            return (
              <div key={idx} className="flex items-center gap-2">
                +{" "}
                {dictionary[ely.token_id].logo_url ? (
                  <Image
                    src={dictionary[ely.token_id].logo_url}
                    width={16}
                    alt={ely.token_id}
                    height={16}
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-accent" />
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-left">
                      <span className="font-semibold cursor-pointer">
                        {dictionary[ely.token_id].optimized_symbol}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      className="cursor-pointer"
                      onClick={() => {
                        copy(ely.token_id);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      {ely.token_id}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>
                  {ely.amount} ({formatter.format(ely.price * ely.amount)})
                </span>
              </div>
            );
          })}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-semibold">
          Owner:{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-left">
                <span className="font-semibold cursor-pointer">
                  {tx.owner_address.slice(0, 6) +
                    "..." +
                    tx.owner_address.slice(-4)}
                </span>
              </TooltipTrigger>
              <TooltipContent
                className="cursor-pointer"
                onClick={() => {
                  copy(tx.owner_address);
                  toast.success("Copied to clipboard");
                }}
              >
                {tx.owner_address}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
        <span className="font-semibold">
          From:{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-left">
                <span className="font-semibold cursor-pointer">
                  {tx.tx?.from_addr.slice(0, 6) +
                    "..." +
                    tx.tx?.from_addr.slice(-4)}
                </span>
              </TooltipTrigger>
              <TooltipContent
                className="cursor-pointer"
                onClick={() => {
                  copy(tx.tx?.from_addr);
                  toast.success("Copied to clipboard");
                }}
              >
                {tx.tx?.from_addr}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
        <span className="font-semibold">
          To:{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-left">
                <span className="font-semibold cursor-pointer">
                  {tx.tx?.to_addr.slice(0, 6) +
                    "..." +
                    tx.tx?.to_addr.slice(-4)}
                </span>
              </TooltipTrigger>
              <TooltipContent
                className="cursor-pointer"
                onClick={() => {
                  copy(tx.tx?.to_addr);
                  toast.success("Copied to clipboard");
                }}
              >
                {tx.tx?.to_addr}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground">{tx.tx?.name}</span>
        {tx?.project_id ? (
          <div className="flex items-center gap-2">
            <Image
              src={dictionary?.[tx.project_id]?.logo_url}
              width={24}
              alt={dictionary?.[tx.project_id]?.name}
              height={24}
            />
            <a
              href={dictionary?.[tx.project_id]?.site_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white"
            >
              {dictionary[tx.project_id]?.name} (
              {dictionary[tx.project_id]?.chain})
            </a>
          </div>
        ) : (
          <></>
        )}
        {tx?.cex_id ? (
          <div className="flex items-center gap-2">
            <Image
              src={dictionary?.[tx.cex_id]?.logo_url}
              width={24}
              alt={dictionary?.[tx.cex_id]?.name}
              height={24}
            />
            <span className="font-semibold text-white">
              {dictionary?.[tx.cex_id]?.name}
            </span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default function TxListTab() {
  const [selectedRows] = useAtom(selectedRowsAtom);

  const minTxValue = 0;
  const isHideTrashTransactionsModeActive = true;

  const transactionHistoryList = useMemo(
    () =>
      selectedRows
        .map((el: any) =>
          JSON.parse(el.history_list).map((tx: any) => ({
            ...tx,
            owner_address: el.address,
          }))
        )
        .filter(Boolean)
        .flat()
        .filter((el: any) => {
          if (isHideTrashTransactionsModeActive) {
            return (
              ((+el.sends?.[0]?.amount > 0 && +el.sends?.[0]?.price > 0) ||
                (+el.receives?.[0]?.amount > 0 &&
                  +el.receives?.[0]?.price > 0)) &&
              el.is_scam === false
            );
          }
          return true;
        })
        .filter((el: any) => {
          if (minTxValue) {
            const txValue = el.sends[0]
              ? el.sends[0].amount * el.sends[0].price
              : el.receives[0]
              ? el.receives[0].amount * el.receives[0].price
              : 0;
            return txValue >= +minTxValue;
          }
          return true;
        })
        .sort((a: any, b: any) => b.time_at - a.time_at),
    [selectedRows, isHideTrashTransactionsModeActive, minTxValue]
  );

  const dictionary = useAsyncMemo(async () => {
    return Object.assign(
      {},
      ...(await Promise.allSettled([
        bulkCexLookup([
          ...new Set(
            transactionHistoryList.map((el: any) => el.cex_id).filter(Boolean)
          ),
        ] as string[]),
        bulkProjectLookup([
          ...new Set(
            transactionHistoryList
              .map((el: any) => el.project_id)
              .filter(Boolean)
          ),
        ] as string[]),
        bulkTokenLookup([
          ...new Set(
            transactionHistoryList
              .map((el: any) =>
                [
                  ...el.receives?.map((elx: any) => elx.token_id),
                  ...el.sends?.map((elx: any) => elx.token_id),
                ].filter(Boolean)
              )
              .flat()
          ),
        ] as string[]),
        //@ts-ignore
      ]).then((res) => res.map((el) => el.value)))
    );
  }, [transactionHistoryList]);

  return selectedRows.length ? (
    <TabsContent data-lenis-prevent value="transactions">
      <Card className="p-6 overflow-y-scroll max-h-[400px]">
        {transactionHistoryList.map((tx: any, idx: number) => {
          return <TxEntry dictionary={dictionary} tx={tx} key={idx} />;
        })}
      </Card>
    </TabsContent>
  ) : null;
}
