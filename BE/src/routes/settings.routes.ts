import { Router } from "express";
import {
  getSettingsController,
  updateSettingsController,
} from "../controller/settings.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *  - name: Settings
 *    description: Organization settings management
 */

router.use(authMiddleware);

/**
 * @swagger
 * /settings:
 *  get:
 *    summary: Fetch current settings
 *    tags:
 *      - Settings
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Settings fetched successfully
 */
router.get("/", getSettingsController);
/**
 * @swagger
 * /settings:
 *  put:
 *    summary: Update settings
 *    tags:
 *      - Settings
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            additionalProperties: true
 *    responses:
 *      200:
 *        description: Settings updated successfully
 */
router.put("/", updateSettingsController);

export default router;


