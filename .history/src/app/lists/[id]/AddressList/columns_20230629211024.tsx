"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "./data-table-column-header";

export type MonitoredAddress = {
  usd_total: string;
  address: string;
  //   dex_roi: {
  //     uniswap: string;
  //     total: string;
  //   };
  chains: string[];
};

export const columns: ColumnDef<MonitoredAddress>[] = [
  {
    accessorKey: "select",
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, _, value) => {
      if (JSON.parse(value)) {
        return row.getIsSelected();
      }
      return true;
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    accessorKey: "address",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return <span className="space-x-2 w-fit">{row.getValue("address")}</span>;
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="USD Total" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("usd_total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <span className="space-x-2 w-20">{formatted}</span>;
    },
    accessorKey: "usd_total",
  },
  {
    id: "actions",
    cell: ({ row,  }) => <DataTableRowActions row={row} />,
  },
];
