export default class AppError extends Error {
  public statusCode: number;
  public errors: {};
  public status: "fail" | "error";
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, errors: {} = {}) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.errors = errors;
    this.isOperational = true;

    // Preserve stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
