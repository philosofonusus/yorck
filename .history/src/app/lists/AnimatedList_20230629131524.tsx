"use client";
import { InferModel } from "drizzle-orm";
import { addressLists } from "../../lib/db/schema";

interface AnimatedListProps {
  lists: InferModel<typeof addressLists>[];
}

const AnimatedList: React.FC<AnimatedListProps> = () => {
  return <div className="space-y-4"></div>;
};
