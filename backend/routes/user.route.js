import { Router } from "express";
import { registerUser } from "../controller/auth.controller.js";

const router = Router();

router.post("/register", registerUser);

export const authRouter = router;
