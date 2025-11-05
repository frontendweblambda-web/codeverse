//_lib/index.ts
import { Role } from "@/src/generated/prisma/client";
import { db } from "@/src/lib/prisma-client";
import { queryParams } from "@/src/utils/queryParams";
import { slugify } from "@/src/utils/slug";

/**
 * Get roles
 * @param searchParams
 * @returns
 */
export const findRoles = async (searchParams: URLSearchParams) => {
  const { search, sortBy, order } = queryParams(searchParams);

  const roles = await db.role.findMany({
    where: {
      name: { contains: search ?? "", mode: "insensitive" },
    },
    orderBy: {
      [sortBy || "createdAt"]: (order || "asc").toLowerCase(),
    },
  });

  return roles as Role[];
};

export const createRoleDB = async (name: string) => {
  try {
    const slug = slugify(name);
    const roleExist = await db.role.findUnique({ where: { slug } });
    if (roleExist) throw new Error("Role existed!");
    const role = await db.role.create({ data: { name, slug } });
    return role;
  } catch (error) {
    throw error;
  }
};
