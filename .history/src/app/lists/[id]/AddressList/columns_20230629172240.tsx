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
    accessorKey: "usd_total",
  },

  {
    header: "chains",
    accessorKey: "chains",
  },
];
