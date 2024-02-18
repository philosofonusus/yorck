import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import { authMiddleware } from "@clerk/nextjs/server";
import { UserRole } from "./types/user";

export default authMiddleware({
  ignoredRoutes: "/api/cron",
  // Public routes are routes that don't require authentication
  publicRoutes: [
    "/",
    "/signin(.*)",
    "/signup(.*)",
    "/sso-callback(.*)",
    "/api(.*)",
  ],
  async afterAuth(auth, req) {
    if (auth.isPublicRoute) {
      //  For public routes, we don't need to do anything
      return NextResponse.next();
    }

    const url = new URL(req.nextUrl.origin);

    if (!auth.userId) {
      //  If user tries to access a private route without being authenticated,
      //  redirect them to the sign in page
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }

    const user = await clerkClient.users.getUser(auth.userId);

    if (!user) {
      throw new Error("User not found.");
    }

    // If the user doesn't have a role, set it to user
    if (!user.privateMetadata.role) {
      await clerkClient.users.updateUserMetadata(auth.userId, {
        privateMetadata: {
          role: UserRole.GUEST,
        },
      });
    }
  },
});

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api)(.*)"],
// };
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api)(.*)"],
};
