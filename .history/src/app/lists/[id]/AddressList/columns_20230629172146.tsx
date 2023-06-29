import { ColumnDef } from "@tanstack/react-table";

export type MonitoredAddress = {
  usd_total: string;
  address: string;
  dex_roi: {
    uniswap: string;
    total_dex: string;
  };
  chains: string[];
};


export 