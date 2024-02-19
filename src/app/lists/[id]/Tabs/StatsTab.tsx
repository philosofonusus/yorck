"use client";
import NetCurveChart from "@/components/net-curve-chart";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSelector } from "@legendapp/state/react";
import { useControls } from "leva";
import { UTCTimestamp } from "lightweight-charts";
import { useMemo } from "react";
import { listInfo } from "../AddressList/state";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function StatsTab() {
  const selectedRows = useSelector(listInfo.selectedRows);
  const { traderMode } = useControls({
    traderMode: false,
  });

  const usdTotal = useMemo(() => {
    const res = selectedRows
      .map((el) => +el!.usd_total)
      .reduce((a: number, b: number) => a + b, 0);
    return res;
  }, [selectedRows]);

  const stableCoinTotal = useMemo(() => {
    const res = selectedRows
      .map((el) => el?.stableCoinTotal as number)
      .reduce((a: number, b: number) => a + b, 0);
    return res;
  }, [selectedRows]);

  return selectedRows.length ? (
    <TabsContent data-lenis-prevent value="stats">
      <Card className="p-6">
        <div className="flex flex-col gap-2">
          <NetCurveChart
            charts={selectedRows.map((el) => ({
              label: el!.address,
              data: Object.entries(
                JSON.parse(el!.net_curve) as Record<string, number>,
              ).map(([date, value], idx) => ({
                time: +date as UTCTimestamp,
                value,
              })),
            }))}
          />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">total USD:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {formatter.format(usdTotal)}
            </code>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">stable coin ratio:</span>
            <code
              className={cn(
                "relative rounded px-[0.3rem] bg-destructive bg-green-500 py-[0.2rem] font-mono text-sm",
                isFinite(usdTotal / stableCoinTotal) &&
                  (stableCoinTotal / usdTotal) * 100 > 1
                  ? usdTotal / stableCoinTotal > 2
                    ? "bg-green-500"
                    : "bg-destructive"
                  : "bg-muted",
              )}
            >
              {(stableCoinTotal / usdTotal) * 100 > 1
                ? isFinite(usdTotal / stableCoinTotal)
                  ? "1/" + (usdTotal / stableCoinTotal).toFixed(2)
                  : "N/A"
                : "<1%"}
            </code>
          </div>
          {traderMode ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">avg ROI:</span>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {(
                    selectedRows
                      .map((el) => +el!.roi)
                      .reduce((a: number, b: number) => a + b, 0) /
                    selectedRows.length
                  ).toFixed(1) + "%"}
                </code>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">avg W/L:</span>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {(
                    selectedRows
                      .map((el) => +el!.winrate)
                      .reduce((a: number, b: number) => a + b, 0) /
                    selectedRows.length
                  ).toFixed(2)}
                </code>
              </div>
            </>
          ) : null}
        </div>
      </Card>
    </TabsContent>
  ) : null;
}
