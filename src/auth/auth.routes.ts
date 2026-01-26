import { registerRoute } from "../../router";
import { jsonMiddleware } from "../middleware/json.middleware";
import { authMiddleware } from "../middleware/authentication";
import {
  loginHandler,
  refreshHandler,
  meHandler,
} from "./auth.controller";

export function registerAuthRoutes() {
  registerRoute("POST", "/auth/login", [
    jsonMiddleware,
    loginHandler,
  ]);

  registerRoute("POST", "/auth/refresh", [
    jsonMiddleware,
    refreshHandler,
  ]);

  registerRoute("GET", "/auth/me", [
    authMiddleware,
    meHandler,
  ]);
}
