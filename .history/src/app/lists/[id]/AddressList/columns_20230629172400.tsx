import { ColumnDef } from "@tanstack/react-table";

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
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
    accessorKey: "usd_total",
  },
];
