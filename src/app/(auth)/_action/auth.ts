"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClientErrors, zodErrorFormat } from "@/utils/format-error";
import { JwtService } from "@/utils/jwt-token";
import { PasswordUtil } from "@/utils/password";

import { appConfig } from "@/core/config";
import { session } from "@/core/session/session";
import { User } from "@/generated/prisma/client";
import { db } from "@/lib/prisma-client";
import { loginSchema, registerSchema } from "@/schema/auth";
import { FormState } from "@/types";

/**
 * Login action
 * @param formState
 * @param formData
 * @returns
 */
export async function login(formState: FormState<User>, formData: FormData) {
	try {
		const body = {
			email: formData.get("email"),
			password: formData.get("password"),
		};

		const parsedData = loginSchema.safeParse(body);
		if (!parsedData.success) {
			return {
				...formState,
				state: "error" as const,
				success: false,
				errors: zodErrorFormat(parsedData.error, "client") as ClientErrors,
			} as FormState<User>;
		}

		const { email, password } = parsedData.data;
		const user = await db.user.findUnique({
			where: { email },
			include: {
				tenant: true,
				role: {
					include: {
						role: {
							include: {
								permissions: {
									include: { permission: true },
								},
							},
						},
					},
				},
			},
		});

		if (!user) {
			return {
				...formState,
				state: "error" as const,
				success: false,
				message: "Unauthorized access",
			} as FormState<User>;
		}

		const verified = await PasswordUtil.compare(password, user.password);

		if (!verified) {
			return {
				...formState,
				state: "error" as const,
				success: false,
				message: "Invalid password",
			};
		}
		const roles = user.role.map(({ role: { name, permissions } }) => ({
			name,
			permissions: permissions.map(({ permission: { name } }) => name),
		}));
		console.log("User", user);

		await session({
			roles: roles,
			tenantId: user.tenant?.id!,
			userId: user.id,
			email: user.email,
		});

		return {
			...formState,
			data: user,
			success: true,
			state: "success",
			message: "You have successfully login",
		} as FormState<User>;
	} catch (error) {
		return {
			...formState,
			state: "error" as const,
			success: false,
			message: error instanceof Error ? error.message : "",
		} as FormState<User>;
	}
}

/**
 * Signup user
 * @param formState
 * @param formData
 */
export async function signup(formState: FormState<User>, formData: FormData) {
	const body = {
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
		mobile: formData.get("mobile"),
	};
	try {
		const parsedData = registerSchema.safeParse(body);
		if (!parsedData.success) {
			return {
				...formState,
				state: "error" as const,
				success: false,
				errors: zodErrorFormat(parsedData.error, "client") as ClientErrors,
				values: body,
			} as FormState<User>;
		}

		const role = await db.role.findFirst({ where: { slug: "owner" } });
		const { name, mobile, email, password } = parsedData.data;
		const user = await db.user.findUnique({
			where: { email },
		});
		if (user) {
			return {
				...formState,
				state: "error" as const,
				success: false,
				message: "User already existed",
				values: body,
			} as FormState<User>;
		}

		const hashPassword = await PasswordUtil.hash(password);
		const newUser = await db.user.create({
			data: {
				name,
				email,
				password: hashPassword,
				mobile,
				role: {
					create: { roleId: role?.id! },
				},
			},
			omit: { password: true },
			include: { tenant: true },
		});

		return {
			...formState,
			state: "success" as const,
			success: true,
			message: "You have successfully created account",
			data: {
				id: newUser.id,
				email: newUser.email,
				name: newUser.name,
			},
		} as FormState<User>;
	} catch (error) {
		return {
			...formState,
			state: "error" as const,
			success: false,
			message: error instanceof Error ? error.message : "",
			values: body,
		} as FormState<User>;
	}
}

/**
 * refresh token
 */
export async function refreshToken() {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get(appConfig.refreshSessionKey)?.value;
	if (!refreshToken) {
		await logout();
	}

	const verified = await JwtService.verifyRefreshToken(refreshToken!);
	if (!verified.valid || verified.expired) {
		await logout();
	}

	const newSession = await session({
		roles: verified.payload?.roles,
		tenantId: verified.payload?.tenantId!,
		userId: verified.payload?.userId!,
		email: verified.payload?.email!,
	});

	console.log("Refresht action call!");
	return newSession.accessToken;
}

/**
 * Logout
 */
export async function logout() {
	const cookieStore = await cookies();
	cookieStore.delete(appConfig.accessSessionKey);
	cookieStore.delete(appConfig.refreshSessionKey);
	redirect("/login");
}
