import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import errorHandler from "./core/middlewares/error.middleware";
import rootRouter from "./routers";
import passport from "./config/passport.config";

import defineAbilityFor from "./core/ability/casl.ability";
import UserModel, { IUser } from "./modules/auth/models/user.model";
import RoleModel from "./modules/auth/models/role.model";
import roleService from "./modules/auth/services/role.service";
import userService from "./modules/auth/services/user.service";
import { rolesData } from "./core/seeds";
dotenv.config();

const app = express();

// app.use(mongoSanitize());

app.use(helmet());
app.use(hpp());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // حد أقصى لكل IP
  message: "تم تجاوز الحد المسموح للطلبات، الرجاء المحاولة لاحقًا",
});
app.use(limiter);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", rootRouter);

const createUsersFromRoles = async () => {
  try {
    rolesData.forEach(async (name) => {
      const role = await roleService.where({ name }).select(["_id"]).findOne();
      if (role) {
        const isExts = await UserModel.findByEmail(`${name}@gmail.com`).exec();
        if (!isExts) {
          const user = await userService.create({
            first_name: `f_${name}`,
            last_name: `l_${name}`,
            password: "123",
            email: `${name}@gmail.com`,
            roles: [role._id as any],
          });

          console.log(user);
        } else {
          console.log(`the user ${name}@gmail.com is exits  `);
        }
      }
    });
  } catch (e) {
    console.log("adminRole:", e);
  }
};
const test = async () => {
  // const adminRole = await roleService.where({ name: admin }).findOne();
  // const user = await UserModel.findById("687d215fb57e98c0e8a1c0eb")
  //   .select("roles")
  //   .populate("roles");

  const ability = await defineAbilityFor("doctor");
  const can = ability.can("read", "Patient");
  console.log(can);
};
test();
//createUsersFromRoles();
app.use(errorHandler);
export default app;
