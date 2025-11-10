import { NextRequest, NextResponse } from "next/server";

import { AuthError } from "../app/api/_errors/auth-error";
import { JwtService, VerifiedToken } from "../utils/jwt-token";
import { errorHandler } from "./handle-error";

declare module "next/server" {
	interface NextRequest {
		payload?: VerifiedToken;
	}
}

export default async function auth(req: NextRequest) {
	try {
		const header = req.headers.get("authorization");
		if (!header) throw new AuthError("Aunauthorzed access");

		const token = header.split(" ")[1];
		if (!token) throw new AuthError("No access token found");

		const verified = await JwtService.verifyAccessToken(token);
		if (!verified.valid || verified.expired) {
			throw new AuthError("Token expired or invalid");
		}

		const response = NextResponse.next();

		// Attach userId as a header for downstream API route
		response.headers.set("x-user-id", verified.payload?.userId || "");

		return response;
	} catch (error) {
		return errorHandler(error);
	}
}
