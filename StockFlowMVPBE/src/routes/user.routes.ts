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
console.log("Setting up user routes...");
router.post("/", validateRequest(RegisterSchema), registerUserController);
router.post("/login", validateRequest(LoginSchema), loginUserController);
router.post("/refresh", refreshTokenController);

router.use(authMiddleware);
router.get("/", listUsersController);
router.get("/:id", getUserByIdController);
router.delete("/:id", deleteUserController);

export default router;


