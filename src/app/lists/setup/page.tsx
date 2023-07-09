"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { addressValidator } from "@/lib/addressValidator";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { nanoid } from "nanoid";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ClientOnly from "../../clientOnly";
import { createListAction } from "../../_actions/list";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { monitofresh } from "@/services/monitofresh";

const formValidationSchema = z.object({
  listName: z
    .string()
    .min(1, { message: "List name is required" })
    .refine((val) => {
      return !val.includes(" ");
    }, "List name must not contain spaces"),
  addresses: addressValidator,
});

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof formValidationSchema>>({
    resolver: zodResolver(formValidationSchema),
    defaultValues: {
      listName: nanoid(4),
    },
  });

  async function onSubmit(values: z.infer<typeof formValidationSchema>) {
    if (!user) return;
    await toast.promise(
      monitofresh
        .refreshAddressData([
          ...new Set(
            values.addresses
              .split(/[\n,]/)
              .map((address) => address.toLowerCase().trim())
          ),
        ])
        .then(async () => {
          await createListAction({ ...values, userId: user!.id });
        })
        .then(() => {
          router.refresh();
          router.push("/lists");
        }),
      {
        loading: "Creating list...",
        success: "List created!",
        error: "Something went wrong",
      }
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <ClientOnly>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Yock!</CardTitle>
                <CardDescription>
                  Create your first monitor list. You can add more later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="listName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List Name</FormLabel>
                      <FormControl>
                        <Input
                          onKeyDown={(e) => {
                            if (e.code === "Space") {
                              e.preventDefault();
                            }
                          }}
                          placeholder="list name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addresses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Addresses</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="one per line or coma separated."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="ghost">
                  <Link href="/lists">Cancel</Link>
                </Button>
                <Button type="submit">Continue</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </ClientOnly>
    </div>
  );
}
