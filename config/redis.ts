import Redis from "ioredis";
import { config } from "../src/config";

export const redis = new Redis(config.redis.url || "redis://localhost:6379", {lazyConnect:true});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error", err);
});


const PREFIX = "revoked";

export async function revoke(jti: string, exp: number) {

    await redis.set(`${PREFIX}:${jti}`, `blacklisted at: ${new Date().toISOString()}`, 'EX', exp);
  
}

export async function isRevoked(jti: string) {
  return (await redis.exists(`${PREFIX}:${jti}`)) === 1;
}
