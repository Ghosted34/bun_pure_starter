import { redis } from "../../config/redis";
import { signToken } from "./jwt";

export async function issueTokens(userId: number) {
  const accessToken = await signToken({payload:{ userId }, time:"15m", secret:""});
  const refreshToken = crypto.randomUUID();

  await redis.set(
    `refresh:${refreshToken}`,
    userId,
    "EX",
    60 * 60 * 24 * 7
  );

  return { accessToken, refreshToken };
}
