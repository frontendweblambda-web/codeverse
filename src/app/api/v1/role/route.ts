import { db } from "@/src/lib/prisma-client";
import { errorHandler } from "@/src/middleware/handle-error";
import ApiResponse from "@/src/utils/api-response";
import { queryParams } from "@/src/utils/queryParams";
import { slugify } from "@/src/utils/slug";
import { NextRequest, NextResponse } from "next/server";
import { ConflictError } from "../../_errors/conflict-error";
import { roleSchema } from "@/src/schema/role";
import { ValidationError } from "../../_errors";

/**
 * Get all roles
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    const params = queryParams(req.nextUrl.searchParams);
    const { order, search, sortBy } = params;
    // const defaultPage = parseInt(page || "1");
    // const defaultSkip = parseInt(skip || "10");
    const roles = await db.role.findMany({
      where: { name: { contains: search ?? "", mode: "insensitive" } },
      orderBy: {
        [sortBy || "createdAt"]: (order ?? "asc").toLowerCase(),
      },
    });

    return ApiResponse({
      data: roles,
      success: true,
      message: "Roles retrieved",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * Create new role api
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { name: string };

    const parsedSchema = roleSchema.safeParse(body);
    if (!parsedSchema.success) {
      throw new ValidationError(parsedSchema.error);
    }

    const slug = slugify(body.name);
    const roleExist = await db.role.findUnique({
      where: { slug },
    });

    if (roleExist) {
      throw new ConflictError("Role already existed");
    }

    const newRole = await db.role.create({
      data: {
        name: body.name,
        slug,
      },
    });

    return ApiResponse(
      {
        data: newRole,
        message: "Role created",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}
