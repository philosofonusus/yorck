import { addressLists } from "../../lib/db/schema";
("use client");

interface AnimatedListProps {
  lists: (typeof addressLists)[];
}

const AnimatedList = () => {
  return <div className="space-y-4"></div>;
};
