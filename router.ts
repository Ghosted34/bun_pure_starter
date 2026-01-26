import { compose } from "./src/middleware/compose";

type Handler = (req: Request) => Promise<Response> | Response;

const routes = new Map<string, Handler>();

export function registerRoute(
  method: string,
  path: string,
  handlers: Handler[]
) {
  routes.set(`${method} ${path}`, compose(...handlers));
}

export async function router(req: Request) {
  const url = new URL(req.url);
  const key = `${req.method} ${url.pathname}`;

  const handler = routes.get(key);
  return handler
    ? handler(req)
    : new Response("Not Found", { status: 404 });
}
