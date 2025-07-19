import AppError from "./AppError";

/**
 * Represents a validation error, typically thrown when input validation fails.
 */
export default class NotFoundError extends AppError {
  /**
   * @param {string} message - A general error message.
   * @param {Record<string, string[]>} [errors={}] - Detailed field-level errors.
   */
  constructor(message = "Not Found failed", errors: {} = {}) {
    super(message, 400); // HTTP 400 Bad Request
    this.name = "NotFoundError";
    this.errors = errors;
  }
}
