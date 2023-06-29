"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import z from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addressValidator } from "@/lib/addressValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { createListAction } from "../listActions";
import toast from "react-hot-toast";
import { revalidatePath } from "next/cache";

const formValidationSchema = z.object({
  listName: z
    .string()
    .min(1, { message: "List name is required" })
    .refine((val) => {
      return !val.includes(" ");
    }, "List name must not contain spaces"),
  addresses: addressValidator,
});

const CreateListDialog = () => {
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);

  const form = useForm<z.infer<typeof formValidationSchema>>({
    resolver: zodResolver(formValidationSchema),
    defaultValues: {
      listName: nanoid(4),
    },
  });

  async function onSubmit(values: z.infer<typeof formValidationSchema>) {
    await toast.promise(createListAction(values), {
      loading: "Creating list...",
      success: "List created!",
      error: "Something went wrong.",
    });
    revalidatePath("/lists/");
  }
  return (
    <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 w-8 rounded-full p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new list</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="my-3 grid gap-4"
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
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListDialog;
