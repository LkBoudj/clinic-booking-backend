import { Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

interface SuccessResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
}

interface ErrorResponseOptions {
  res: Response;
  statusCode?: number;
  message?: string;
  error?: any;
}

export const sendSuccess = <T>({
  res,
  statusCode = StatusCodes.OK,
  message = getReasonPhrase(statusCode),
  data = {} as T,
}: SuccessResponseOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    statusCode,
    data,
  });
};

export const sendError = ({
  res,
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  message = getReasonPhrase(statusCode),
  error = {},
}: ErrorResponseOptions) => {
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    error,
  });
};
