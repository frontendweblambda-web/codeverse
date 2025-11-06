export type Status = "success" | "error";
export type FormState<T> =
  | {
      data?: T;
      message?: string;
      success?: boolean;
      state?: "success" | "error";
      errors?: Record<string, string> | undefined;
    }
  | undefined;
