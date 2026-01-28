// src/middleware/compose.ts
import type { Handler, Middleware, Ctx } from "../types/base";

/**
 * Compose multiple middlewares into a single handler.
 * Last function must be the final Handler.
 * Usage: compose(mw1, mw2, handler)
 */
export function compose(...fns: [...Middleware[], Handler]): Handler {
  const handler = fns[fns.length - 1] as Handler; // last one
  const middlewares = fns.slice(0, -1) as Middleware[];


  return middlewares.reduceRight<Handler>((next, mw) => {
    return (req: Request, ctx: Ctx) => mw(next)(req, ctx); // now mw is guaranteed Middleware
  }, handler);
}
