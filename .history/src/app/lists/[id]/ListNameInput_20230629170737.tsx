"use client";

import { renameListAction } from "@/app/listActions";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "usehooks-ts";

interface ListNameInputProps {
  initialListName: string;
  listId: string;
}

export const ListNameInput: React.FC<ListNameInputProps> = ({
  initialListName,
  listId,
}) => {
  const [listName, setListName] = useState(initialListName);
  const debouncedListName = useDebounce(listName, 350);
  const router = useRouter();

  useEffect(() => {
    if (debouncedListName !== initialListName && debouncedListName.length) {
      toast.promise(
        renameListAction({
          listId,
          listName: debouncedListName,
        }).then(() => router.refresh()),
        {
          loading: "Renaming list...",
          success: "List renamed!",
          error: "Failed to rename list",
        }
      );
    }
  }, [debouncedListName, initialListName, listId, router]);

  return (
    <input
      ref={inputRef}
      value={listName}
      onKeyDown={(e) => {
        if (e.code === "Space") {
          e.preventDefault();
        }
      }}
      onChange={(e) => setListName(e.target.value)}
      style={{ width: `${listName.length}ch` }}
      className="space-x-2 bg-transparent text-2xl font-semibold outline-none first-letter:uppercase"
    />
  );
};
