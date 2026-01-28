import { metrics } from "../../config/metrics";
import { tracing } from "../../config/tracing";
import { registerRoute } from "../../router";
import { HealthController } from "./health.controller";



export function registerHealthRoutes() {
registerRoute("GET", "/ready", tracing, metrics, HealthController.ready);
registerRoute("GET", "/live", tracing, metrics, HealthController.live);

}
