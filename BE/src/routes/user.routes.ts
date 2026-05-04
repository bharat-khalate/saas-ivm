import { Router } from "express";
import {
  registerUserController,
  getUserByIdController,
  listUsersController,
  deleteUserController,
  loginUserController,
  refreshTokenController,
} from "../controller/user.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js";
import { validateRequest } from "../interceptor/requestValidator.js";
import { LoginSchema, RegisterSchema } from "../validator/user.validator.js";

const router = Router();
/**
 * @swagger
 * tags: 
 *  - name : Users
 *    description: Manage users and authentication
 */

/**
 * @swagger
 * /users: 
 *  post:
 *    summary: Add new user / register
 *    tags: 
 *      - Users
 *    security: []
 *    requestBody: 
 *      required: true
 *      content: 
 *        application/json: 
 *          schema:
 *            type: object
 *            required: [email, password, organisationName ]
 *            properties: 
 *              email: 
 *                type: string
 *              password: 
 *                type: string
 *              organisationName: 
 *                 type: string
 *    responses: 
 *      200: 
 *        description: User Created successfully  
 */
router.post("/", validateRequest(RegisterSchema), registerUserController);
/**
 * @swagger
 * /users/login: 
 *  post: 
 *    summary: sign in
 *    tags: 
 *      - Users
 *    security: []
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json: 
 *          schema: 
 *            type: object
 *            required: [email, password]
 *            properties: 
 *              email: 
 *                type: string
 *              password: 
 *                type: string
 *    responses: 
 *      200: 
 *        description: User logged in successfully
 */
router.post("/login", validateRequest(LoginSchema), loginUserController);
/**
 * @swagger
 * /users/refresh:
 *  post:
 *    summary: Refresh access token
 *    tags:
 *      - Users
 *    security: []
 *    responses:
 *      200:
 *        description: Access token refreshed successfully
 */
router.post("/refresh", refreshTokenController);

router.use(authMiddleware);
/**
 * @swagger
 * /users:
 *  get:
 *    summary: Fetch all users
 *    tags:
 *      - Users
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Users fetched successfully
 */
router.get("/", listUsersController);
/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: Fetch user by id
 *    tags:
 *      - Users
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: User fetched successfully
 */
router.get("/:id", getUserByIdController);
/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: Delete user by id
 *    tags:
 *      - Users
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: User deleted successfully
 */
router.delete("/:id", deleteUserController);

export default router;


