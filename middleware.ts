import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/restaurants/add",
  "/:locale/restaurants/(.*)/edit",
  "/:locale/restaurants/(.*)/delete",
  "/:locale/restaurants/(.*)/reviews/add",
  "/:locale/restaurants/(.*)/reviews/(.*)/edit",
  "/:locale/restaurants/(.*)/reviews/(.*)/delete",
]);

const isPublicRoute = createRouteMatcher([
  "/api/(.*)",
  "/sitemap.xml",
  "/robots.txt",
]);

export default clerkMiddleware(async (auth, req) => {
  // Skip intl middleware for API routes and static files
  if (isPublicRoute(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
