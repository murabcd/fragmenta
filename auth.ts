import bcrypt from "bcryptjs";

import { ConvexAdapter } from "./app/convex-adapter";

import { env } from "./env.mjs";

import { SignJWT, importPKCS8 } from "jose";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";

import { userAuthSchema } from "./types/validation/auth";

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
      async authorize(credentials) {
        const validatedFields = userAuthSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await fetchQuery(api.users.getUserByEmail, { email });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
  adapter: ConvexAdapter,
  pages: {
    signIn: "/signin",
    error: "/error",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await fetchQuery(api.users.getUser, {
        id: user.id as Id<"users">,
      });

      if (!existingUser?.emailVerified) return false;

      return true;
    },

    async session({ session }) {
      const privateKey = await importPKCS8(env.CONVEX_AUTH_PRIVATE_KEY!, "RS256");
      const convexToken = await new SignJWT({
        sub: session.userId,
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
});

declare module "next-auth" {
  interface Session {
    convexToken: string;
  }
}
