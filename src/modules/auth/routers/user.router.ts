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

const router = Router().use(authenticateJWT);

router.get("/", userController.list);
router.get("/:id", userController.findById);
router.post(
  "/",
  upload.single("avatar"),
  handelMiddleware("avatar"),
  validate({ body: storeUserSchema }),
  userController.create
);
router.put("/:id", validate({ body: updateUserSchema }), userController.update);
router.delete("/:id", userController.delete);
export default router;
