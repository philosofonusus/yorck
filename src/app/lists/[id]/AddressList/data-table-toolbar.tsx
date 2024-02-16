"use client";
import { Table } from "@tanstack/react-table";
import { CheckSquare, Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddAddressesDialog from "../AddAddressesDialog";
import { Toggle } from "@/components/ui/toggle";

import { listInfo } from "./state";
import { monitofresh } from "@/services/monitofresh";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAddressesFromListAction } from "@/app/_actions/list";
import { useSelector } from "@legendapp/state/react";
import { Slider } from "@/components/ui/slider";
import { useMemo } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  listId: string;
}

export const DataTableToolbar = <TData,>({
  table,
  listId,
}: DataTableToolbarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = useSelector(listInfo.selectedRows);

  const [minValue, maxValue] = useMemo(() => {
    const values = table
      .getRowModel()
      .rows.map((row) => parseFloat(row.getValue("usd_total")));
    const min = Math.min(...values);
    const max = Math.max(...values);
    return [min, max];
  }, [table]);
  const { getToken } = useAuth();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center flex-1 space-x-2">
        <Input
          placeholder="Filter addresses..."
          value={(table.getColumn("address")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("address")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <AddAddressesDialog listId={listId} />

        <Toggle
          pressed={table.getColumn("select")?.getFilterValue() === "selected"}
          onPressedChange={(value) =>
            table
              .getColumn("select")
              ?.setFilterValue(value ? "selected" : undefined)
          }
          className="flex items-center justify-center w-8 h-8 p-0"
        >
          <CheckSquare className="w-4 h-4" />
        </Toggle>

        <Toggle
          pressed={table.getColumn("select")?.getFilterValue() === "favorite"}
          onPressedChange={(value) =>
            table
              .getColumn("select")
              ?.setFilterValue(value ? "favorite" : undefined)
          }
          className="flex items-center justify-center w-8 h-8 p-0"
        >
          <Star className="w-4 h-4" />
        </Toggle>

        <div className="flex space-x-2">
          <Slider
            defaultValue={[minValue, maxValue]}
            min={minValue}
            max={maxValue}
            value={[
              (
                table.getColumn("usd_total")?.getFilterValue() as {
                  min: number;
                  max: number;
                }
              )?.min ?? 0,
              (
                table.getColumn("usd_total")?.getFilterValue() as {
                  min: number;
                  max: number;
                }
              )?.max ?? maxValue,
            ]}
            minStepsBetweenThumbs={1}
            onValueChange={([min, max]) => {
              table.getColumn("usd_total")?.setFilterValue({ min, max });
            }}
            className="w-28"
            step={maxValue / 300}
          />
          {table.getColumn("usd_total")?.getFilterValue() !== undefined && (
            <>
              <span className="text-xs text-white">
                {(
                  table.getColumn("usd_total")?.getFilterValue() as {
                    min: number;
                    max: number;
                  }
                )?.min.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }) ?? "$0.00"}
                {" - "}
                {(
                  (
                    table.getColumn("usd_total")?.getFilterValue() as {
                      min: number;
                      max: number;
                    }
                  )?.max ?? maxValue
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </>
          )}
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <div className="flex ites-center gap-2.5">
        {selectedRows.length ? (
          <>
            <Button
              variant="secondary"
              onClick={async () =>
                listInfo &&
                toast.promise(
                  monitofresh
                    .refreshAddressData(
                      selectedRows.map((row) => row!.address),
                      (await getToken()) as string,
                    )
                    .then(() => router.refresh()),
                  {
                    loading: "Syncing addresses data...",
                    success: "Addresses data synced!",
                    error: "Failed to sync addresses data",
                  },
                )
              }
            >
              Sync selected
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                listInfo &&
                  toast.promise(
                    deleteAddressesFromListAction({
                      listId,
                      addresses: selectedRows.map((row) => row!.address),
                    }).then(() => router.refresh()),
                    {
                      loading: "Deleting addresses...",
                      success: "Addresses deleted",
                      error: "Failed to delete addresses",
                    },
                  );
              }}
            >
              Delete selected
            </Button>
          </>
        ) : null}
        <Button
          variant="default"
          onClick={() =>
            table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
              ? table.resetRowSelection()
              : table.toggleAllRowsSelected()
          }
        >
          {table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
            ? `Deselect (${listInfo.selectedRows.length})`
            : "Select All"}
        </Button>
      </div>
    </div>
  );
};
