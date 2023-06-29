"use client";

import { renameListAction } from "@/app/listActions";
import { useEffect, useState } from "react";
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
  const debouncedListName = useDebounce(listName, 500);

  useEffect(() => {
    if (debouncedListName !== initialListName && debouncedListName.length) {
      toast.promise(renameListAction(listId, debouncedListName), {
        loading: "Renaming list...",
        success: "List renamed!",
        error: "Failed to rename list",
      });
    }
  }, [debouncedListName, initialListName]);
  return (
    <input
      value={listName}
      onChange={(e) => setListName(e.target.value)}
      className="w-fit space-x-2 bg-transparent text-2xl font-semibold outline-none first-letter:uppercase"
    />
  );
};
