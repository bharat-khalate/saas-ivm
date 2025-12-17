import { Router } from "express";
import {
  getSettingsController,
  updateSettingsController,
} from "../controller/settings.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getSettingsController);
router.put("/", updateSettingsController);

export default router;


