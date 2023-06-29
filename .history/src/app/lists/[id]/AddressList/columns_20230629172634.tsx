import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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
    header: "Address",
    accessorKey: "address",
  },
  {
    header: "USD Total",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    }
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("usd_total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
    accessorKey: "usd_total",
  },
];
