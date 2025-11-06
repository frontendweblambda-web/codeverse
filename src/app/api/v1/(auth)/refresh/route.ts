import { NextRequest } from "next/server";

import { AuthError, BadRequestError } from "@/app/api/_errors";

import { JwtService } from "@/utils/jwt-token";

import { errorHandler } from "@/middleware/handle-error";

/**
 * Refresh token
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
	try {
		const { refreshToken } = (await req.json()) as { refreshToken: string };
		if (!refreshToken) throw new BadRequestError("Invalid refresh token");

		const verified = await JwtService.verifyRefreshToken(refreshToken);
		if (!verified) throw new AuthError("Invalid token");

		const accessToken = await JwtService.signAccessToken({
			roles: verified.payload?.roles,
			tenantId: verified.payload?.tenantId!,
			userId: verified.payload?.userId!,
			email: verified.payload?.email!,
		});
	} catch (error) {
		return errorHandler(error);
	}
}
