// apps/api/middlewares/auth.middleware.ts
import { isRevoked } from "../../config/redis";
import { verifyToken } from "../auth/jwt";
import type { AccessTokenEntity } from "../auth/types";
import { config } from "../config";
import type { Middleware } from "../types/base";
import { error } from "../utils/helper";


export const authentication: Middleware = (next) => async (req, ctx) => {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return error(401, "Missing token");

  const token = auth.slice(7);

  try {
    const payload = await   verifyToken({token, secret:config.jwt.secret}) as unknown as AccessTokenEntity;
    if (await isRevoked(token)) return error(401, "Token revoked");

    ctx.token=token
    ctx.user = { id: payload.sub, role: payload.role };
    return next(req, ctx);
  } catch {
    return error(401, "Invalid token");
  }
};
