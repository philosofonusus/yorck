import { z } from "zod";
import web3 from "web3";

export const hasaddressValidatorhValidator = z
  .string()
  .min(1, {
    message: "Hashes are required",
  })
  .refine((val) => {
    return val
      .split(/[\n,]/)
      .filter(Boolean)
      .every((hash) => {
        try {
          if (web3.utils.toChecksumAddress(hash)) {
            return true;
          }
        } catch {
          return false;
        }
      });
  }, "Somewhere is an invalid hash");
