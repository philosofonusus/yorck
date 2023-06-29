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
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter addresses..."
          value={(table.getColumn("address")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("address")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Toggle
          pressed={(table.getColumn("checked")?.getFilterValue() as boolean) ?? "false"}
          onPressedChange={setIsSelectedOnly}
          className="h-8 w-8 p-0 flex items-center justify-center"
        >
          <CheckSquare className="h-4 w-4" />
        </Toggle>
        <AddAddressesDialog listId={listId} />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
