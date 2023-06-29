"use client";

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
    if (listName !== initialListName && listName.length) {
    }
  }, [debouncedListName]);
  return (
    <input
      value={listName}
      onChange={(e) => setListName(e.target.value)}
      className="w-fit space-x-2 bg-transparent text-2xl font-semibold outline-none first-letter:uppercase"
    />
  );
};
