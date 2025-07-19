import dotenv from "dotenv";
dotenv.config();

function ensureEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const Env = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  HOST: process.env.DB_HOST || "localhost",
  DATABASE_URL: ensureEnv("DATABASE_URL"),
  JWT_SECRET: ensureEnv("JWT_SECRET"),
  NODE_ENV: process.env.NODE_ENV || "dev",
};
