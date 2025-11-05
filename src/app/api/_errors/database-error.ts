import { CustomError } from "./custom-error";

export class DatabaseError extends CustomError {
  statusCode = 500;
  constructor(msg = "Database operation failed") {
    super(msg);
  }
}
