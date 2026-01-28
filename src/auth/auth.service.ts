import bcrypt from "bcrypt";
import { db } from "../../config/db";
import { signToken, verifyToken } from "./jwt";
import { config } from "../config";
import { errors } from "jose";
import { revoke } from "../../config/redis";

export async function register({
  email,
  password,
  full_name,
  role,
}: {
  email: string;
  password: string;
  full_name: string;
  role?: string;
}) {
  const pwd_hash = await hashPassword(password);

  return db
    .insertInto("users")
    .values({ email, pwd_hash, full_name, role })
    .returning(["id", "email", "full_name"])
    .executeTakeFirstOrThrow();
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  if (!user) throw new Error("Invalid credentials");

  const ok = await verifyPassword(password, user.pwd_hash);
  if (!ok) throw new Error("Invalid credentials");

  const access_token = signToken({
    payload: {
      sub: user.id,
      full_name: user.full_name,
      role: user.role,
      type: "access",
    },
    time: config.jwt.expiry,
    secret: config.jwt.secret,
  });

  const refresh_token = signToken({
    payload: {
      sub: user.id,
      full_name: user.full_name,
      role: user.role,
      type: "refresh",
    },
    time: config.jwt.refreshExpiry,
    secret: config.jwt.refreshSecret,
  });

  return {
    access_token,
    refresh_token,
    user,
  };
}

export async function refresh(token: string) {
  if (!token) {
    console.error("No token");
    return;
  }

  try {
    const decoded = await verifyToken({
      token,
      secret: config.jwt.refreshSecret,
    });

    if (!decoded || !decoded.sub) {
      console.error("Invalid Token");
    }

    const user = await db
      .selectFrom("users")
      .where("id", "=", decoded?.sub || "")
      .select(["id", "email", "full_name", "role"])
      .executeTakeFirst();

    if (!user) {
      console.error("404");
    }

    const access_token = signToken({
      payload: {
        sub: user?.id!,
        full_name: user?.full_name!,
        role: user?.role,
        type: "access",
      },
      time: config.jwt.expiry,
      secret: config.jwt.secret,
    });

    return { access_token };
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      console.error("Token has expired");
    } else if (err instanceof errors.JWSSignatureVerificationFailed) {
      console.error("Invalid signature");
    }
  }
}

export async function logout({
  access_token,
  refresh_token,
}: {
  access_token: string;
  refresh_token: string;
}) {
  if (!access_token) {
    console.error("400");
    return;
  }

  await revoke(access_token, 900);

  if (refresh_token) {
    await revoke(access_token, 900);
  }

  return { message: "Logged out" };
}

// ============================================
// Helper Functions
// ============================================

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
