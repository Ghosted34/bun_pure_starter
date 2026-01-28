import { trace } from "@opentelemetry/api";
import type { Middleware } from "../src/types/base";

export const tracer = trace.getTracer("bun-api");


export const tracing: Middleware = (next) => async (req, ctx) => {
  const span = tracer.startSpan(`${req.method} ${new URL(req.url).pathname}`);

  try {
    const res = await next(req, ctx);
    span.setAttribute("http.status_code", res.status);
    
    return res;
  } catch (err) {
    span.recordException(err as Error);
    throw err;
  } finally {
    span.end();
  }
};
