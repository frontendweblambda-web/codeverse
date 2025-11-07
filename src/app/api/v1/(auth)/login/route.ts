import { NextRequest } from "next/server";

import ApiResponse from "@/utils/api-response";
import { hashToken } from "@/utils/hash-token";
import { JwtService } from "@/utils/jwt-token";
import { PasswordUtil } from "@/utils/password";

import { appConfig } from "@/core/config";
import { db } from "@/lib/prisma-client";
import { errorHandler } from "@/middleware/handle-error";
import { loginSchema } from "@/schema/auth";

import { NotFoundError, ValidationError } from "../../../_errors";
import { AuthError } from "../../../_errors/auth-error";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email, password } = body;

		const parsedData = loginSchema.safeParse(body);
		if (!parsedData.success) {
			throw new ValidationError(parsedData.error);
		}

		const user = await db.user.findUnique({
			where: { email },
			include: {
				tenant: true,
				roles: {
					include: {
						role: {
							include: {
								permissions: {
									include: {
										permission: true,
									},
								},
							},
						},
					},
				},
			},
		});
		if (!user) throw new NotFoundError("User not found");

		const verified = await PasswordUtil.compare(password, user.password);
		if (!verified) {
			throw new AuthError("Invalid password");
		}
		const roles = user.roles.map(({ role: { name, id, permissions } }) => ({
			name,
			permissions: permissions.map(({ permission: { name } }) => name),
		}));

		const accessToken = await JwtService.signAccessToken({
			email: user.email,
			userId: user.id,
			tenantId: user.tenant?.id!,
			roles,
		});

		const refreshToken = await JwtService.signRefreshToken({
			email: user.email,
			userId: email.id,
		});

		const hashRefreshToken = await hashToken(refreshToken);
		const userAgent = req.headers.get("user-agent");
		const ipAddress = req.headers.get("x-forwarded-for") || "unknown";

		const now = Date.now();
		await db.refreshToken.create({
			data: {
				userId: user.id,
				tokenHash: hashRefreshToken,
				createdAt: new Date(now),
				expiresAt: new Date(now + appConfig.refreshTokenTTL * 1000),
				ipAddress,
				userAgent,
			},
		});

		return ApiResponse({
			success: true,
			message: "Login successful",
			data: {
				expiresAt: now + appConfig.accessTokenTTL * 1000,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					isNewUser: user.isNewUser,
					roles: roles,
				},
				tokens: {
					accessToken,
					refreshToken,
				},
			},
		});
	} catch (error) {
		return errorHandler(error);
	}
}
