import { Router } from "express";
import { getDashboardController } from "../controller/dashboard.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getDashboardController);

export default router;


