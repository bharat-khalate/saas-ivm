import { Router } from "express";
import { authMiddleware } from "../utils/auth.middleware.js";
import { createCategory, getAllCategories } from "../service/category.service.js";
import { insertCategory, listCategory } from "../controller/category.controller.js";


const router: Router = Router();

router.use(authMiddleware);
router.get("/", listCategory);
router.post("/", insertCategory);

export default router;