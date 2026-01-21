import { Router } from "express";
const router = Router();

router.get("/all", getAllSnippets);
router.get("/:id", getSingleSnippetDetail);
router.get("/user/me", getUserSnippets);
router.post("/add", addSnippet);
router.patch("/update/:id", updateSnippet);
router.delete("/delete/:id", deleteSnippet);

export const snippetRouter = router;
