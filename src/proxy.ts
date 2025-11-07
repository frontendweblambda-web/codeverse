import { NextRequest, NextResponse } from "next/server";

import { getSession } from "./core/session/session";
import auth from "./middleware/auth";

const PUBLIC_ROUTES = [
	"/login",
	"/signup",
	"/forgot-password",
	"/api/v1/login",
	"/api/v1/signup",
	"/api/v1/forgot-password",
	"/api/v1/health",
];

const allowedOrigins = ["http://localhost:5173"];

const corsHeaders = {
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const redirectToLogin = (req: NextRequest) => {
	const loginUrl = new URL("/login", req.url);
	loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
	return NextResponse.redirect(loginUrl);
};

export default async function Proxy(req: NextRequest) {
	const origin = req.headers.get("origin") ?? "";
	const isAllowedOrigin = allowedOrigins.includes(origin);

	// Handle preflight OPTIONS requests for API calls
	if (req.method === "OPTIONS") {
		const headers: Record<string, string> = {
			...corsHeaders,
			...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
		};
		return new NextResponse(null, { headers });
	}

	const pathname = req.nextUrl.pathname;

	// Always add CORS headers for API routes requested from client
	const response = NextResponse.next();
	if (pathname.startsWith("/api/v1") && isAllowedOrigin) {
		response.headers.set("Access-Control-Allow-Origin", origin);
		Object.entries(corsHeaders).forEach(([key, val]) =>
			response.headers.set(key, val),
		);
	}

	// Skip auth for public routes
	const isPublic = PUBLIC_ROUTES.some((path) => path === pathname);
	if (isPublic) return response;

	// API auth
	if (pathname.startsWith("/api/v1")) {
		return await auth(req);
	}

	// Session-based auth for pages
	const session = await getSession();
	if (!session) return redirectToLogin(req);

	if (
		pathname.startsWith("/admin") &&
		!session.payload?.roles?.some((role) =>
			["admin", "superadmin"].includes(role.name),
		)
	) {
		return redirectToLogin(req);
	}

	if (
		pathname.startsWith("/me") &&
		!session.payload?.roles?.some((role) =>
			["owner", "member"].includes(role.name),
		)
	) {
		return redirectToLogin(req);
	}

	return response;
}

export const config = {
	matcher: [
		"/admin/:path*",
		"/me/:path*",
		"/api/v1/:path*",
		"/((?!_next/static|_next/image|favicon.ico|images|assets|public).*)",
	],
};
