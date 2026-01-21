import { Router } from "express";
import { isAuth } from "../middlewares/isAuth.middleware.js";
import {
  addSnippet,
  deleteSnippet,
  getAllSnippets,
  getSingleSnippetDetail,
  getUserSnippets,
  updateSnippet,
} from "../controller/snippet.controller.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";
const router = Router();

router.get("/all", getAllSnippets);
router.get("/:id", optionalAuth, getSingleSnippetDetail);
router.get("/user/me", isAuth, getUserSnippets);
router.post("/add", isAuth, addSnippet);
router.patch("/update/:id", isAuth, updateSnippet);
router.delete("/delete/:id", isAuth, deleteSnippet);

export const snippetRouter = router;
