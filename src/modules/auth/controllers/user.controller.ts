import BaseController from "../../../core/controller/base.controller";
import userService from "../services/user.service";
import { IUserDoc } from "../models/user.model";

class UserController extends BaseController<IUserDoc, typeof userService> {}

export default new UserController(userService);
