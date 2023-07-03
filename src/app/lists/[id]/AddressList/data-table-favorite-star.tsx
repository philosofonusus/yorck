import { useRouter } from "next/navigation";
import { listInfoAtom } from "./atoms";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { toggleListFavoriteAction } from "@/app/_actions/list";

const DataTableFavoriteStar = ({ address }: { address: string }) => {
  const router = useRouter();
  const [listInfo] = useAtom(listInfoAtom);
  return (
    <Star
      onClick={() => {
        toast.promise(
          toggleListFavoriteAction({
            //@ts-ignore
            listId: listInfo.id,
            //@ts-ignore
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
      className="stroke-none cursor-pointer fill-yellow-400"
    />
  );
};

export default DataTableFavoriteStar;
