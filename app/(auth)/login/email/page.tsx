import type { Metadata } from "next";

import Link from "next/link";

import { UserAuthForm } from "@/components/user-auth-form";
import { Icons } from "@/components/icons";

export const metadata: Metadata = {
	title: "Log in with email",
	description: "Log in to your account",
};

export default function SignInEmailPage() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4">
			<div className="w-full max-w-sm space-y-6">
				<div className="flex flex-col items-center space-y-2 text-center">
					<Link href="/">
						<Icons.fragmenta className="h-8 w-8 cursor-pointer" />
					</Link>
					<h1 className="text-2xl font-semibold tracking-tight">
						Log in to your account
					</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email and password to log in
					</p>
				</div>
				<UserAuthForm mode="login-email" />
				<p className="text-center text-sm text-muted-foreground">
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
