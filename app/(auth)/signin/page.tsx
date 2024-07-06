import { Metadata } from "next";

import Link from "next/link";
import Image from "next/image";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UserAuthForm } from "@/components/user-auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/">
        <Button variant="ghost" className="absolute left-4 top-4 md:left-8 md:top-8">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={25}
            height={25}
            className="dark:hidden"
            priority
          />
          <Image
            src="/logo-dark.svg"
            alt="Logo"
            width={25}
            height={25}
            className="hidden dark:block"
            priority
          />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
