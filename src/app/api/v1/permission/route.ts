import { db } from "@/src/lib/prisma-client";
import { errorHandler } from "@/src/middleware/handle-error";
import ApiResponse from "@/src/utils/api-response";
import { queryParams } from "@/src/utils/queryParams";
import { slugify } from "@/src/utils/slug";
import { NextRequest } from "next/server";
import { ConflictError, ValidationError } from "../../_errors";
import { permissionSchema } from "@/src/schema/permission";

/**
 * Get permissions
 * @param req
 */
export async function GET(req: NextRequest) {
  try {
    const { order, sortBy, search } = queryParams(req.nextUrl.searchParams);
    const permissions = await db.permission.findMany({
      where: {
        name: { contains: search ?? "", mode: "insensitive" },
      },
      orderBy: {
        [sortBy || "createdAt"]: (order || "asc").toLowerCase(),
      },
    });

    return ApiResponse({
      data: permissions,
      message: "Permission retrieved",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * Permission create
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { name: string };
    const slug = slugify(body.name);

    const parsedData = permissionSchema.safeParse(body);
    if (!parsedData.success) {
      throw new ValidationError(parsedData.error);
    }

    const hasPermission = await db.permission.findUnique({ where: { slug } });
    if (hasPermission) throw new ConflictError("Permission already existed");

    const permission = await db.permission.create({
      data: {
        name: body.name,
        slug,
      },
    });

    return ApiResponse(
      {
        data: permission,
        message: "Permission retrieved",
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}
