import { Router } from "express";
import {
  checkUserStatus,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controller/auth.controller.js";
import { isAuth } from "../middlewares/isAuth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuth, logoutUser);
router.post("/refresh", refreshAccessToken);
router.get("/status", isAuth, checkUserStatus);
export const authRouter = router;
