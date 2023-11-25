import frontApp from "./ssr-server/app.js";

import dotenv from "dotenv";
dotenv.config();
const { SSR_PORT } = process.env;

frontApp.listen(SSR_PORT, () => {
  console.log("SSR-SERVER ON");
});
