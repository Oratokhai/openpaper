import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/home(.*)",
  "/write(.*)",
  "/studio(.*)",
  "/drafts(.*)",
  "/saved(.*)",
  "/notifications(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jte?2|ttf|woff2?|ico|gif|svg|png|jpg|jpeg|webp|avif)).*)",
    "/(api|trpc)(.*)",
  ],
};
