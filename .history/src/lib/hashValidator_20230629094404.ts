export const hashValidator = z.const validationSchema = z.object({
    listName: z
      .string()
      .min(1, { message: "List name is required" })
      .refine((val) => {
        return !val.includes(" ");
      }, "List name must not contain spaces"),
    hashes: z
      
  });