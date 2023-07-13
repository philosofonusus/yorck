"use server";
import { redis } from "@/lib/redis";

export async function bulkTokenLookup(addresses: string[]) {
  const tokens = Object.assign(
    {},
    ...(
      await Promise.all(
        addresses.map(async (address: string) => {
          const token = await redis.get(`token:${address}`);
          return token
            ? {
                [address]: token,
              }
            : null;
        })
      )
    ).filter(Boolean)
  );
  return tokens;
}

export async function bulkProjectLookup(ids: string[]) {
  const projects = Object.assign(
    {},
    ...(
      await Promise.all(
        ids.map(async (id: string) => {
          const project = await redis.get(`project:${id}`);
          return project
            ? {
                [id]: project,
              }
            : null;
        })
      )
    ).filter(Boolean)
  );
  return projects;
}

export async function bulkCexLookup(ids: string[]) {
  const cexs = Object.assign(
    {},
    ...(
      await Promise.all(
        ids.map(async (id: string) => {
          const cex = await redis.get(`cex:${id}`);
          return cex
            ? {
                [id]: cex,
              }
            : null;
        })
      )
    ).filter(Boolean)
  );
  return cexs;
}
