"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal, RefreshCw, Star, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteAddressesFromListAction,
  toggleListFavoriteAction,
} from "@/app/_actions/list";
import { toast } from "sonner";
import { listInfoAtom } from "./atoms";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { monitofresh } from "@/services/monitofresh";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const rowData = row.original;
  const router = useRouter();

  const [listInfo, setListInfo] = useAtom(listInfoAtom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onSelect={() => {
            toast.promise(
              toggleListFavoriteAction({
                //@ts-ignore
                listId: listInfo.id,
                //@ts-ignore
                address: rowData.address,
              }).then(() => router.refresh()),
              {
                loading: "Toggling favorite...",
                success: "Favorite toggled",
                error: "Failed to toggle favorite",
              }
            );
          }}
        >
          <Star className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Toggle favorite
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            listInfo &&
              toast.promise(
                monitofresh
                  .refreshAddressData([
                    //@ts-ignore
                    rowData.address,
                  ])
                  .then(() => router.refresh()),
                {
                  loading: "Syncing address data...",
                  success: "Address data synced!",
                  error: "Failed to sync address data",
                }
              );
          }}
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Force sync
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            listInfo &&
              toast.promise(
                deleteAddressesFromListAction({
                  //@ts-ignore
                  listId: listInfo.id,
                  //@ts-ignore
                  addresses: [rowData.address],
                }).then(() => router.refresh()),
                {
                  loading: "Deleting address...",
                  success: "Address deleted",
                  error: "Failed to delete address",
                }
              );
          }}
        >
          <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
