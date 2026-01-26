import { SignJWT, jwtVerify } from "jose";



export async function signToken({payload, time, secret}:{payload: any, time:string, secret:string}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(secret));
}

export async function verifyToken({token, secret}:{token: string, secret:string}) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload;
}
