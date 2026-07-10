export const NASA_API_BASE = "https://api.nasa.gov";
export const NASA_IMAGE_LIBRARY_BASE = "https://images-api.nasa.gov";
export const NASA_API_KEY = process.env.NASA_API_KEY || process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
export const NASA_CACHE_TTL_MS = 1000 * 60 * 15;
export const NASA_RETRY_ATTEMPTS = 3;
export const NASA_RETRY_DELAY_MS = 800;
