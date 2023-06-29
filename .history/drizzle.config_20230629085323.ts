import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "src/lib/db/schema.ts",
  out: "src/lib/db/migrations",
dbCredentials: {
    
}
  breakpoints: true,
} satisfies Config;
