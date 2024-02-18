"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "./data-table-column-header";
import DataTableFavoriteStar from "./data-table-favorite-star";
import { balanceDataEntry } from "@/lib/validations/lists";
import { cn } from "@/lib/utils";

export type MonitoredAddress = {
  address: string;
  net_curve: string;
  isFavorite: boolean;
  usd_total: string;
  history_list: string;
  balances: string;
  chains: string[];
  stableCoinTotal: number;
  winrate: number;
  roi: number;
};

export const columns: ColumnDef<MonitoredAddress>[] = [
  {
    accessorKey: "select",
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      return row.original.isFavorite ? (
        <DataTableFavoriteStar address={row.getValue("address")} />
      ) : (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },

    enableSorting: false,
    enableHiding: false,
    filterFn: (row, _, value) => {
      if (value === "selected") {
        return row.getIsSelected();
      }
      if (value === "favorite") {
        return row.original.isFavorite;
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
      <DataTableColumnHeader column={column} title="W/L ratio" />
    ),
    accessorKey: "winrate",
    cell: ({ row }) => {
      return (
        <span className="w-20 space-x-2">
          {(row.getValue("winrate") as number).toFixed(2)}
        </span>
      );
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ROI" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("roi"));
      return <span className="w-20 space-x-2">{amount.toFixed(1)}%</span>;
    },
    accessorKey: "roi",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stablecoins" />
    ),
    cell: ({ row }) => {
      const stableCoinTotal = row.getValue("stableCoinTotal") as number;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(stableCoinTotal);
      const usdTotal = parseFloat(row.getValue("usd_total"));

      return (
        <span className="w-20 space-x-2">
          {formatted}{" "}
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
        </span>
      );
    },
    accessorKey: "STCR",
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
      return <span className="w-20 space-x-2">{formatted}</span>;
    },
    filterFn: (row, _, value) => {
      if (value) {
        const min = value.min;
        const max = value.max;
        const amount = parseFloat(row.getValue("usd_total"));
        return amount >= min && amount <= max;
      }
      return true;
    },
    accessorKey: "usd_total",
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
