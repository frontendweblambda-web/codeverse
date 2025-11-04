import { CustomError } from "./custom-error";

export class ConflictError extends CustomError {
  statusCode: number = 409;
  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
