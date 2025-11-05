import { CustomError } from "../app/api/_errors/custom-error";
import ApiResponse from "../utils/api-response";

export function errorHandler(error: unknown, options?: ResponseInit) {
  let message = error instanceof Error ? error.message : "Something went wrong";

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
