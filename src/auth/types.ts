export interface JWTEntity {
  sub: string;
  role: string;
}

export interface AccessTokenEntity extends JWTEntity {
  role: string;
  exp: string;
  iat: string;
  aud: string;
}

export interface TokenPayload {
  sub: string;
  full_name: string;
  role?: string;
  type: "access" | "refresh" | "verify" | "reset";
}

export interface AuthEntity {
  email: string;
  password: string;
  role?: string;
  full_name?: string;
}
