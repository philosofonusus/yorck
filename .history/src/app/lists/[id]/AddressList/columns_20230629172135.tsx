import { ColumnDef } from "@tanstack/react-table";

export type MonitoredAddress = {
  usd_total: string;
  address: string;
  roi: {
    uniswap: string;
  }
  chains: string[];
};


export 