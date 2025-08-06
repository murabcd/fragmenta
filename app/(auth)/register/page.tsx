import Link from "next/link";

import { Button } from "@/components/ui/button";

import { UserAuthForm } from "@/components/auth/user-auth-form";
import { Icons } from "@/components/icons";

export const metadata = {
	title: "Create an account",
	description: "Create an account to get started.",
};

export default function RegisterPage() {
	return (
		<div className="flex min-h-screen w-full">
			<div className="hidden w-1/2 bg-muted/40 lg:block" />
			<div className="w-full lg:w-1/2 flex items-center justify-center p-4">
				<div className="w-full max-w-sm space-y-6">
					<div className="flex flex-col items-center space-y-2 text-center">
						<Link href="/">
							<Icons.fragmenta className="h-8 w-8 cursor-pointer" />
						</Link>
						<h1 className="text-2xl font-semibold tracking-tight">
							Create an account
						</h1>
						<p className="text-sm text-muted-foreground">
							Enter your name, email and password below
						</p>
					</div>
					<UserAuthForm mode="register" />
					<p className="text-center text-sm text-muted-foreground">
						By signing up, you agree to our{" "}
						<Link
							href="/terms"
							className="hover:text-brand underline underline-offset-4"
						>
							Terms
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							className="hover:text-brand underline underline-offset-4"
						>
							Privacy
						</Link>
						.
					</p>
				</div>
			</div>
			<Link href="/login">
				<Button
					variant="ghost"
					className="absolute right-4 top-4 md:right-8 md:top-6"
				>
					Log in
				</Button>
			</Link>
		</div>
	);
}
