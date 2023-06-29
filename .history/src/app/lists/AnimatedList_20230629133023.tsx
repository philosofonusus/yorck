"use client";
import { InferModel } from "drizzle-orm";
import { addressLists } from "../../lib/db/schema";
import ListEntry from "./ListEntry";
import toast from "react-hot-toast";
import { deleteListAction } from "../listActions";
import { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { useRouter } from "next/navigation";

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
    <div className="space-y-4">
      {lists.map((list) => (
        <ListEntry
          key={list.id}
          listId={list.id}
          onListDelete={() =>
            void toast.promise(deleteListAction({ listId: list.id }), {
              loading: "Deleting list...",
              success: "List deleted!",
              error: "Something went wrong.",
            })
          }
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
