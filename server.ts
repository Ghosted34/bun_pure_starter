import { router } from "./router";
import { redis } from "./config/redis";
import { registerAuthRoutes } from "./src/auth/auth.routes";
import { registerHealthRoutes } from "./src/health/health.route";

await redis.connect()

registerAuthRoutes();
registerHealthRoutes()

Bun.serve({
  port: 5500,
  fetch: router,
});

console.log("🚀 Server running");
