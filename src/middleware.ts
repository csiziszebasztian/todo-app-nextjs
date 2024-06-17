import NextAuth from "next-auth";
import authConfig from "@/auth/auth.config";
import {
    publicRoutes,
    authRoutes,
    apiAuthPrefix,
    DEFAULT_SIGN_IN_REDIRECT,
    DEFAULT_SIGN_OUT_REDIRECT
} from "@/routes/routes";

const {auth} = NextAuth(authConfig);

export default auth((req): void | Response | Promise<void | Response> => {
    const {nextUrl} = req;
    const isSignedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoute) {
        if (isSignedIn) {
            return Response.redirect(new URL(DEFAULT_SIGN_IN_REDIRECT, nextUrl));
        }
        return;
    }

    if (!isSignedIn && !isPublicRoute) {
        return Response.redirect(new URL(DEFAULT_SIGN_OUT_REDIRECT, nextUrl));
    }

    return;
})

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}