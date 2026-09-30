/**
 * Consistent API error type + the error response shape required by the
 * backend spec: { error: { code, message, details? } }.
 */

export type ErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "AI_UNAVAILABLE"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details?: unknown;

  constructor(
    status: number,
    code: ErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(message: string, details?: unknown): ApiError {
  return new ApiError(400, "BAD_REQUEST", message, details);
}

export function validationError(message: string, details?: unknown): ApiError {
  return new ApiError(422, "VALIDATION_ERROR", message, details);
}

export function unauthorized(message = "Authentication required."): ApiError {
  return new ApiError(401, "UNAUTHORIZED", message);
}

export function forbidden(message = "Not allowed."): ApiError {
  return new ApiError(403, "FORBIDDEN", message);
}

export function notFound(message = "Not found."): ApiError {
  return new ApiError(404, "NOT_FOUND", message);
}

export function conflict(message: string): ApiError {
  return new ApiError(409, "CONFLICT", message);
}

export function payloadTooLarge(message = "Request body too large."): ApiError {
  return new ApiError(413, "PAYLOAD_TOO_LARGE", message);
}

export function rateLimited(
  message = "Too many requests. Try again later.",
): ApiError {
  return new ApiError(429, "RATE_LIMITED", message);
}

export function aiUnavailable(
  message = "The AI service is temporarily unavailable. Please try again.",
): ApiError {
  return new ApiError(503, "AI_UNAVAILABLE", message);
}

export function internalError(message = "Something went wrong."): ApiError {
  return new ApiError(500, "INTERNAL_ERROR", message);
}
