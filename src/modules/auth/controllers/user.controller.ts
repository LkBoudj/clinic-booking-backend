import { Request, Response, NextFunction } from "express";
import BaseController from "../../../core/controller/base.controller";
import userService from "../services/user.service";
import { IUserDoc } from "../models/user.model";
import BaseService from "../../../core/service/base.service";

class UserController extends BaseController<IUserDoc, BaseService<IUserDoc>> {
  constructor(service: BaseService<IUserDoc>) {
    super(service);
    service.populate("roles");
  }
}

export default new UserController(userService);
