"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Plus } from "lucide-react";

const CreateListDialog = () => {
  
  return (
    <Dialog open={isAddNewListOpen} onOpenChange={setIsAddNewListOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 w-8 rounded-full p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new list</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="my-3 grid gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="listName">List name</Label>
            <Input
              {...register("listName")}
              type="text"
              id="listName"
              placeholder="whales"
            />
            {errors.listName && (
              <p className="text-sm text-destructive">
                {errors.listName.message}
              </p>
            )}
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="hashes">Hashes</Label>
            <Textarea
              {...register("hashes")}
              id="hashes"
              placeholder="one per line or coma separated."
            />
            {errors.hashes && (
              <p className="text-sm text-destructive">
                {errors.hashes.message}
              </p>
            )}
          </div>
          <button className="hidden" ref={submitButtonRef} />
        </form>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => submitButtonRef.current?.click()}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListDialog;
