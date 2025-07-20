import { Router } from "express";
import validate from "../core/middlewares/validate.middleware";
import { querySchema } from "../core/validation/query.validation";
import { authRouter, roleRouter, userRouter } from "../modules/auth/routers";

const rootRouter = Router();

rootRouter.use(validate({ query: querySchema }));

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/roles", roleRouter);

export default rootRouter;
