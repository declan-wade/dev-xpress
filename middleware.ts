import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isManagerRoute = createRouteMatcher(["/manager(.*)"]);
const isSeniorRoute = createRouteMatcher(["/reviews(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/assess(.*)",
  "/dashboard(.*)",
  "/referrals(.*)",
  "/reviews(.*)",
  "/manager(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const { sessionClaims }: any = auth();
    console.log(sessionClaims);
    if (isManagerRoute(req)) {
      if (sessionClaims?.public_metadata?.position !== "manager") {
        throw new Error("Access denied. Manager access required.");
      }
    } else if (isSeniorRoute(req)) {
      if (
        sessionClaims?.public_metadata?.position !== "manager" &&
        sessionClaims?.public_metadata?.position !== "senior"
      ) {
        throw new Error("Access denied. Senior or Manager access required.");
      }
    }

    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next|signin).*)",
    "/assess",
    "/dashboard",
    "/referrals",
    "/reviews",
    "/manager",
  ],
};
