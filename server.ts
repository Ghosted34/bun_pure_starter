import { router } from "./router";
import { redis } from "./config/redis";
import { registerAuthRoutes } from "./src/auth/auth.routes";
import { registerHealthRoutes } from "./src/health/health.route";
import { config } from "./src/config";

await redis.connect();

registerAuthRoutes();
registerHealthRoutes();

Bun.serve({
  port: config.app.port,
  fetch: router,
});

console.log("🚀 Server running on port: ", config.app.port);
