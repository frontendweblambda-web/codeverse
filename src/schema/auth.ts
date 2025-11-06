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
			"Password must include uppercase, lowercase, number, and special character.",
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
		.min(10)
		.optional()
		.transform((val) => (val === "" ? undefined : val)) // treat empty string as undefined
		.refine(
			(val) => {
				if (!val) return true; // ✅ skip validation if not provided
				return regex.mobile.test(val);
			},
			{ message: "Please enter a valid 10-digit Indian mobile number." },
		),
	role: z.string().optional(),
});
export type SignupFormData = z.infer<typeof registerSchema>;
