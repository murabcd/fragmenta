import { auth } from "@/auth";

import { NextResponse } from "next/server";

export default auth((req) => {
  const publicPages = ["/"];
  const authPages = ["/signin", "/signin/email", "/register", "/register/invite"];
  const oauthPages = ["/api/auth"];
  const publishedFormPages = ["/published"];

  if (
    publicPages.includes(req.nextUrl.pathname) ||
    authPages.includes(req.nextUrl.pathname) ||
    req.nextUrl.pathname.startsWith(oauthPages[0]) ||
    req.nextUrl.pathname.startsWith(publishedFormPages[0])
  ) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const newUrl = new URL("/signin", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
