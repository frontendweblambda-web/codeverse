import z from "zod";

export const roleSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .nonempty({ error: "Name must not be empty" }),
  slug: z.string().optional(),
});
