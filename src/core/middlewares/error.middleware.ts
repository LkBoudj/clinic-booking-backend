import { Request, Response, NextFunction } from "express";

import { StatusCodes } from "http-status-codes";
import AppError from "../errors/AppError";
import logger from "../../lib/logger";
import { sendError } from "../../utils/response.util";
import { EMODE, Env } from "../../config/env.config";
import ValidationError from "../errors/ValidationError";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status =
    err instanceof AppError
      ? err.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "خطأ غير متوقع";
  // const isOperational = err instanceof AppError ? err.isOperational : false;

  logger.error(`${req.method} ${req.originalUrl} - ${status} - ${message}`);

  if (Env.NODE_ENV === EMODE.DEV) {
    sendError({
      res,
      message,
      statusCode: status,
      error: err instanceof AppError ? err.errors : err.stack,
    });
  } else {
    sendError({
      res,
      message,
      statusCode: status,
      error: err instanceof ValidationError ? err.errors : null,
    });
  }
};

export default errorHandler;
