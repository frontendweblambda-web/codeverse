import { CustomError } from "./custom-error";
import { ZodError } from "zod";

export class ValidationError extends CustomError {
  statusCode: number = 400;

  constructor(public errors: ZodError) {
    super("Validation error");
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
