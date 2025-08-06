"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { LoaderCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	mode: "login" | "login-email" | "register";
	inviteToken?: string;
}

export const magicLinkSchema = z.object({
	email: z.email("Invalid email address"),
});

export const signInSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const registerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

type FormData = z.infer<
	typeof magicLinkSchema | typeof signInSchema | typeof registerSchema
>;

export function UserAuthForm({
	className,
	mode,
	inviteToken,
	...props
}: UserAuthFormProps) {
	const router = useRouter();
	const { signIn } = useAuthActions();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(
			mode === "login"
				? magicLinkSchema
				: mode === "login-email"
					? signInSchema
					: registerSchema,
		),
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

	async function onSubmit(data: FormData) {
		setIsLoading(true);

		try {
			if (mode === "login") {
				// Magic link sign in
				const formData = new FormData();
				formData.append("email", data.email.toLowerCase());

				await signIn("resend", formData);
				toast.success("We sent you a link, check your email");
			} else if (mode === "login-email") {
				// Password sign in
				const formData = new FormData();
				formData.append("email", data.email.toLowerCase());
				formData.append(
					"password",
					(data as z.infer<typeof signInSchema>).password,
				);
				formData.append("flow", "signIn");

				await signIn("password", formData);
				router.push("/home");
			} else if (mode === "register") {
				// Register with password - Convex Auth will create the user automatically
				const formData = new FormData();
				formData.append("email", data.email.toLowerCase());
				formData.append(
					"password",
					(data as z.infer<typeof registerSchema>).password,
				);
				formData.append("flow", "signUp");
				formData.append("name", (data as z.infer<typeof registerSchema>).name);
				formData.append("role", "owner");

				await signIn("password", formData);
				toast.success("Account created successfully");
				router.push("/home");
			}
		} catch (error) {
			console.error("Auth error:", error);
			toast.error("Authentication failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	const handleGoogleSignIn = async () => {
		setIsGoogleLoading(true);
		try {
			await signIn("google", { redirectTo: "/home" });
		} catch (error) {
			console.error("Google sign in error:", error);
			toast.error("Google sign in failed. Please try again.");
		} finally {
			setIsGoogleLoading(false);
		}
	};

	return (
		<div className={cn("grid gap-8", className)} {...props}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="grid gap-4">
					{mode === "register" && (
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Your name"
								type="text"
								autoCapitalize="words"
								autoComplete="name"
								autoCorrect="off"
								{...register("name")}
							/>
							{"name" in errors && errors.name && (
								<p className="text-xs text-destructive">
									{errors.name.message}
								</p>
							)}
						</div>
					)}
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							placeholder="Your email address"
							type="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-xs text-destructive">{errors.email.message}</p>
						)}
					</div>
					{(mode === "login-email" || mode === "register") && (
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								placeholder="Your password"
								type="password"
								autoCapitalize="none"
								autoComplete="current-password"
								{...register("password")}
							/>
							{"password" in errors && errors.password && (
								<p className="text-xs text-destructive">
									{errors.password.message}
								</p>
							)}
						</div>
					)}
					<Button type="submit" disabled={isLoading}>
						{isLoading && (
							<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
						)}
						{mode === "login" && "Log in with magic link"}
						{mode === "login-email" && "Log in"}
						{mode === "register" && "Sign up"}
					</Button>
				</div>
			</form>
			{(mode === "login" || mode === "register") && (
				<>
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>
					<Button
						variant="outline"
						onClick={handleGoogleSignIn}
						disabled={isLoading || isGoogleLoading}
					>
						{isGoogleLoading ? (
							<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Icons.google className="mr-2 h-4 w-4" />
						)}
						Google
					</Button>
					{mode === "login" && (
						<>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Other options
									</span>
								</div>
							</div>
							<Button variant="ghost" asChild>
								<Link href="/login/email">
									<Mail className="mr-2 h-4 w-4" />
									Log in with email
								</Link>
							</Button>
						</>
					)}
				</>
			)}
		</div>
	);
}
