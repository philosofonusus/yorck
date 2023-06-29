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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formValidationSchema = z.object({
  listName: z
    .string()
    .min(1, { message: "List name is required" })
    .refine((val) => {
      return !val.includes(" ");
    }, "List name must not contain spaces"),
  hashes: hashValidator,
});

export default function Home() {
  const form = useForm<z.infer<typeof formValidationSchema>>({
    resolver: zodResolver(formValidationSchema),
    defaultValues: {
      username: "",
    },
  });

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
          <Button>Continue</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
