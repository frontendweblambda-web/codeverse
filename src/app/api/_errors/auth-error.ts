import { CustomError } from "./custom-error";

export class AuthError extends CustomError {
  statusCode = 401;
  constructor(msg = "Unauthorized error") {
    super(msg);
  }
}
