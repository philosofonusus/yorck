"use client";
import StyledAvatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { block } from "million/react";
import { TrashIcon } from "lucide-react";

interface ListEntryProps {
  listName: string;
  listCount: number;
  onListDelete: () => void;
  listId: string;
  onListSelect: () => void;
}

const ListEntry: React.FC<ListEntryProps> = block(
  ({ listName, onListSelect, listId, onListDelete, listCount }) => {
    return (
      <div
        onClick={() => onListSelect()}
        className="flex items-center p-4 space-x-4 border rounded-md cursor-pointer group hover:bg-accent"
      >
        <StyledAvatar name={listId} />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">{listName}</p>
          <p className="text-sm text-muted-foreground">
            There are
            <span className="text-accent-foreground"> {listCount} </span>
            items in this list.
          </p>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onListDelete();
          }}
          variant="outline"
          className="hidden w-8 h-8 p-0 rounded-full cursor-pointer bg-a group-hover:flex"
        >
          <TrashIcon className="w-6 h-6 text-accent-foreground" />
        </Button>
      </div>
    );
  }
);

export default ListEntry;
