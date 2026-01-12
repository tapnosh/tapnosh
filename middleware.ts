import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales, routing } from "@/i18n/routing";

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
  "/docs",
  "/docs/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Redirect /:locale/docs to /docs (docs are served without locale prefix)
  const docsWithLocaleMatch = pathname.match(/^\/([a-z]{2})\/docs(\/.*)?$/i);
  if (docsWithLocaleMatch) {
    const restOfPath = docsWithLocaleMatch[2] || "";
    const newUrl = new URL(`/docs${restOfPath}`, req.url);
    newUrl.search = req.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  // Skip intl middleware for API routes and static files
  if (isPublicRoute(req)) {
    return;
  }

  // Check if the first path segment looks like an invalid locale
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // If the first segment is a 2-3 letter code but not a valid locale,
  // redirect to the default locale with the rest of the path
  if (
    firstSegment &&
    /^[a-z]{2,3}$/i.test(firstSegment) &&
    !locales.includes(firstSegment as (typeof locales)[number])
  ) {
    const restOfPath = segments.slice(1).join("/");
    const newUrl = new URL(`/${defaultLocale}/${restOfPath}`, req.url);
    newUrl.search = req.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|otf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
