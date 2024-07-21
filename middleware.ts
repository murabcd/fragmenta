import { auth } from "@/auth";

import { NextResponse } from "next/server";

export default auth((req) => {
  const authPages = ["/signin", "/register"];

  if (!req.auth && !authPages.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/signin", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    "/home/:path*",
    "/forms/:path*",
    "/recent/:path*",
    "/settings/:path*",
    "/signin",
    "/register",
  ],
};
