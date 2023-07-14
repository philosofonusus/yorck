"use client";

import * as React from "react";
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/types";
import { toast } from "sonner";
import GithubIcon from "@/../public/github_icon.svg";
import Image from "next/image";
import GoogleIcon from "@/../public/google_icon.svg";
import AppleIcon from "@/../public/apple_icon.svg";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const oauthProviders = [
  { name: "Google", strategy: "oauth_google", icon: GoogleIcon },
  {
    name: "Github",
    strategy: "oauth_github",
    icon: GithubIcon,
  },
  {
    name: "Apple",
    strategy: "oauth_apple",
    icon: AppleIcon,
  },
] satisfies {
  name: string;
  icon: any;
  strategy: OAuthStrategy;
}[];

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  async function oauthSignIn(provider: OAuthStrategy) {
    if (!signInLoaded) return null;
    try {
      setIsLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      setIsLoading(null);

      const unknownError = "Something went wrong, please try again.";

      isClerkAPIResponseError(error)
        ? toast.error(error.errors[0]?.longMessage ?? unknownError)
        : toast.error(unknownError);
    }
  }
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
      {oauthProviders.map((provider) => {
        return (
          <Button
            aria-label={`Sign in with ${provider.name}`}
            key={provider.strategy}
            variant="outline"
            className="w-full bg-background sm:w-auto"
            onClick={() => void oauthSignIn(provider.strategy)}
            disabled={isLoading !== null}
          >
            {isLoading === provider.strategy ? (
              <Loader2
                className="w-4 h-4 mr-2 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Image
                quality={100}
                src={provider.icon}
                alt={provider.strategy}
                width={16}
                height={16}
                className="mr-2"
                aria-hidden="true"
              />
            )}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
}
