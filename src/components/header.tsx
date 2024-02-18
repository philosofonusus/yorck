"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { DropdownMenuShortcut } from "./ui/dropdown-menu";
import { Link } from "lucide-react";

export default function Header() {
  const { user } = useUser();
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 w-full border-b supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link href="/lists">
          <span className="text-2xl font-semibold leading-none tracking-tight">
            Yorck
          </span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative w-8 h-8 rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.imageUrl} alt="yorck" />
                <AvatarFallback />
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <SignOutButton
              signOutCallback={() =>
                router.push(`${window.location.origin}/signin/?redirect=false`)
              }
            >
              <DropdownMenuItem>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
