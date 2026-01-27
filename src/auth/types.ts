export interface JWTPayload {
  sub: string;
  role: string;
}

export interface AccessTokenPayload extends JWTPayload {
  role: string;
  exp: string;
  iat: string;
  aud: string;
}


