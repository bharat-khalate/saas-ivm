import { Router } from "express";
import { authMiddleware } from "../utils/auth.middleware.js";
import { serveFileController } from "../controller/file.controller.js";




const router = Router();
// router.use(authMiddleware);
/**
 * @swagger
 * tags:
 *  - name: Files
 *    description: File serving endpoints
 */
/**
 * @swagger
 * /files:
 *  get:
 *    summary: Serve file by query/path handled in controller
 *    tags:
 *      - Files
 *    security: []
 *    responses:
 *      200:
 *        description: File served successfully
 */
router.get("/",serveFileController);

export default router;