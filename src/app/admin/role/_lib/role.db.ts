//_lib/index.ts
import { queryParams } from "@/utils/queryParams";
import { slugify } from "@/utils/slug";

import { db } from "@/lib/prisma-client";
import { Role } from "@prisma/client";

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
