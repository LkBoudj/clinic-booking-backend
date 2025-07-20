// src/core/middleware/authorize.ts
import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "@casl/ability";
import defineAbilityFor from "../ability/casl.ability";
import { IUser } from "../../modules/auth/models/user.model";
import NotFoundError from "../errors/NotFound";
import { AppAction, AppSubject } from "../../config/permissions.config";

const authorize =
  (action: AppAction, subject: AppSubject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;

      if (!user || !user?.roles) {
        throw new NotFoundError("Access denied: no roles found");
      }

      const roles = user.roles.map((r: any) => r.name);

      const ability = defineAbilityFor(roles);

      if (!ability.can(action, subject)) {
        throw new NotFoundError("You dent have authorization");
      }

      next();
    } catch (e) {
      next(e);
    }
  };

export default authorize;
