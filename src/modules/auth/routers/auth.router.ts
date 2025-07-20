import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth.controller";
import authenticateLocal from "../../../core/middlewares/authenticationLocal.middleware";

const router = Router();

router.post("/login", authenticateLocal, authController.login);

export default router;
