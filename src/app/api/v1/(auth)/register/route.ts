import { errorHandler } from "@/src/middleware/handle-error";
import { registerSchema } from "@/src/schema/auth";
import { NextRequest } from "next/server";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../_errors";
import { db } from "@/src/lib/prisma-client";
import { Prisma } from "@/src/generated/prisma/client";
import { slugify } from "@/src/utils/slug";
import ApiResponse from "@/src/utils/api-response";
import { PasswordUtil } from "@/src/utils/password";

export async function POST(req: NextRequest) {
  try {
    // parsed body
    const body = (await req.json()) as {
      name: string;
      email: string;
      password: string;
      mobile?: string;
      role?: string;
    };
    console.log("BODY", body);
    const { email, password, name, mobile, role = "owner" } = body;
    // validation
    const parsedData = registerSchema.safeParse(body);
    if (!parsedData.success) {
      throw new ValidationError(parsedData.error);
    }

    // check user exist

    const user = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // check role
      const existRole = await tx.role.findFirst({ where: { slug: role } });
      const existUser = await tx.user.findUnique({ where: { email } });

      if (!existRole) throw new NotFoundError("Role not found");
      if (existUser) throw new ConflictError("User already existed");

      const hashPassword = await PasswordUtil.hash(password);
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          mobile,
          role: { create: { roleId: existRole.id } },
        },
      });

      const exitTenant = await tx.tenant.findFirst({
        where: { ownerId: user.id },
      });
      if (exitTenant) throw new ConflictError("Tenant already existed");

      await tx.tenant.create({
        data: {
          name,
          slug: slugify(name),
          ownerId: user.id,
        },
      });

      return user;
    });

    return ApiResponse(
      {
        data: user,
        message: "User registered successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return errorHandler(error);
  }
}
