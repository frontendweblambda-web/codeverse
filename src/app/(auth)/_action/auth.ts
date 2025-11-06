"use server";

import { appConfig } from "@/src/core/config";
import { session } from "@/src/core/session/session";
import { User } from "@/src/generated/prisma/client";
import { db } from "@/src/lib/prisma-client";
import { loginSchema, registerSchema } from "@/src/schema/auth";
import { FormState } from "@/src/types";
import { ClientErrors, zodErrorFormat } from "@/src/utils/format-error";
import { JwtService } from "@/src/utils/jwt-token";
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

    if (!user) {
      return {
        ...formState,
        state: "error" as const,
        success: false,
        message: "Unauthorized access",
      } as FormState<User>;
    }

    const verified = await PasswordUtil.compare(password, user.password);

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
    console.log("User", user);

    await session({
      roles: roles,
      tenantId: user.tenant?.id!,
      userId: user.id,
      email: user.email,
    });

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
 * Signup user
 * @param formState
 * @param formData
 */
export async function signup(formState: FormState<User>, formData: FormData) {
  try {
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      mobile: formData.get("mobile"),
    };

    const parsedData = registerSchema.safeParse(body);
    if (!parsedData.success) {
      return {
        ...formState,
        state: "error" as const,
        success: false,
        errors: zodErrorFormat(parsedData.error, "client") as ClientErrors,
      } as FormState<User>;
    }

    const { name, mobile, email, password } = parsedData.data;
    const user = await db.user.findUnique({
      where: { email },
    });
    if (user) {
      return {
        ...formState,
        state: "error" as const,
        success: false,
        message: "User already existed",
      } as FormState<User>;
    }

    const hashPassword = await PasswordUtil.hash(password);
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        mobile,
      },
      omit: { password: true },
      include: { tenant: true },
    });

    return {
      ...formState,
      state: "success" as const,
      success: true,
      message: "You have successfully created account",
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
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
 * refresh token
 */
export async function refreshToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(appConfig.refreshSessionKey)?.value;
  if (!refreshToken) {
    await logout();
  }

  const verified = await JwtService.verifyRefreshToken(refreshToken!);
  if (!verified.valid || verified.expired) {
    await logout();
  }

  const newSession = await session({
    roles: verified.payload?.roles,
    tenantId: verified.payload?.tenantId!,
    userId: verified.payload?.userId!,
    email: verified.payload?.email!,
  });

  console.log("Refresht action call!");
  return newSession.accessToken;
}

/**
 * Logout
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(appConfig.accessSessionKey);
  cookieStore.delete(appConfig.refreshSessionKey);
  redirect("/login");
}
