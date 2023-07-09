import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center h-full justify-center w-full">
      <Loader2 className="h-12 w-12 animate-spin" />
    </div>
  );
}
