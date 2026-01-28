export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function error(
  status: number,
  message: string,
  code?: string,
) {
  return json({ error: message, code }, status);
}
