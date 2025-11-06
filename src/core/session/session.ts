import { cookies } from "next/headers";

import { JwtService, Payload } from "@/utils/jwt-token";

import "server-only";

import { appConfig } from "../config";

/**
 * Generate session
 * @param payload
 */
export const session = async (payload: Payload) => {
	const accessToken = await JwtService.signAccessToken(payload); // expired in 15m
	const refreshToken = await JwtService.signRefreshToken(payload); // expired in 7d

	console.log("TOKEN", accessToken, refreshToken);
	const cookieStore = await cookies();

	// access token
	cookieStore.set({
		...appConfig.cookieSettings,
		name: appConfig.accessSessionKey,
		value: accessToken,
		maxAge: appConfig.accessTokenTTL,
	});

	// refresh token
	cookieStore.set({
		...appConfig.cookieSettings,
		name: appConfig.refreshSessionKey,
		value: refreshToken,
		maxAge: appConfig.refreshTokenTTL,
	});

	console.log("Session generated!");
	return { accessToken, refreshToken };
};

export const updateSession = async () => {
	const cookieStore = await cookies();

	const refreshToken = cookieStore.get(appConfig.refreshSessionKey)?.value;
	if (!refreshToken) return null;

	const verified = await JwtService.verifyRefreshToken(refreshToken!);
	if (!verified.valid || verified.expired) return null;

	// Issue new access token
	await session({
		roles: verified.payload?.roles,
		tenantId: verified.payload?.tenantId!,
		userId: verified.payload?.userId!,
		email: verified.payload?.email!,
	});

	console.log("Update session call");
};
/**
 * Get user session
 * @returns
 */
export const getSession = async () => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(appConfig.accessSessionKey)?.value;
	if (!accessToken) {
		// No access token, try refresh token
		return null; /// await updateSession();
	}

	const verified = await JwtService.verifyAccessToken(accessToken);
	if (!verified.valid || verified.expired) {
		return null; //	await updateSession(); // expired, refresh
	}

	return verified;
};
