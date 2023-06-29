import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

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

export default function Home() {
  return (
    <div className="flex h-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Monitorus!</CardTitle>
          <CardDescription>
            Create your first monitor list. You can add more later.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
