import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { IUserDoc } from "../../modules/auth/models/user.model";
import NotFoundError from "../errors/NotFound";

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: IUserDoc | undefined, info: any) => {
      if (err) return next(err);
      if (!user) return next(new NotFoundError("Unauthorized access"));

      req.user = user;
      next();
    }
  )(req, res, next);
};

export default authenticateJWT;
