import Header from "@/components/header";
import React from "react";

export default function ListsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-y-hidden">
      <Header />

      <main
        style={{ height: "calc(100% - 57px)" }}
        className="overflow-y-scroll"
      >
        {children}
      </main>
    </div>
  );
}
