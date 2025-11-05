import z from "zod";

const regexName = /^cv:(\*|[a-z_]+):(\*|[a-z_]+)$/;
export const permissionSchema = z.object({
  name: z
    .string()
    .nonempty({ error: "Name is required" })
    .min(7, "Permission must be at least 7 characters")
    .max(255, "Permission name cannot exceed 255 characters")
    .regex(
      regexName,
      "Permission must follow `cv:resource:action` format (e.g., cv:post:create or cv:post:*)"
    ),
});

// Inferred TypeScript type
export type Permission = z.infer<typeof permissionSchema>;
