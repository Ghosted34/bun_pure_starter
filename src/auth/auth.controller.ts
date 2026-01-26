import { signToken } from "./jwt";
import { json } from "../utils/helper";

export async function loginHandler(req: Request) {
  // @ts-ignore
  const { email } = req.body;

  // mock user for now
  const token = await signToken({ userId: 1, email });

  return json({ accessToken: token });
}

export async function meHandler(req: Request) {
  // @ts-ignore
  return json({ user: req.user });
}
