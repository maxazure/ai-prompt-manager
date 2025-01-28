import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // 公开路由
  publicRoutes: ["/"]
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
