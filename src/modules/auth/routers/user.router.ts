import { Router } from "express";
import userController from "../modules/auth/controllers/user.controller";
import validate from "../core/middlewares/validate.middleware";
import { querySchema } from "../core/validation/query.validation";

const router = Router();

router.get("/", userController.list);

router.get("/:id", userController.findById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);
export default router;
