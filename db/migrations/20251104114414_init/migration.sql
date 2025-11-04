-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "hstore";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED', 'DECLINED');

-- CreateEnum
CREATE TYPE "Proficiency" AS ENUM ('BEGINERS', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "TenantType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION', 'TEAM');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('CREDENTIAL', 'GOOGLE', 'GITHUB');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'DECACTIVE');

-- CreateTable
CREATE TABLE "bookmarks" (
    "bookmark_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("bookmark_id")
);

-- CreateTable
CREATE TABLE "codes" (
    "code_id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,

    CONSTRAINT "codes_pkey" PRIMARY KEY ("code_id")
);

-- CreateTable
CREATE TABLE "comments" (
    "comment_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "image" TEXT,
    "code_id" TEXT,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "followers" (
    "follow_id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("follow_id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "invitation_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    "invited_by_id" TEXT NOT NULL,
    "invited_user_id" TEXT,
    "role_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("invitation_id")
);

-- CreateTable
CREATE TABLE "likes" (
    "like_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("like_id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "role_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "actions" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "posts" (
    "post_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT,
    "excerpt" TEXT,
    "images" TEXT[],
    "videos" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "is_publish" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "post_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "profile" (
    "profile_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "profession" TEXT,
    "designation" TEXT,
    "exp" TEXT,
    "salary" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "resume" TEXT,
    "company" TEXT,
    "address" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "profile_skills" (
    "profile_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "proficiency" "Proficiency" NOT NULL DEFAULT 'BEGINERS',

    CONSTRAINT "profile_skills_pkey" PRIMARY KEY ("skill_id","profile_id")
);

-- CreateTable
CREATE TABLE "projects" (
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "repo_url" TEXT,
    "live_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "roles_permission" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "roles_permission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "skills" (
    "skill_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("skill_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "tag_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "TenantType" NOT NULL DEFAULT 'INDIVIDUAL',
    "logoUrl" TEXT,
    "description" TEXT,
    "website" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "owner_id" TEXT NOT NULL,
    "settings" JSONB,
    "plan" "PlanTier" NOT NULL DEFAULT 'FREE',
    "billingCustomerId" TEXT,
    "trialExpiresAt" TIMESTAMP(3),
    "planExpiresAt" TIMESTAMP(3),
    "quota" JSONB,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("tenant_id")
);

-- CreateTable
CREATE TABLE "tenants_db" (
    "tenant_db" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "db_host" TEXT,
    "db_name" TEXT,
    "db_schema" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tenants_db_pkey" PRIMARY KEY ("tenant_db")
);

-- CreateTable
CREATE TABLE "tenant_usage" (
    "tenant_usage_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "period_form" TIMESTAMP(3) NOT NULL,
    "period_to" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_usage_pkey" PRIMARY KEY ("tenant_usage_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "avatar" TEXT NOT NULL DEFAULT '',
    "is_new_user" BOOLEAN NOT NULL DEFAULT true,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_login" TIMESTAMP(6),
    "auth_provider" "AuthProvider" NOT NULL DEFAULT 'CREDENTIAL',
    "auth_provider_id" TEXT,
    "lockout_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("role_id","user_id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" CITEXT NOT NULL,
    "description" TEXT,
    "industry" TEXT,
    "metadata" JSONB,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "tenantId" TEXT NOT NULL,
    "billing_id" TEXT,
    "settings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("workspace_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_post_id_key" ON "bookmarks"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "codes_post_id_key" ON "codes"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "followers_follower_id_following_id_key" ON "followers"("follower_id", "following_id");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_hash_key" ON "invitations"("token_hash");

-- CreateIndex
CREATE INDEX "invitations_tenant_id_email_idx" ON "invitations"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "invitations_workspace_id_idx" ON "invitations"("workspace_id");

-- CreateIndex
CREATE INDEX "invitations_invited_by_id_idx" ON "invitations"("invited_by_id");

-- CreateIndex
CREATE INDEX "invitations_status_idx" ON "invitations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_post_id_key" ON "likes"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_slug_key" ON "permissions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "roles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skills_slug_key" ON "skills"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_owner_id_key" ON "tenants"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_db_tenant_id_key" ON "tenants_db"("tenant_id");

-- CreateIndex
CREATE INDEX "tenant_usage_tenant_id_metric_idx" ON "tenant_usage"("tenant_id", "metric");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspaces_tenantId_idx" ON "workspaces"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_tenantId_slug_key" ON "workspaces"("tenantId", "slug");

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codes" ADD CONSTRAINT "codes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "codes"("code_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("workspace_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_skills" ADD CONSTRAINT "profile_skills_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_skills" ADD CONSTRAINT "profile_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("skill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permission" ADD CONSTRAINT "roles_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permission" ADD CONSTRAINT "roles_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants_db" ADD CONSTRAINT "tenants_db_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_usage" ADD CONSTRAINT "tenant_usage_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;
