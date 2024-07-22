"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { toast } from "sonner";

import Link from "next/link";

import { LoaderCircle, Mail } from "lucide-react";

import { userAuthSchema } from "@/types/validation/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Icons } from "@/components/icons";

import { cn } from "@/lib/utils";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "signin" | "signin-email" | "register";
}

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    if (mode === "signin" || mode === "signin-email") {
      const signInResult = signIn(mode === "signin" ? "resend" : "credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
        callbackUrl: "/home",
      });

      toast.promise(signInResult, {
        loading: "Processing...",
        success:
          mode === "signin"
            ? "We sent you a link, check your email and spam folder"
            : "Signed in",
        error: "Sign in request failed",
      });
    } else if (mode === "register") {
      // Implement registration logic here
      // You might want to use a mutation to create a new user in your Convex database
      // and then sign in the user
      // For example:
      // await createUser({ email: data.email, name: data.name, password: data.password });
      // await signIn("credentials", { email: data.email, password: data.password });
    }

    setIsLoading(false);
  }

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/home" });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {mode === "register" && (
            <div className="grid gap-1">
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
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
          )}
          <div className="grid gap-1">
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
          {(mode === "signin-email" || mode === "register") && (
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Your password"
                type="password"
                autoCapitalize="none"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "signin" && "Sign in with magic link"}
            {mode === "signin-email" && "Sign in"}
            {mode === "register" && "Sign up"}
          </Button>
        </div>
      </form>
      {mode === "signin" && (
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
            <Link href="/signin/email">
              <Mail className="mr-2 h-4 w-4" />
              Sign in with email
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
