import { Router } from "express";
import validate from "../core/middlewares/validate.middleware";
import { querySchema } from "../core/validation/query.validation";
import { userRouter } from "../modules/auth/routers";

const rootRouter = Router();

rootRouter.use(validate({ query: querySchema }));

rootRouter.use("/users", userRouter);
export default rootRouter;
