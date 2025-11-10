import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { hashToken } from "@/utils/hash-token";

import { appConfig } from "@/core/config";
import { db } from "@/lib/prisma-client";
import { errorHandler } from "@/middleware/handle-error";

/**
 * Logout
 * @returns
 */
export async function POST() {
	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get(appConfig.refreshSessionKey)?.value!;

		const oldTokenHash = await hashToken(refreshToken);
		const dbToken = await db.refreshToken.findFirst({
			where: { tokenHash: oldTokenHash },
		});

		await db.refreshToken.update({
			where: { id: dbToken?.id },
			data: { revokedAt: new Date() },
		});
		cookieStore.delete(appConfig.refreshSessionKey);

		return NextResponse.json({
			message: "Successfully logout",
			data: null,
		});
	} catch (error) {
		return errorHandler(error);
	}
}
