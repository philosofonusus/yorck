const validationSchema = z.object({
    listName: z
      .string()
      .min(1, { message: "List name is required" })
      .refine((val) => {
        return !val.includes(" ");
      }, "List name must not contain spaces"),
    hashes: z
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
      }, "Somewhere is an invalid hash"),
  });