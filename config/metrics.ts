// apps/api/middlewares/metrics.middleware.ts

import type { Ctx, Handler, Middleware } from "../src/types/base";


export const metrics: Middleware = (next: Handler) => async (req, ctx: Ctx) => {
  const start = Date.now();
  const res = await next(req, ctx);
  console.log(`[METRICS] ${req.method} ${new URL(req.url).pathname} - ${res.status} - ${Date.now() - start}ms`);
  return res;
};
