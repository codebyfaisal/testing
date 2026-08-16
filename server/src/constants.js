import dotenv from "dotenv";
dotenv.config();

// Startup validation for required environment variables
const requiredEnv = [
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "ADMIN_PASSWORD",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  throw new Error(
    `[SERVER CONFIG ERROR]: Missing required environment variable(s): ${missingEnv.join(", ")}`,
  );
}

export const DB_NAME = process.env.DB_NAME || "portfolio";

export const PORT = process.env.PORT || 4000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const IS_SECURE = process.env.VERCEL === "1";

export const MONGODB_URI = process.env.MONGODB_URI;

export const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS;
export const CLIENT_ALLOWED_ORIGINS = process.env.CLIENT_ALLOWED_ORIGINS;
export const ADMIN_ALLOWED_ORIGINS = process.env.ADMIN_ALLOWED_ORIGINS;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "1d";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "10d";

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;