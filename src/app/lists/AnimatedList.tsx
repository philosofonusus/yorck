"use client";
import { InferModel } from "drizzle-orm";
import { addressLists } from "../../lib/db/schema";
import ListEntry from "./ListEntry";
import { toast } from "sonner";
import { deleteListAction } from "../_actions/list";
import { useRouter } from "next/navigation";
import autoAnimate from "@formkit/auto-animate";
import { useRef, useEffect } from "react";

interface AnimatedListProps {
  lists: InferModel<typeof addressLists>[];
}

const AnimatedAddressList: React.FC<AnimatedListProps> = ({ lists }) => {
  const animatedList = useRef(null);
  const router = useRouter();
  useEffect(() => {
    animatedList.current && autoAnimate(animatedList.current);
  }, [animatedList]);
  return (
    <div ref={animatedList} className="space-y-4">
      {lists.map((list) => (
        <ListEntry
          key={list.id}
          listId={list.id}
          onListDelete={async () => {
            toast.promise(
              deleteListAction({ listId: list.id }).then(() =>
                router.refresh()
              ),
              {
                loading: "Deleting list...",
                success: "List deleted!",
                error: "Something went wrong.",
              }
            );
          }}
          listName={list.name}
          listCount={(list.addresses as string[]).length}
          onListSelect={() => {
            void router.push(`/lists/${list.id}`, undefined);
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedAddressList;
