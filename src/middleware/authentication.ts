import { verifyToken } from "../auth/jwt";

export async function authMiddleware(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = auth.replace("Bearer ", "");

  try {
    const payload = await verifyToken(token);
    // @ts-ignore
    req.user = payload;
    return new Response(null, { status: 204 });
  } catch {
    return new Response("Invalid token", { status: 401 });
  }
}
