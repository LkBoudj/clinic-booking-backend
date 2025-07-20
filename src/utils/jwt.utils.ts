import jwt from "jsonwebtoken";
import { Env } from "../config/env.config";

export const signAccess = (payload: object) =>
  jwt.sign(payload, Env.JWT_SECRET as string, {
    expiresIn: "2d",
  });

export const signRefresh = (payload: object) =>
  jwt.sign(payload, Env.JWT_REFRESH as string, {
    expiresIn: "7d",
  });

export const verifyRefresh = (token: string) =>
  jwt.verify(token, Env.JWT_REFRESH as string);
