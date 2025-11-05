import { ZodIssue } from "zod/v3";

type State = "idle" | "success" | "warning" | "danger";
export type FormState<T> =
  | {
      data?: T;
      message?: string;
      success?: boolean;
      state?: State;
      errors?: Record<string, string>;
    }
  | undefined;
