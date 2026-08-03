export const BASE_API_URL =
  import.meta.env.VITE_BASE_API_URL || "http://localhost:4000/api/v1";

export const CLIENT_URL =
  import.meta.env.VITE_CLIENT_URL || "http://localhost:5174";

if (import.meta.env.DEV && !import.meta.env.VITE_BASE_API_URL) {
  console.warn(
    "[ENV WARNING]: VITE_BASE_API_URL is not set in .env. Falling back to default: " +
      BASE_API_URL
  );
}
