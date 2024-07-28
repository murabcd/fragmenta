"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { toast } from "sonner";

import Link from "next/link";

import { LoaderCircle, Mail } from "lucide-react";

import { magicLinkSchema, signInSchema, registerSchema } from "@/types/validation/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Icons } from "@/components/icons";

import { cn } from "@/lib/utils";

import { useAction } from "convex/react";

import { api } from "@/convex/_generated/api";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "signin" | "signin-email" | "register";
}

type FormData = z.infer<
  typeof magicLinkSchema | typeof signInSchema | typeof registerSchema
>;

export function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(
      mode === "signin"
        ? magicLinkSchema
        : mode === "signin-email"
          ? signInSchema
          : registerSchema
    ),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const createUser = useAction(api.users.create);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    if (mode === "signin" || mode === "signin-email") {
      const signInResult = await signIn(mode === "signin" ? "resend" : "credentials", {
        email: data.email.toLowerCase(),
        password: (data as z.infer<typeof signInSchema>).password,
        redirect: false,
        callbackUrl: "/home",
      });

      if (signInResult?.error) {
        toast.error(signInResult.error);
      } else if (signInResult?.ok) {
        toast.success(
          mode === "signin" ? "We sent you a link, check your email" : "Signed in"
        );
        router.push("/home");
      }
    } else if (mode === "register") {
      const user = await createUser({
        email: data.email,
        name: (data as z.infer<typeof registerSchema>).name,
        password: (data as z.infer<typeof registerSchema>).password,
        role: "owner",
      });

      if (!user) {
        toast.error("Sign up failed");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: (data as z.infer<typeof signInSchema>).password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error(signInResult.error);
      } else if (signInResult?.ok) {
        toast.success("Signed up");
        router.push("/home");
      }
    }

    setIsLoading(false);
  }

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/home" });
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
                <p className="text-xs text-destructive">{errors.name.message}</p>
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
          {(mode === "signin-email" || mode === "register") && (
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
