import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import ValidationError from "../errors/ValidationError.js";
import { formatZodErrors } from "../../utils/zod.util.ts.js";

interface IValidateProps {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
  headers?: z.ZodSchema;
}

declare module "express-serve-static-core" {
  interface Request {
    validated?: {
      body?: any;
      query?: any;
      params?: any;
      headers?: any;
    };
  }
}

const validate =
  ({ body, query, params, headers }: IValidateProps) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.validated = {};
      if (body) {
        req.validated.body = await body.parseAsync(req.body);
      }
      if (query) {
        req.validated.query = await query.parseAsync(req.query);
      }
      if (params) {
        req.validated.params = await params.parseAsync(req.params);
      }
      if (headers) {
        req.validated.headers = await headers.parseAsync(req.headers);
      }
      next();
    } catch (error) {
      console.log({ error });
      if (error instanceof z.ZodError) {
        return next(
          new ValidationError("Validation failed", formatZodErrors(error))
        );
      }
      return next(error);
    }
  };

export default validate;
