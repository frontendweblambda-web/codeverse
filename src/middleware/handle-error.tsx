import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../app/api/_errors";
import { CustomError } from "../app/api/_errors/custom-error";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "../generated/prisma/internal/prismaNamespace";
import ApiResponse from "../utils/api-response";

export function errorHandler(error: unknown, options?: ResponseInit) {
  let message = error instanceof Error ? error.message : "Something went wrong";

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": // unique constraint
        error = new ConflictError(
          "Duplicate field value violates unique constraint"
        );
        break;

      case "P2025": // record not found
        error = new NotFoundError("Record not found");
        break;

      case "P2003": // foreign key constraint failed
        error = new DatabaseError("Foreign key constraint failed");
        break;

      default:
        error = new DatabaseError(`Database error: ${error.message}`);
    }
  }

  if (error instanceof CustomError) {
    const payload = {
      success: false,
      ...error.renderError(),
    };

    return ApiResponse(payload, {
      status: error.statusCode,
      ...options,
    });
  }

  return ApiResponse(
    {
      success: false,
      message: message,
      data: null,
    },
    { status: 500, ...options }
  );
}
