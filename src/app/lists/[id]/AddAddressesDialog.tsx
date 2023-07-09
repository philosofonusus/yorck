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
import {
  addAddressesToListAction,
  createListAction,
} from "../../_actions/list";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { monitofresh } from "@/services/monitofresh";

const formValidationSchema = z.object({
  addresses: addressValidator,
});

const AddAddressesDialog = ({ listId }: { listId: string }) => {
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formValidationSchema>>({
    resolver: zodResolver(formValidationSchema),
  });

  async function onSubmit(values: z.infer<typeof formValidationSchema>) {
    setIsCreateListOpen(false);
    toast.promise(
      monitofresh
        .refreshAddressData([
          ...new Set(
            values.addresses
              .split(/[\n,]/)
              .map((address) => address.toLowerCase().trim())
          ),
        ])
        .then(async () => {
          await addAddressesToListAction({
            listId,
            addresses: values.addresses,
          });
        })
        .then(() => router.refresh()),
      {
        loading: "Adding addresses...",
        success: "Addresses added succesfully!",
        error: "Something went wrong.",
      }
    );
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
          <DialogTitle>Add addresses</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="my-3 grid gap-4"
          >
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

export default AddAddressesDialog;
