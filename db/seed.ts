// async function seedRoles() {
//   console.log("Seeding roles...");
//   const roles = [
//     "superadmin",
//     "admin",
//     "moderator",
//     "support",
//     "user",
//     "promoter",
//     "advertiser",
//   ];
//   await Promise.all(
//     roles.map((name) =>
//       prisma.role.upsert({
//         where: { name },
//         update: {},
//         create: { name },
//       })
//     )
//   );
// }
