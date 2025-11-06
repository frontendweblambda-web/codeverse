"use server";

import { getUserByIdDb } from "@/lib/user";

export const getUserById = async (userId: string) => {
	const user = await getUserByIdDb(userId);

	if (!user) return null;

	return user;
};
