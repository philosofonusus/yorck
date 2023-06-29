"use client";

import { Table } from "@tanstack/react-table";
import { CogIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddAddressesDialog from "../AddAddressesDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  listId: string;
}

export function DataTableToolbar<TData>({
  table,
  listId,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

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
      <div className="flex items-center space-x-2">
        <Switch checked={true} id="selected-mode" />
        <Label htmlFor="selected-mode">Selected Only</Label>
      </div>
    </div>
  );
}
