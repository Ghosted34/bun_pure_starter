export async function jsonMiddleware(req: Request) {
  if (req.headers.get("content-type")?.includes("application/json")) {
    // @ts-ignore
    req.body = await req.json();
  }

  return new Response(null, { status: 204 });
}
