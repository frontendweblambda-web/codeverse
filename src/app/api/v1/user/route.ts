import { db } from "@/src/lib/prisma-client";
import { errorHandler } from "@/src/middleware/handle-error";
import ApiResponse from "@/src/utils/api-response";
import { queryParams } from "@/src/utils/queryParams";
import { NextRequest } from "next/server";

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
