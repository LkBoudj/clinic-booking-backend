import { Router } from "express";
import userController from "../controllers/user.controller";
import validate from "../../../core/middlewares/validate.middleware";
import {
  storeUserSchema,
  updateUserSchema,
} from "../validation/user.validation";
import {
  handelMiddleware,
  upload,
} from "../../../core/middlewares/upload.middleware";

import authenticateJWT from "../../../core/middlewares/authenticateJWT.middleware";
import authorize from "../../../core/middlewares/authorize.middleware";

const router = Router().use(authenticateJWT);

router.get("/", authorize("read", "User"), userController.list);
router.get("/:id", authorize("read", "User"), userController.findById);
router.post(
  "/",
  authorize("create", "User"),
  upload.single("avatar"),
  handelMiddleware("avatar"),
  validate({ body: storeUserSchema }),
  userController.create
);
router.put(
  "/:id",
  authorize("update", "User"),
  validate({ body: updateUserSchema }),
  userController.update
);
router.delete("/:id", authorize("delete", "User"), userController.delete);
export default router;
