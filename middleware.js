import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  //追加
  publicRoutes:['/']
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};