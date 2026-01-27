import Redis from "ioredis";
import { config } from "../src/config";

export const redis = new Redis(config.redis.url || "redis://localhost:6379");
