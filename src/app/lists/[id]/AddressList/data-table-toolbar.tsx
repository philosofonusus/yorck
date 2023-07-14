"use client";

import { Table } from "@tanstack/react-table";
import { CheckSquare, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddAddressesDialog from "../AddAddressesDialog";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  listId: string;
}

export function DataTableToolbar<TData>({
  table,
  listId,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isSelectedOnly, setIsSelectedOnly] = useState(false);

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
    </div>
  );
}
