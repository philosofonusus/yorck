import Header from "@/components/header";
import React from "react";

export default function ListsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <Header />

      <main className="h-[calc(100% - 57px)]">{children}</main>
    </div>
  );
}
