import { NextResponse } from "next/server";
import { ZodIssue } from "zod/v3";

type JsonBody<T> = {
  data: T;
  success?: boolean;
  message?: string;
  errors?: Record<string, string | string[] | undefined> | ZodIssue[];
};
export default function ApiResponse<T>(obj: JsonBody<T>, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      message: "Item created",
      ...obj,
    },
    { status: 200, ...init }
  );
}
