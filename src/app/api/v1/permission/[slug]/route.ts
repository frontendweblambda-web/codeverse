import { NextRequest } from "next/server";

import ApiResponse from "@/utils/api-response";
import { slugify } from "@/utils/slug";

import { db } from "@/lib/prisma-client";
import { errorHandler } from "@/middleware/handle-error";
import { permissionSchema } from "@/schema/permission";

import {
	ConflictError,
	NotFoundError,
	ValidationError,
} from "../../../_errors";

/**
 * Get permission
 * @param _req
 * @param ctx
 */
export async function GET(
	_req: NextRequest,
	ctx: RouteContext<"/api/v1/permission/[slug]">,
) {
	try {
		const { slug } = await ctx.params;
		const permission = await db.permission.findUnique({
			where: { slug },
		});
		if (!permission) throw new NotFoundError("Permission not found");
		return ApiResponse({
			data: permission,
		});
	} catch (error) {
		return errorHandler(error);
	}
}

/**
 * Update permission
 * @param req
 * @param ctx
 */
export async function PUT(
	req: NextRequest,
	ctx: RouteContext<"/api/v1/permission/[slug]">,
) {
	try {
		const body = (await req.json()) as { name: string };
		const slug = slugify(body.name);
		const parsedData = permissionSchema.safeParse(body);
		if (!parsedData.success) {
			throw new ValidationError(parsedData.error);
		}

		const hasPermission = await db.permission.findUnique({ where: { slug } });
		if (hasPermission) throw new ConflictError("Permission already existed");

		const permission = await db.permission.update({
			where: { slug },
			data: { name: body.name, slug },
		});

		return ApiResponse({
			data: permission,
			message: "Permission updated",
		});
	} catch (error) {
		return errorHandler(error);
	}
}

/**
 * Delete permission
 * @param _req
 * @param ctx
 */
export async function DELETE(
	_req: NextRequest,
	ctx: RouteContext<"/api/v1/permission/[slug]">,
) {
	try {
		const { slug } = await ctx.params;
		const permission = await db.permission.delete({
			where: { slug },
		});
		if (!permission) throw new NotFoundError("Permission not found");
		return ApiResponse({ data: permission });
	} catch (error) {
		return errorHandler(error);
	}
}
