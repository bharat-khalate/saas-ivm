import { Router } from "express";
import { insertCategory, listCategory } from "../controller/category.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js";

const router: Router = Router();
/**
 * @swagger
 * tags: 
 *  - name: Categories
 *    description: Categories management
 */

router.use(authMiddleware);
/**
 * @swagger
 *  /categories: 
 *  get:
 *      summary: fetch all categories
 *      tags: 
 *          - Categories
 *      security: 
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Data fetched successfully
 */
router.get("/", listCategory);
/**
 * @swagger
 * /categories: 
 *  post: 
 *      summary: Add new category
 *      tags: 
 *          - Categories
 *      security: 
 *          - bearerAuth: []
 *      requestBody: 
 *          required: true
 *          content: 
 *              application/json: 
 *                  schema: 
 *                      type: object 
 *                      required: 
 *                          - category
 *                      properties: 
 *                          category: 
 *                              type: string
 *      responses: 
 *          200: 
 *              description: Category created successfully
 */
router.post("/", insertCategory);

export default router;