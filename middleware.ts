import {
	convexAuthNextjsMiddleware,
	createRouteMatcher,
	nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher([
	"/login",
	"/login/email",
	"/register",
	"/register/invite",
]);
const isPublicPage = createRouteMatcher(["/", "/about", "/pricing"]);
const isPublishedFormPage = createRouteMatcher(["/published(.*)"]);
const isOAuthPage = createRouteMatcher(["/api/auth(.*)"]);
const isProtectedRoute = createRouteMatcher([
	"/home(.*)",
	"/form(.*)",
	"/settings(.*)",
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
	if (
		isPublicPage(request) ||
		isOAuthPage(request) ||
		isPublishedFormPage(request)
	) {
		return;
	}

	if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, "/home");
	}

	if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, "/login");
	}
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
