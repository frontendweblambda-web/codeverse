import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/prisma-client";
import { errorHandler } from "@/middleware/handle-error";

/**
 * Get user by id
 * @param _req
 * @param ctx
 * @returns
 */
export async function GET(req: NextRequest) {
	try {
		const userId = req.headers.get("x-user-id");
		const user = await db.user.findUnique({
			where: { id: userId! },
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
		});

		return NextResponse.json({ data: user });
	} catch (error) {
		return errorHandler(error);
	}
}
