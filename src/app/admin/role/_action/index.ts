"use server";

import { Role } from "@/src/generated/prisma/client";
import { createRoleDB, findRoles } from "../_lib/role.db";
import { FormState } from "@/src/types";
import { roleSchema } from "@/src/schema/role";
import { zodErrorFormat } from "@/src/utils/format-error";

export const getRoles = async (
  searchParams: URLSearchParams
): Promise<Role[]> => {
  return await findRoles(searchParams);
};

/**
 * Create posts
 * @param formState
 * @param formData
 * @returns
 */
export const createRole = async (
  formState: FormState<Role>,
  formData: FormData
): Promise<FormState<Role>> => {
  try {
    const name = formData.get("name")?.toString() || "";

    // Validate
    const parsedData = roleSchema.safeParse({ name });
    if (!parsedData.success) {
      return {
        ...formState,
        errors: zodErrorFormat(parsedData.error, "client"),
      } as FormState<Role>;
    }

    const role = await createRoleDB(parsedData.data.name);
    return {
      ...formState,
      data: role,
      message: "Role created successfully",
      errors: undefined,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unkown error occured";
    return {
      ...formState,
      message,
    };
  }
};
