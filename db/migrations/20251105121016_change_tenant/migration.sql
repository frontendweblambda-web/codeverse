-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('TENANT', 'WORKSPACE');

-- DropIndex
DROP INDEX "public"."tenants_slug_key";
