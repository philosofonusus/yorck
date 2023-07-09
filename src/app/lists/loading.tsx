import { Shell } from "@/components/shell";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <Shell variant="centered" className="h-full">
      <Loader2 className="h-12 w-12 animate-spin" />
    </Shell>
  );
}
