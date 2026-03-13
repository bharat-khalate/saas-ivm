import { Router } from "express";
import { authMiddleware } from "../utils/auth.middleware.js";
import { serveFileController } from "../controller/file.controller.js";




const router = Router();
// router.use(authMiddleware);
router.get("/",serveFileController);

export default router;