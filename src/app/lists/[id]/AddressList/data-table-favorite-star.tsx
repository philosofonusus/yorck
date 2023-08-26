import { useRouter } from "next/navigation";
import { listInfo } from "./state";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { toggleListFavoriteAction } from "@/app/_actions/list";
import { observer, useSelector } from "@legendapp/state/react";

const DataTableFavoriteStar = observer(({ address }: { address: string }) => {
  const router = useRouter();
  const listId = useSelector(listInfo.id);
  return (
    <Star
      onClick={() => {
        toast.promise(
          toggleListFavoriteAction({
            listId,
            address,
          }).then(() => router.refresh()),
          {
            loading: "Toggling favorite...",
            success: "Favorite toggled",
            error: "Failed to toggle favorite",
          }
        );
      }}
      size={20}
      className="cursor-pointer stroke-none fill-yellow-400"
    />
  );
});

export default DataTableFavoriteStar;
