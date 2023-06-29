import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { hashValidator } from "@/lib/hashValidator";
import Image from "next/image";
import { useRouter } from "next/router";
import { z } from "zod";

const validationSchema = z.object({
  listName: z
    .string()
    .min(1, { message: "List name is required" })
    .refine((val) => {
      return !val.includes(" ");
    }, "List name must not contain spaces"),
  hashes: hashValidator,
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function Home() {
  const router = useRouter();

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
        <CardFooter className="flex justify-between">
          <Button asChild variant="ghost">
            <Link href="/lists">Cancel</Link>
          </Button>
          <Button onClick={() => submitButtonRef.current?.click()}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
