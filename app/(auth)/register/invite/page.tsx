import { Metadata } from "next";

import Link from "next/link";
import Image from "next/image";

import { UserAuthForm } from "@/components/user-auth-form";

export const metadata: Metadata = {
  title: "Welcome to Fragmenta",
  description: "Create an account to join the organization",
};

export default function InviteRegisterPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
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
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to Fragmenta</h1>
          <p className="text-sm text-muted-foreground">
            Create an account to join the organization
          </p>
        </div>
        <UserAuthForm mode="register" inviteToken={token} />
        <p className="text-center text-sm text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="hover:text-brand underline underline-offset-4">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:text-brand underline underline-offset-4">
            Privacy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
