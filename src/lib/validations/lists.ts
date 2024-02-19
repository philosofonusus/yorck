import z from "zod";
import { chainList } from "../chainlist";

export function fallback<T extends z.Schema<any>>(
  schema: T,
  value: z.infer<T>,
) {
  return z.any().transform((val) => {
    const safe = schema.safeParse(val);
    return safe.success ? safe.data : value;
  });
}

export const balanceDataEntrySchema = z.object({
  amount: z.number(),
  balance: z.number().optional(),
  chain: z.enum(["eth", ...chainList.map((chain) => chain.id)]),
  credit_score: z.number().optional(),
  decimals: z.number(),
  display_symbol: z.string().nullable(),
  id: z.string(),
  is_core: fallback(z.boolean(), false),
  is_verified: fallback(z.boolean(), false),
  is_wallet: fallback(z.boolean(), false),
  logo_url: z.string().nullable(),
  name: fallback(z.string(), "None"),
  optimized_symbol: z.string().nullable(),
  price: z.number().nullable(),
  price_24h_change: z.number().nullable().optional(),
  protocol_id: z.string(),
  symbol: z.string(),
  time_at: z.number().nullable(),
  raw_amount_hex_str: z.string(),
  raw_amount: z.number(),
  raw_amount_str: z.string(),
});

export const tokenDataSchema = z.object({
  amount: z.number(),
  balance: z.number(),
  chain: z.enum(["eth", ...chainList.map((chain) => chain.id)]),
  credit_score: z.number().optional(),
  decimals: z.number(),
  display_symbol: z.string().nullable(),
  id: z.string(),
  is_core: z.boolean(),
  is_suspicious: z.boolean(),
  is_scam: z.boolean(),
  is_verified: fallback(z.boolean(), false),
  is_wallet: z.boolean(),
  logo_url: z.string().nullable(),
  name: z.string(),
  optimized_symbol: z.string().nullable(),
  price: z.number().nullable(),
  price_24h_change: z.number().nullable().optional(),
  protocol_id: z.string(),
  symbol: z.string(),
  time_at: z.number(),
});

export const cexDataSchema = z.any();

export const projectDataSchema = z.object({
  chain: z.enum(["eth", ...chainList.map((chain) => chain.id)]),
  name: z.string(),
  id: z.string(),
  site_url: z.string().nullable(),
  logo_url: z.string().nullable(),
});

export const accountDataSchema = z.object({
  usd_total: z.number(),
  used_chains: z.array(z.enum(["eth", ...chainList.map((chain) => chain.id)])),
  net_curve: z.record(z.string(), z.number()),
  balances: z.array(balanceDataEntrySchema),
});

export const txDataSchema = z.object({
  cate_id: z.string().nullable(),
  cex_id: z.string().nullable(),
  chain: z.enum(["eth", ...chainList.map((chain) => chain.id)]),
  id: z.string(),
  is_scam: z.boolean(),
  other_addr: fallback(z.string(), "None"),
  project_id: z.string().nullable(),
  receives: z.array(
    z.object({
      amount: z.number(),
      price: z.number().nullable().optional(),
      from_addr: z.string(),
      token_id: z.string(),
    }),
  ),
  sends: z.array(
    z.object({
      amount: z.number(),
      price: z.number().nullable().optional(),
      to_addr: z.string(),
      token_id: z.string(),
    }),
  ),
  time_at: z.number(),
  token_approve: z
    .object({
      spender: z.string(),
      token_id: z.string(),
      value: z.number(),
    })
    .nullable(),
  tx: z
    .object({
      eth_gas_fee: z.number().optional(),
      from_addr: z.string(),
      name: z.string(),
      status: z.number(),
      params: z.array(z.any()),
      to_addr: z.string(),
      usd_gas_fee: z.number().optional(),
      value: z.number(),
    })
    .nullable(),
});

export type txEntry = z.infer<typeof txDataSchema>;
export type balanceDataEntry = z.infer<typeof balanceDataEntrySchema>;
