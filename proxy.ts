import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/admin-session";

const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_API_LOGIN_PATH = "/api/admin/login";
const ADMIN_API_LOGOUT_PATH = "/api/admin/logout";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname === ADMIN_LOGIN_PATH ||
    pathname === ADMIN_API_LOGIN_PATH ||
    pathname === ADMIN_API_LOGOUT_PATH
  ) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("admin_session")?.value;
  const isAuthenticated = sessionToken
    ? await verifyAdminSessionToken(sessionToken)
    : false;

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = ADMIN_LOGIN_PATH;
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}
