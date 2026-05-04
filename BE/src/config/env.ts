export const PORT = Number(process.env.PORT) || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
export const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
export const ENVIRONMENT = process.env.NODE_ENV || "development";