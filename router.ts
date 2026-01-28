// src/router.ts
import { compose } from "./src/middleware/compose";
import type { Ctx, Handler, Middleware } from "./src/types/base";


const routes = new Map<string, Handler>();

export function registerRoute<M extends Middleware[]>(
  method: string,
  path: string,
  ...handlers: [...M, Handler]
) {
  if (handlers.length === 0) throw new Error("No handlers provided");
  routes.set(`${method.toUpperCase()} ${path}`, compose(...handlers));
}

export async function router(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const key = `${req.method.toUpperCase()} ${url.pathname}`;

  const handler = routes.get(key);
  if (!handler) return new Response("Not Found", { status: 404 });

  const ctx: Ctx = {
    traceId: crypto.randomUUID(),
    startTime: Date.now(),
  };

  return handler(req, ctx);
}
