"use client";
import { InferModel } from "drizzle-orm";
import { addressLists } from "../../lib/db/schema";
import ListEntry from "./ListEntry";

interface AnimatedListProps {
  lists: InferModel<typeof addressLists>[];
}

const AnimatedList: React.FC<AnimatedListProps> = ({ lists }) => {
  return (
    <div className="space-y-4">
      {lists.map((list) => (
        <ListEntry
          key={list.id}
          listId={list.id}
          onListDelete={() =>
            void toast.promise(deleteList({ id: list.id }), {
              loading: "Deleting list...",
              success: "List deleted!",
              error: "Something went wrong.",
            })
          }
          listName={list.name}
          listCount={(list.addresses as string[]).length}
          onListSelect={() => {
            void router.push(`/lists/${list.id}`, undefined, {
              shallow: true,
            });
          }}
        />
      ))}
    </div>
  );
};
