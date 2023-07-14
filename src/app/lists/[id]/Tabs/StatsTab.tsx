"use client";
import { useAtom } from "jotai";
import { listInfoAtom } from "../AddressList/atoms";
import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import NetCurveChart from "@/components/net-curve-chart";
import { UTCTimestamp } from "lightweight-charts";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function StatsTab() {
  const [listInfo] = useAtom(listInfoAtom);

  return listInfo.selectedRows.length ? (
    <TabsContent data-lenis-prevent value="stats">
      <Card className="p-6">
        <div className="flex flex-col gap-2">
          <NetCurveChart
            charts={listInfo.selectedRows.map((el: any) => ({
              label: el.address,
              data: Object.entries(
                JSON.parse(el.net_curve) as {
                  [key: string]: number;
                }
              ).map(([date, value]: [string, number], idx) => ({
                time: +date as UTCTimestamp,
                value,
              })),
            }))}
          />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">total USD:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {formatter.format(
                listInfo.selectedRows
                  .map((el: any) => +el.usd_total)

                  .reduce((a: number, b: number) => a + b, 0)
              )}
            </code>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">avg ROI:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {(
                listInfo.selectedRows
                  .map((el: any) => +el.roi)
                  .reduce((a: number, b: number) => a + b, 0) /
                listInfo.selectedRows.length
              ).toFixed(1) + "%"}
            </code>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">avg W/L:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {(
                listInfo.selectedRows
                  .map((el: any) => +el.winrate)
                  .reduce((a: number, b: number) => a + b, 0) /
                listInfo.selectedRows.length
              ).toFixed(2)}
            </code>
          </div>
        </div>
      </Card>
    </TabsContent>
  ) : null;
}
