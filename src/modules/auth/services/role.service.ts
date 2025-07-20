import BaseService from "../../../core/service/base.service";
import RoleModel from "../models/role.model";

export default new BaseService(RoleModel, ["name"]);
