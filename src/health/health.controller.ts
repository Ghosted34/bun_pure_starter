import { sql } from "kysely";
import { db } from "../../config/db";
import { redis } from "../../config/redis";
import { json } from "../utils/helper";


export const HealthController = {
  ready: async (req: Request) => {
    const status: Record<string, any> = { api: "ok" };

    // Check DB
    try {
       await sql`SELECT 1`.execute(db);
      status.db = "ok";
    } catch (err: any) {
      status.db = "error";
      status.dbError = err.message;
    }

    // Check Redis
    try {
      await redis.ping();
      status.redis = "ok";
    } catch (err: any) {
      status.redis = "error";
      status.redisError = err.message;
    }

    const code = Object.values(status).some((v) => v === "error") ? 500 : 200;
    return json(status, code);
  },

  live: async (req: Request) => {
    return json({ status: "ok", type: "live" }, 200);
  },
};
