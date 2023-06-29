import StyledAvatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { TrashIcon } from "lucide-react";

interface ListEntryProps {
  listName: string;
  listCount: number;
  onListDelete: () => void;
  listId: string;
  onListSelect: () => void;
}

const ListEntry: React.FC<ListEntryProps> = ({
  listName,
  onListSelect,
  listId,
  onListDelete,
  listCount,
}) => {
  return (
    <div
      onClick={() => onListSelect()}
      className="group flex cursor-pointer items-center space-x-4 rounded-md border p-4 hover:bg-accent"
    >
      <StyledAvatar name={listId} />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{listName}</p>
        <p className="text-sm text-muted-foreground">
          There {listCount <= 1 ? "is" : "are"}{" "}
          <span className="text-accent-foreground">{listCount}</span>{" "}
          {listCount === 1 ? "item" : "items"} in this list.
        </p>
      </div>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onListDelete();
        }}
        variant="outline"
        className="bg-a hidden h-8 w-8 cursor-pointer rounded-full p-0 group-hover:flex"
      >
        <TrashIcon className=" h-6 w-6 text-accent-foreground" />
      </Button>
    </div>
  );
};
export default async function AddressLists() {
  const data = await db.select().from(addressLists);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="mx-6 w-full max-w-md">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold">
            Address Lists
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
