import { metrics } from "../../config/metrics";
import { tracing } from "../../config/tracing";
import { registerRoute } from "../../router";
import { HealthController } from "./health.controller";

export function registerHealthRoutes() {
  registerRoute("GET", "/v1/ready", tracing, metrics, HealthController.ready);
  registerRoute("GET", "/v1/live", tracing, metrics, HealthController.live);
}
