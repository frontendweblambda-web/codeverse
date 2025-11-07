import { NextRequest } from "next/server";

import ApiResponse from "@/utils/api-response";
import { PasswordUtil } from "@/utils/password";
import { slugify } from "@/utils/slug";

import { db } from "@/lib/prisma-client";
import { errorHandler } from "@/middleware/handle-error";
import { registerSchema } from "@/schema/auth";
import { Prisma } from "@prisma/client";

import {
	ConflictError,
	NotFoundError,
	ValidationError,
} from "../../../_errors";

export async function POST(req: NextRequest) {
	try {
		// parsed body
		const body = (await req.json()) as {
			name: string;
			email: string;
			password: string;
			mobile?: string;
			role?: string;
		};

		const { email, password, name, mobile, role = "owner" } = body;
		// validation
		const parsedData = registerSchema.safeParse(body);
		if (!parsedData.success) {
			throw new ValidationError(parsedData.error);
		}

		// check user exist

		const user = await db.$transaction(async (tx: Prisma.TransactionClient) => {
			// check role
			const existRole = await tx.role.findFirst({ where: { slug: role } });
			const existUser = await tx.user.findUnique({ where: { email } });

			if (!existRole) throw new NotFoundError("Role not found");
			if (existUser) throw new ConflictError("User already existed");

			const hashPassword = await PasswordUtil.hash(password);
			const user = await tx.user.create({
				data: {
					name,
					email,
					password: hashPassword,
					mobile,
					roles: { create: { roleId: existRole.id } },
				},
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

			const exitTenant = await tx.tenant.findFirst({
				where: { ownerId: user.id },
			});
			if (exitTenant) throw new ConflictError("Tenant already existed");

			await tx.tenant.create({
				data: {
					name,
					slug: slugify(name),
					ownerId: user.id,
				},
			});
			return user;
		});
		const roles = user.roles.map(({ role: { name, id, permissions } }) => ({
			name,
			permissions: permissions.map(({ permission: { name } }) => name),
		}));

		return ApiResponse(
			{
				data: {
					id: user.id,
					email: user.email,
					name: user.name,
					isNewUser: user.isNewUser,
					roles,
				},
				message: "User registered successfully!",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.log(JSON.stringify(error, null, 2));
		return errorHandler(error);
	}
}
