import { Router } from "express";
import {
  registerUserController,
  getUserByIdController,
  listUsersController,
  deleteUserController,
  loginUserController,
} from "../controller/user.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js";

const router = Router();

router.post("/", registerUserController);
router.post("/login", loginUserController);

router.use(authMiddleware);
router.get("/", listUsersController);
router.get("/:id", getUserByIdController);
router.delete("/:id", deleteUserController);

export default router;


