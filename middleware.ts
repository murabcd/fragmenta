import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/signin") {
    const newUrl = new URL("/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
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
