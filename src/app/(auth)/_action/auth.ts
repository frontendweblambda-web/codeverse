"use server";

import { appConfig } from "@/src/core/config";
import { session } from "@/src/core/session/session";
import { User } from "@/src/generated/prisma/client";
import { db } from "@/src/lib/prisma-client";
import { loginSchema } from "@/src/schema/auth";
import { FormState } from "@/src/types";
import { ClientErrors, zodErrorFormat } from "@/src/utils/format-error";
import { PasswordUtil } from "@/src/utils/password";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Login action
 * @param formState
 * @param formData
 * @returns
 */
export async function login(formState: FormState<User>, formData: FormData) {
  try {
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const parsedData = loginSchema.safeParse(body);
    if (!parsedData.success) {
      return {
        ...formState,
        state: "error" as const,
        success: false,
        errors: zodErrorFormat(parsedData.error, "client") as ClientErrors,
      } as FormState<User>;
    }

    const { email, password } = parsedData.data;
    const user = await db.user.findUnique({
      where: { email },
      include: {
        tenant: true,
        role: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });
    console.log("User", user);
    if (!user) {
      return {
        ...formState,
        state: "error" as const,
        success: false,
        message: "Unauthorized access",
      } as FormState<User>;
    }

    const verified = await PasswordUtil.compare(password, user.password);
    console.log("V", verified);
    if (!verified) {
      return {
        ...formState,
        state: "error" as const,
        success: false,
        message: "Invalid password",
      };
    }
    const roles = user.role.map(({ role: { name, permissions } }) => ({
      name,
      permissions: permissions.map(({ permission: { name } }) => name),
    }));
    const s = await session({
      roles: roles,
      tenantId: user.tenant?.id!,
      userId: user.id,
      email: user.email,
    });

    console.log("user", user, roles, s);
    return {
      ...formState,
      data: user,
      success: true,
      state: "success",
      message: "You have successfully login",
    } as FormState<User>;
  } catch (error) {
    return {
      ...formState,
      state: "error" as const,
      success: false,
      message: error instanceof Error ? error.message : "",
    } as FormState<User>;
  }
}

/**
 * Logout
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(appConfig.accessSessionKey);
  redirect("/login");
}
