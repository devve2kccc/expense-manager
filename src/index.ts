import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import auth from "./routes/auth";

const app = new Hono();

app.use("/api/*", cors());
app.use(logger());
app.use(secureHeaders());

app.basePath("/api").route("/auth", auth);

export default app;
