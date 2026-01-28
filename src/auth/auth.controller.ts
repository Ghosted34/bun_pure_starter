import type { Ctx } from "../types/base";
import { error, json } from "../utils/helper";
import { login, logout, refresh, register } from "./auth.service";
import type { AuthEntity } from "./types";

export const AuthController = {
  register: async (req: Request) => {
    try {
      const {
        full_name = "",
        email,
        password,
        role = undefined,
      } = (await req.json()) as AuthEntity;
      const user = await register({ full_name, email, password, role });
      return json(user, 201);
    } catch (err: any) {
      return error(400, err.message);
    }
  },

  login: async (req: Request) => {
    try {
      const { email, password } = (await req.json()) as AuthEntity;
      const tokens = await login({ email, password });
      return json(tokens);
    } catch (err: any) {
      return error(401, err.message);
    }
  },

  refresh: async (req: Request) => {
    try {
      const { refresh_token } = (await req.json()) as { refresh_token: string };
      const token = await refresh(refresh_token);
      return json(token);
    } catch (err: any) {
      return error(401, err.message);
    }
  },

  logout: async (req: Request, ctx: Ctx) => {
    try {
      const { refresh_token } = (await req.json()) as { refresh_token: string };

      await logout({ access_token: ctx.token, refresh_token });
      return json({ ok: true });
    } catch (err: any) {
      return error(400, err.message);
    }
  },
};
