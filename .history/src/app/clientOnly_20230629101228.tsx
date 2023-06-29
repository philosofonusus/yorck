"use client";

// Imports
// ========================================================
import React, { useState, useEffect } from "react";

// Page
// ========================================================
export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {

  const [hasMounted, setHasMounted] = useState(false);


  useEffect(() => {
    setHasMounted(true);
  }, []);


  if (!hasMounted) return null;

  return <div>{children}</div>;
}
