import z, { ZodError } from "zod";

export type ClientErrors = Record<string, string>;
export type ApiErrors = Array<{ field: string; code: string; message: string }>;

/**
 * Formats Zod errors for client-side or API responses
 * @param error - ZodError to format
 * @param type - "client" for simple field-message map, "api" for detailed array
 * @returns formatted errors
 */
export const zodErrorFormat = (
  error: ZodError,
  type: "client" | "api" = "api"
): ClientErrors | ApiErrors => {
  if (type == "client") {
    return error.issues.reduce((acc: ClientErrors, issue: z.core.$ZodIssue) => {
      const field = issue.path[0]?.toString();
      if (field) acc[field] = issue.message;
      return acc;
    }, {});
  }
  return error.issues.map((issue) => ({
    field: issue.path.join("."), // "name" or "user.email"
    code: issue.code,
    message: issue.message,
  }));
};
