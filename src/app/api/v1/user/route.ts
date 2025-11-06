import { NextRequest } from "next/server";

import ApiResponse from "@/utils/api-response";
import { queryParams } from "@/utils/queryParams";

import { db } from "@/lib/prisma-client";
import { errorHandler } from "@/middleware/handle-error";

export async function GET(req: NextRequest) {
	try {
		const searchParams = new URLSearchParams(req.nextUrl.searchParams);
		const { sortBy, order, search } = queryParams(searchParams);
		const users = await db.user.findMany({
			where: { name: { contains: search ?? "", mode: "insensitive" } },
			orderBy: {
				[sortBy || "createdAt"]: (order || "asc").toLowerCase(),
			},
			omit: { password: true },
			include: {
				tenant: true,
				role: {
					include: {
						role: {
							include: { permissions: { include: { permission: true } } },
						},
					},
				},
			},
		});

		return ApiResponse({
			data: users,
		});
	} catch (error) {
		return errorHandler(error);
	}
}
