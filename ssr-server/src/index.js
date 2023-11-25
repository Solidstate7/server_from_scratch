import { Router } from "express";
import postRouter from "./post/postRoutes.js";
import userRouter from "./user/userRoutes.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index.html");
});
router.use("/posts", postRouter);
router.use("/users", userRouter);

export default router;
