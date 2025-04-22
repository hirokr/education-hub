import { NextRequest, NextResponse } from "next/server";
import authConfig from "./lib/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
  const session = await auth();
  const isAuth = session?.user?.email ? true : false;
  if (req.url === "http://localhost:3000/dashboard") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!isAuth && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-up", req.url));
  }
});
export const config = {
  matcher: ["/dashboard/:path*", "/community/:path*"],
};
