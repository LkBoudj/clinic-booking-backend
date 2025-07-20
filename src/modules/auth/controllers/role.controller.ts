import BaseController from "../../../core/controller/base.controller";
import roleService from "../services/role.service";
import { IRoleDoc } from "../models/role.model";

class RoleController extends BaseController<IRoleDoc, typeof roleService> {}

export default new RoleController(roleService);
