import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode: number = 404;
  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
