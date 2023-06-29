"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { addressValidator } from "@/lib/addressValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { useForm, Form } from "react-hook-form";
import { z } from "zod";
import ClientOnly from "./clientOnly";

export default function CreateListForm({
  onSubmit,
  formValidationSchema,
}: {
  onSubmit: () => void;
  formValidationSchema: typeof z.object;
}) {
  const form = useForm<z.infer<typeof formValidationSchema>>({
    resolver: zodResolver(formValidationSchema),
    defaultValues: {
      listName: nanoid(4),
    },
  });

  return (
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
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
              <Button type="submit">Continue</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="ghost">
            <Link href="/lists">Cancel</Link>
          </Button>
        </CardFooter>
      </Card>
    </ClientOnly>
  );
}
