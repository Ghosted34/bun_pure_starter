import { signToken } from "./jwt";
import { json } from "../utils/helper";
import { config } from "../config";

export async function loginHandler(req: Request) {
  // @ts-ignore
  const { email } = req.body;

  // mock user for now
  const token = await signToken({ payload: { userId: 1, email }, time: config.jwt.expiry, secret: config.jwt.secret });

  return json({ accessToken: token });
}

export async function meHandler(req: Request) {
  // @ts-ignore
  return json({ user: req.user });
}
export async function refreshHandler(req: Request) {
  // @ts-ignore
  return json({ user: req.user });
}
