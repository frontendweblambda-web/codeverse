import z from "zod";
import { regex } from "../utils/regex";

// ✅ Infer type from schema
export type LoginFormData = z.infer<typeof loginSchema>;
export const loginSchema = z.object({
  email: z.email({ error: "Invalid email" }).trim().lowercase(),
  password: z
    .string()
    .min(8)
    .max(50)
    .regex(
      regex.password,
      "Password must include uppercase, lowercase, number, and special character."
    ),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8)
    .max(100)
    .refine((val) => regex.password.test(val), {
      message:
        "Password must include uppercase, lowercase, number, and special character.",
    })
    .trim(),
  mobile: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return regex.mobile.test(val);
      },
      {
        message: "Invalid mobile number format.",
      }
    ),
  role: z.string().optional(),
});
export type SignupFormData = z.infer<typeof registerSchema>;
