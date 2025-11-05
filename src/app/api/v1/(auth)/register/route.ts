import { errorHandler } from "@/src/middleware/handle-error";
import { registerSchema } from "@/src/schema/auth";
import { NextRequest } from "next/server";
import { ConflictError, ValidationError } from "../../../_errors";
import { db } from "@/src/lib/prisma-client";

export async function POST(req: NextRequest) {
  try {
    // parsed body
    const {
      email,
      password,
      name,
      mobile,
      role = "admin",
    } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
      mobile?: string;
      role?: string;
    };

    // validation
    const parsedData = registerSchema.safeParse({ email, password });
    if (!parsedData.success) {
      throw new ValidationError(parsedData.error);
    }

    // check user exist
    const userExist = await db.user.findUnique({ where: { email } });
    if (userExist) {
      throw new ConflictError("User with this email already existed!");
    }

    const user = await db.user.create({
      data: { email, password, name, mobile },
    });
  } catch (error) {
    return errorHandler(error);
  }
}
