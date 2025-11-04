import { ZodError } from "zod";
import { ZodIssue } from "zod/v3";

export class CustomError extends Error {
  traceId?: string;
  statusCode: number = 500;

  constructor(
    public msg?: string,
    public errors?: ZodError | { [key: string]: string }
  ) {
    super(msg);
    this.traceId = crypto.randomUUID();
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  renderError(): IError {
    return {
      statusCode: this.statusCode,
      traceId: this.traceId!,
      error: this.msg,
      errors: this.errors,
    };
  }
}

export interface IError {
  statusCode: number;
  traceId: string;
  path?: string;
  error?: string;
  errors?: ZodIssue[] | { [key: string]: string };
}
