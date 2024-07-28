import bcrypt from "bcryptjs";

import { ConvexAdapter } from "./app/convex-adapter";

import { env } from "./env.mjs";

import { SignJWT, importPKCS8 } from "jose";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";

import { signInSchema } from "./types/validation/auth";

import { fetchQuery } from "convex/nextjs";

import { api } from "./convex/_generated/api";
import { Id } from "./convex/_generated/dataModel";

const CONVEX_SITE_URL = env.NEXT_PUBLIC_CONVEX_URL!.replace(/.cloud$/, ".site");

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    Google,
    Resend({ from: env.EMAIL_FROM }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = await signInSchema.parseAsync(credentials);

        const user = await fetchQuery(api.users.email, { email });

        if (!user || !user.password) throw new Error("User not found.");

        const passwordHash = await bcrypt.compare(password, user.password);

        if (passwordHash) {
          return {
            id: user._id,
            email: user.email,
            name: user.name,
          };
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  adapter: ConvexAdapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as Id<"users">;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }

      const privateKey = await importPKCS8(env.CONVEX_AUTH_PRIVATE_KEY!, "RS256");
      const convexToken = await new SignJWT({
        sub: session.user.id,
      })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(CONVEX_SITE_URL)
        .setAudience("convex")
        .setExpirationTime("1h")
        .sign(privateKey);

      return { ...session, convexToken };
    },
  },
  secret: process.env.AUTH_SECRET,
});

declare module "next-auth" {
  interface Session {
    convexToken: string;
  }
}
