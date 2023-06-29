"use client";

import { renameListAction } from "@/app/listActions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
      value={listName}
    onKeyDown={e => (e.code === 'Space') e.preventDefault()}
      onChange={(e) => setListName(e.target.value)}
      className="w-fit space-x-2 bg-transparent text-2xl font-semibold outline-none first-letter:uppercase"
    />
  );
};
