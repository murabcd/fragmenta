import type { Metadata } from "next";

import Link from "next/link";
import Image from "next/image";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UserAuthForm } from "@/components/user-auth-form";

export const metadata: Metadata = {
	title: "Sign in with email",
	description: "Sign in to your account",
};

export default function SignInEmailPage() {
	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col items-center space-y-2 text-center">
					<Link href="/">
						<Image
							src="/logo.svg"
							alt="Logo"
							width={32}
							height={32}
							className="dark:hidden cursor-pointer"
							priority
						/>
						<Image
							src="/logo-dark.svg"
							alt="Logo"
							width={32}
							height={32}
							className="hidden dark:block cursor-pointer"
							priority
						/>
					</Link>
					<h1 className="text-2xl font-semibold tracking-tight">
						Sign in to your account
					</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email and password to sign in
					</p>
				</div>
				<UserAuthForm mode="signin-email" />
				<p className="px-8 text-center text-sm text-muted-foreground">
					<Link
						href="/register"
						className="hover:text-brand underline underline-offset-4"
					>
						Don&apos;t have an account? Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
