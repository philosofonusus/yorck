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

      <main
        style={{ height: "calc(100% - 57px)" }}
        className="mt-[57px] overflow-y-scroll"
      >
        {children}
      </main>
    </div>
  );
}
