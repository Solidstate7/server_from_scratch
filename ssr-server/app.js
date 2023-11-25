import express from "express";
const app = express();

import nunjucks from "nunjucks";

import router from "./src/index.js";

app.set("view engine", "html");
nunjucks.configure("ssr-server/views", { express: app });

app.use(router);

export default app;
