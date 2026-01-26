import { router } from "./router";
import { registerAuthRoutes } from "./modules/auth/auth.routes";
import { registerHealthRoutes } from "./modules/health/health.routes";

registerAuthRoutes();
registerHealthRoutes();

Bun.serve({
  port: 3000,
  fetch: router,
});

console.log("🚀 Server running");
