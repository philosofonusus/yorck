"use client";

import * as React from "react";
import { useClerk } from "@clerk/nextjs";

import { type SSOCallbackPageProps } from "@/app/(auth)/sso-callback/page";
import { Loader2 } from "lucide-react";

export default function SSOCallback({ searchParams }: SSOCallbackPageProps) {
  const { handleRedirectCallback } = useClerk();

  React.useEffect(() => {
    void handleRedirectCallback(searchParams);
  }, [searchParams, handleRedirectCallback]);

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-describedby="loading-description"
      className="flex items-center justify-center"
    >
      <Loader2 className="w-16 h-16 animate-spin" aria-hidden="true" />
    </div>
  );
}
