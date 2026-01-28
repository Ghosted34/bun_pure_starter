import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { TokenPayload } from "./types";



export async function signToken({payload, time, secret}:{payload: TokenPayload, time:string, secret:string}) {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(time)
    .sign(new TextEncoder().encode(secret));
}

export async function verifyToken({token, secret}:{token: string, secret:string}) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload;
}

