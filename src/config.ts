export const config = {
  
  app: {
    port: process.env.PORT,
    env: process.env.NODE_ENV || "development",
    serverMode: process.env.SERVER_MODE || "auto",
  },
  psql: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    url: process.env.DB_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiry: process.env.JWT_EXPIRY || "15m",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  },
  redis:{
     host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 3306,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_URL
  }
};
