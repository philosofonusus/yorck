import Header from "@/components/header";
import React from "react";

export default function ListsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
