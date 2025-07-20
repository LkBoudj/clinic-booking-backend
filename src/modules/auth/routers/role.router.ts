import { Router } from "express";
import roleController from "../controllers/role.controller";
import validate from "../../../core/middlewares/validate.middleware";
import {
  storeRoleSchema,
  updateRoleSchema,
} from "../validation/role.validation";

const router = Router();

router.get("/", roleController.list);
router.get("/:id", roleController.findById);
router.post("/", validate({ body: storeRoleSchema }), roleController.create);
router.put("/:id", validate({ body: updateRoleSchema }), roleController.update);
router.delete("/:id", roleController.delete);

export default router;
