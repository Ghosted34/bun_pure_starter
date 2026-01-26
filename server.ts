import { router } from "./router";
import { registerAuthRoutes } from "./src/auth/auth.routes";
import { registerHealthRoutes } from "./src/health/health.route";

registerAuthRoutes();
registerHealthRoutes();

Bun.serve({
  port: 5500,
  fetch: router,
});

console.log("🚀 Server running");
