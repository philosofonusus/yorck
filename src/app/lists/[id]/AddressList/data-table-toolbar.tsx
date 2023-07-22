"use client";
import { Table } from "@tanstack/react-table";
import { CheckSquare, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddAddressesDialog from "../AddAddressesDialog";
import { Toggle } from "@/components/ui/toggle";
import { useAtom } from "jotai";
import { listInfoAtom } from "./atoms";
import { monitofresh } from "@/services/monitofresh";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAddressesFromListAction } from "@/app/_actions/list";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  listId: string;
}

export function DataTableToolbar<TData>({
  table,
  listId,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [listInfo] = useAtom(listInfoAtom);

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
          pressed={
            (table.getColumn("select")?.getFilterValue() as boolean) ?? false
          }
          onPressedChange={(value) =>
            table.getColumn("select")?.setFilterValue(value ? true : undefined)
          }
          className="flex items-center justify-center w-8 h-8 p-0"
        >
          <CheckSquare className="w-4 h-4" />
        </Toggle>

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
        {listInfo.selectedRows.length ? (
          <>
            <Button
              variant="secondary"
              onClick={async () =>
                listInfo &&
                toast.promise(
                  monitofresh
                    .refreshAddressData(
                      listInfo.selectedRows.map((row: any) => row.address),
                      await getToken()
                    )
                    .then(() => router.refresh()),
                  {
                    loading: "Syncing addresses data...",
                    success: "Addresses data synced!",
                    error: "Failed to sync addresses data",
                  }
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
                      listId: listInfo.id,
                      addresses: listInfo.selectedRows.map(
                        (row: any) => row.address
                      ),
                    }).then(() => router.refresh()),
                    {
                      loading: "Deleting addresses...",
                      success: "Addresses deleted",
                      error: "Failed to delete addresses",
                    }
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
}
