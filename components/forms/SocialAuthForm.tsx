"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import React from "react";
import ROUTES from "@/constants/routes";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const SocialAuthForm = () => {
  const handleSignIn = async (provider: "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during sign-in");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-11 text-base"
        onClick={() => handleSignIn("google")}
      >
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2"
        />
        <span>Continue with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
