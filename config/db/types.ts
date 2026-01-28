import type { Generated } from "kysely";

export interface Database {
  users: {
    id: Generated<string>;
    full_name: string;
    email: string;
    pwd_hash: string;
    role?: string;
  };
}
