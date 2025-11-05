import { NextResponse } from "next/server";
import { ZodIssue } from "zod/v3";

type JsonBody<T> = {
  data?: T | null;
  success?: boolean;
  message?: string;
  errors?: Array<{ field: string; code: string; message: string }> | ZodIssue[];
  statusCode?: number;
  traceId?: string;
};
export default function ApiResponse<T>(obj: JsonBody<T>, init?: ResponseInit) {
  const { success = true, message = "OK" } = obj;

  return NextResponse.json(
    {
      success,
      message,
      ...obj, // includes data, errors, traceId, etc.
    },
    {
      status: obj.statusCode ?? init?.status ?? (success ? 200 : 500),
      ...init,
    }
  );
}
