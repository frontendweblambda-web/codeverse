import { zodErrorFormat } from "@/src/utils/format-error";
import { ZodError } from "zod";

export class CustomError extends Error {
  traceId: string;
  statusCode = 500;

  constructor(public msg?: string, public errors?: ZodError) {
    super(msg);
    this.traceId = crypto.randomUUID();
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  renderError(): IError {
    return {
      traceId: this.traceId,
      statusCode: this.statusCode,
      message: this.msg!,
      errors: this.errors ? zodErrorFormat(this.errors) : undefined,
    };
  }
}

export interface IError {
  statusCode: number;
  traceId: string;
  message: string;
  errors?: Array<{ field: string; code: string; message: string }>;
}
