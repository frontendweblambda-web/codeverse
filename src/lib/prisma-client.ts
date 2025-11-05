import { PrismaClient } from "../generated/prisma/client";
import { PasswordUtil } from "../utils/password";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    errorFormat: "pretty",
    log: ["info", "warn", "query", "error"],
  });

// db.$extends({
//   query: {
//     user: {
//       create: async ({ args, query }) => {
//         const { password, ...rest } = args.data;
//         if (password) {
//           const hash = await PasswordUtil.hash(password);
//           args = { ...args, data: { ...rest, password: hash } };
//         }
//         return query(args);
//       },
//     },
//   },
// });
