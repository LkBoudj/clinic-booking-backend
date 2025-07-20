import { Request, Response, NextFunction } from "express";
import { IUserDoc } from "../models/user.model";
import { signAccess } from "../../../utils/jwt.utils";
import { sendSuccess } from "../../../utils/response.util";
import userService from "../services/user.service";
import NotFoundError from "../../../core/errors/NotFound";

class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUserDoc;

      const token = await signAccess({ id: user._id, email: user.email });

      sendSuccess({
        res,
        data: {
          user,
          token,
        },
      });
    } catch (e) {
      next(e);
    }
  };
  profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUserDoc;
      const profile = await userService
        .populate({ path: "roles", select: "_id name" })
        .findById(user.id);
      if (!profile) {
        throw new NotFoundError("the user not found");
      }
      sendSuccess({ res, data: profile });
    } catch (e) {
      next(e);
    }
  };
}

export default new AuthController();
