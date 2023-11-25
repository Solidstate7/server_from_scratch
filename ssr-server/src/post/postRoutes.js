import { Router } from "express";
const postRouter = Router();

postRouter.get("/", (req, res) => {
  res.render("post/list.html");
});

export default postRouter;
