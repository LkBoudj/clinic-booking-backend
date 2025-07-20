import { Router } from "express";
import authController from "../controllers/auth.controller";
import authenticateLocal from "../../../core/middlewares/authenticationLocal.middleware";
import authenticateJWT from "../../../core/middlewares/authenticateJWT.middleware";

const router = Router();

router.post("/login", authenticateLocal, authController.login);
router.get("/profile", authenticateJWT, authController.profile);

export default router;
