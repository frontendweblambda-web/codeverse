import { NextRequest } from "next/server";

import ApiResponse from "@/utils/api-response";
import { slugify } from "@/utils/slug";

import { db } from "@/lib/prisma-client";
import { errorHandler } from "@/middleware/handle-error";

import { NotFoundError } from "../../../_errors";

/**
 * Get single role
 * @param _req
 * @param ctx
 */
export async function GET(
	_req: NextRequest,
	ctx: RouteContext<"/api/v1/role/[slug]">,
) {
	try {
		const { slug } = await ctx.params;
		const role = await db.role.findUnique({ where: { slug: slugify(slug) } });
		if (!role) throw new NotFoundError("Role not found!");
		return ApiResponse({ data: role, message: "Role retrieve" });
	} catch (error) {
		return errorHandler(error);
	}
}

/**
 * Update role
 * @param _req
 * @param ctx
 */
export async function PUT(
	req: NextRequest,
	ctx: RouteContext<"/api/v1/role/[slug]">,
) {
	try {
		const { slug } = await ctx.params;
		const role = await db.role.findUnique({ where: { slug: slugify(slug) } });
		if (!role) throw new NotFoundError("Role not found!");

		const body = (await req.json()) as { name: string };
		const updateSlug = slugify(body.name);

		const updateRole = await db.role.update({
			where: { slug },
			data: {
				name: body.name,
				slug: updateSlug,
			},
		});

		return ApiResponse({ data: updateRole, message: "Role updated!" });
	} catch (error) {
		return errorHandler(error);
	}
}

/**
 * Delete role
 * @param _req
 * @param ctx
 */
export async function DELETE(
	_req: NextRequest,
	ctx: RouteContext<"/api/v1/role/[slug]">,
) {
	try {
		const { slug } = await ctx.params;
		const role = await db.role.findUnique({ where: { slug: slugify(slug) } });
		if (!role) throw new NotFoundError("Role not found!");
		const updateRole = await db.role.delete({
			where: { slug },
		});

		return ApiResponse({ data: updateRole, message: "Role deleted!" });
	} catch (error) {
		return errorHandler(error);
	}
}
