import { metrics } from "../../config/metrics";
import { tracing } from "../../config/tracing";
import { registerRoute } from "../../router";
import { authentication } from "../middleware/authentication";
import { AuthController } from "./auth.controller";


export function registerAuthRoutes() {
 // Public
registerRoute("POST", "/api/v1/register", tracing, metrics, AuthController.register);
registerRoute("POST", "/api/login", tracing, metrics, AuthController.login);
registerRoute("POST", "/refresh", tracing, metrics, AuthController.refresh);

// Protected
registerRoute("POST", "/logout", tracing, metrics, authentication, AuthController.logout);
}
