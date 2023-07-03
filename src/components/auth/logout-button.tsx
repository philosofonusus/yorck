"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { useIsMounted } from "usehooks-ts";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LogOutButtons() {
  const router = useRouter();
  const mounted = useIsMounted();
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="flex w-full items-center space-x-2">
      {mounted() ? (
        <SignOutButton
          signOutCallback={() =>
            startTransition(() => {
              router.push(`${window.location.origin}/?redirect=false`);
            })
          }
        >
          <Button
            aria-label="Log out"
            size="sm"
            className="w-full"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log out
          </Button>
        </SignOutButton>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full bg-muted text-muted-foreground"
          )}
        >
          Log out
        </Skeleton>
      )}
      <Button
        aria-label="Go back to the previous page"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.back()}
        disabled={isPending}
      >
        Go back
      </Button>
    </div>
  );
}
