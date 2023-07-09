import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

export default function ListNotFound() {
  return (
    <Shell variant="centered">
      <ErrorCard
        title="List not found"
        description="The list you are looking for does not exist."
        retryLink="/lists"
        retryLinkText="Go to all lists"
      />
    </Shell>
  );
}
