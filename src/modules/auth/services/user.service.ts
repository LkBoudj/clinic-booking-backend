import BaseService from "../../../core/service/base.service";
import UserModel from "../models/user.model";

export default new BaseService(UserModel, ["first_name", "last_name", "email"]);
