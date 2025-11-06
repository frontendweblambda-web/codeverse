import { db } from "./prisma-client";

export const getUserByIdDb = async (userId: string) => {
	const user = await db.user.findUnique({ where: { id: userId } });
	return user;
};
