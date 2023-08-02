"use strict";
import { z } from "zod";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";

type ValidInputTypes = Uint8Array | bigint | string | number | boolean;

const isHexStrict = (hex: ValidInputTypes) =>
  typeof hex === "string" && /^((-)?0x[0-9a-f]+|(0x))$/i.test(hex);

function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  let hexString = "0x";
  for (const e of uint8Array) {
    const hex = e.toString(16);
    hexString += hex.length === 1 ? `0${hex}` : hex;
  }
  return hexString;
}

export const checkAddressCheckSum = (data: string): boolean => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(data)) return false;
  const address = data.slice(2);
  const updatedData = utf8ToBytes(address.toLowerCase());

  const addressHash = uint8ArrayToHexString(keccak256(updatedData)).slice(2);

  for (let i = 0; i < 40; i += 1) {
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
};

export const isAddress = (value: ValidInputTypes, checkChecksum = true) => {
  if (typeof value !== "string" && !(value instanceof Uint8Array)) {
    return false;
  }

  let valueToCheck: string;

  if (value instanceof Uint8Array) {
    valueToCheck = uint8ArrayToHexString(value);
  } else if (typeof value === "string" && !isHexStrict(value)) {
    valueToCheck = value.toLowerCase().startsWith("0x") ? value : `0x${value}`;
  } else {
    valueToCheck = value;
  }

  if (!/^(0x)?[0-9a-f]{40}$/i.test(valueToCheck)) {
    return false;
  }
  if (
    /^(0x|0X)?[0-9a-f]{40}$/.test(valueToCheck) ||
    /^(0x|0X)?[0-9A-F]{40}$/.test(valueToCheck)
  ) {
    return true;
  }
  return checkChecksum ? checkAddressCheckSum(valueToCheck) : true;
};

export const addressValidator = z
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
          if (isAddress(hash, true)) {
            return true;
          }
        } catch {
          return false;
        }
      });
  }, "Somewhere is an invalid hash");
