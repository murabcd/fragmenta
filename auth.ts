import { ConvexAdapter } from "./app/convex-adapter";

import { SignJWT, importPKCS8 } from "jose";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(/.cloud$/, ".site");

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    Google,
    Resend({
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: ConvexAdapter,
  pages: {
    signIn: "/signin",
    error: "/error",
  },

  callbacks: {
    async session({ session }) {
      const privateKey = await importPKCS8(process.env.CONVEX_AUTH_PRIVATE_KEY!, "RS256");
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
