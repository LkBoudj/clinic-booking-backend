import { Request, Response, NextFunction } from "express";
import { IUserDoc } from "../models/user.model";
import { signAccess } from "../../../utils/jwt.utils";

class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUserDoc;

      const token = await signAccess({ id: user._id, email: user.email });

      res.json({ token });
    } catch (e) {
      next(e);
    }
  };
}

export default new AuthController();
