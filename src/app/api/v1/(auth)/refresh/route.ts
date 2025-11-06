import { NextRequest } from "next/server";

import { AuthError } from "@/app/api/_errors";

import ApiResponse from "@/utils/api-response";
import { hashToken } from "@/utils/hash-token";
import { JwtService } from "@/utils/jwt-token";

import { appConfig } from "@/core/config";
import { db } from "@/lib/prisma-client";
import { errorHandler } from "@/middleware/handle-error";

/**
 * Refresh token
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
	try {
		// 1️⃣ Get refresh token from client or cookie
		const { refreshToken } = (await req.json()) as { refreshToken?: string };
		const token =
			refreshToken || req.cookies.get(appConfig.refreshSessionKey)?.value;
		if (!token) throw new AuthError("No refresh token found");

		const oldTokenHash = await hashToken(token);

		// 1️⃣ Check token in DB
		const dbToken = await db.refreshToken.findFirst({
			where: {
				tokenHash: oldTokenHash,
				revokedAt: null,
				expiresAt: { gt: new Date() },
			},
			include: {
				user: {
					include: {
						tenant: true,
						roles: {
							include: {
								role: {
									include: { permissions: { include: { permission: true } } },
								},
							},
						},
					},
				},
			},
		});

		if (!dbToken) throw new AuthError("Invalid or revoked refresh token");

		await db.refreshToken.update({
			where: { id: dbToken.id },
			data: { revokedAt: new Date() },
		});

		// 3️⃣ Verify token JWT
		const verified = await JwtService.verifyRefreshToken(token);
		if (!verified.valid || verified.expired)
			throw new AuthError("Expired or invalid token");

		// 6️⃣ (Optional) Rotate refresh token for extra security
		const newRefreshToken = await JwtService.signRefreshToken({
			userId: verified.payload?.userId!,
			email: verified.payload?.email!,
		});
		const newRefreshTokenHash = await hashToken(newRefreshToken);
		const now = Date.now(); // current time in seconds
		await db.refreshToken.create({
			data: {
				userId: verified.payload?.userId as string,
				tokenHash: newRefreshTokenHash,
				expiresAt: new Date(now + appConfig.refreshTokenTTL * 1000),
				ipAddress: dbToken.ipAddress,
				deviceId: dbToken.deviceId,
			},
		});

		// 6️⃣ Sign new access token
		const roles = dbToken.user.roles.map(({ role: { name, permissions } }) => ({
			name,
			permissions: permissions.map(({ permission: { name } }) => name),
		}));
		const accessToken = await JwtService.signAccessToken({
			userId: verified.payload?.userId!,
			email: verified.payload?.email!,
			tenantId: dbToken.user.tenant?.id!,
			roles: roles,
		});

		return ApiResponse({
			success: true,
			message: "Token refreshed",
			data: {
				tokens: {
					accessToken,
					refreshToken: newRefreshToken,
				},
			},
		});
	} catch (error) {
		return errorHandler(error);
	}
}
