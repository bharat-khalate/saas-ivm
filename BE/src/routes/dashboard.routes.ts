import { Router } from "express";
import { getDashboardController } from "../controller/dashboard.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *  - name: Dashboard
 *    description: Dashboard metrics and summary
 */

router.use(authMiddleware);

/**
 * @swagger
 * /dashboard:
 *  get:
 *    summary: Fetch dashboard data
 *    tags:
 *      - Dashboard
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Dashboard data fetched successfully
 */
router.get("/", getDashboardController);

export default router;


