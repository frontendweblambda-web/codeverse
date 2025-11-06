import { NextRequest } from "next/server";

import ApiResponse from "@/utils/api-response";
import { JwtService } from "@/utils/jwt-token";
import { PasswordUtil } from "@/utils/password";

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
				role: {
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

		const roles = user.role.map(({ role: { name, id, permissions } }) => ({
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

		return ApiResponse({
			success: true,
			message: "Login successful",
			data: {
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
