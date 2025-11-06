import { NextRequest, NextResponse } from "next/server";
import auth from "./middleware/auth";
import { getSession } from "./core/session/session";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/api/v1/login",
  "/api/v1/signup",
  "/api/v1/forgot-password",
  "/api/v1/health",
];

const redirectToLogin = (req: NextRequest) => {
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
};

export default async function Propxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const allowed = PUBLIC_ROUTES.some((path) => path === pathname);
  if (allowed) {
    return NextResponse.next();
  }

  /// headers
  if (pathname.startsWith("/api/v1")) {
    return await auth(req);
  }

  const session = await getSession();
  if (!session) return redirectToLogin(req);

  // Admin pages
  if (
    pathname.startsWith("/admin") &&
    !session.payload?.roles?.some((role) =>
      ["admin", "superadmin"].includes(role.name)
    )
  ) {
    return redirectToLogin(req);
  }

  // User pages
  if (
    pathname.startsWith("/me") &&
    !session.payload?.roles?.some((role) =>
      ["owner", "member"].includes(role.name)
    )
  ) {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/me/:path*",
    "/api/v1/:path*",
    "/((?!_next/static|_next/image|favicon.ico|images|assets|public).*)",
  ],
};
