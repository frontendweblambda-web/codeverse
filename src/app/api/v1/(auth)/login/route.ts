import { loginSchema } from "@/src/schema/auth";
import { NextRequest } from "next/server";
import { NotFoundError, ValidationError } from "../../../_errors";
import { errorHandler } from "@/src/middleware/handle-error";
import { db } from "@/src/lib/prisma-client";
import { PasswordUtil } from "@/src/utils/password";
import { AuthError } from "../../../_errors/auth-error";
import { JwtService } from "@/src/utils/jwt-token";
import ApiResponse from "@/src/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const parsedData = loginSchema.safeParse(body);
    if (!parsedData.success) {
      throw new ValidationError(parsedData.error);
    }

    const user = await db.user.findUnique({
      where: { email },
      include: { tenant: true },
    });
    if (!user) throw new NotFoundError("User not found");

    const verified = await PasswordUtil.compare(password, user.password);
    if (!verified) {
      throw new AuthError("Invalid password");
    }

    const accessToken = await JwtService.sign({
      email: user.email,
      userId: user.id,
      tenantId: user.tenant?.id!,
    });

    const refreshToken = await JwtService.refresh({
      email: user.email,
      userId: email.id,
    });

    return ApiResponse({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isNewUser: user.isNewUser,
          tenant: user.tenant,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    return errorHandler(error);
  }
}
