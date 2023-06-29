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
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ClientOnly from "./clientOnly";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";

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
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof formValidationSchema>>({
    resolver: zodResolver(formValidationSchema),
    defaultValues: {
      listName: nanoid(4),
    },
  });

  function onSubmit(values: z.infer<typeof formValidationSchema>) {
    "use server";
    const { listName, addresses } = values;

    db.insert(addressLists).values({
      name: listName,
      addresses: addresses.split(/[\n,]/).map((address) => address.trim()),
    });
  }

  return (
    <div className="flex h-full items-center justify-center">
      <ClientOnly>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Monitorus!</CardTitle>
            <CardDescription>
              Create your first monitor list. You can add more later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-3"
              >
                <FormField
                  control={form.control}
                  name="listName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List Name</FormLabel>
                      <FormControl>
                        <Input placeholder="list name" {...field} />
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
                <button
                  className="hidden"
                  ref={submitButtonRef}
                  type="submit"
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="ghost">
              <Link href="/lists">Cancel</Link>
            </Button>
            <Button onClick={() => submitButtonRef.current?.click()}>
              Continue
            </Button>
          </CardFooter>
        </Card>
      </ClientOnly>
    </div>
  );
}
