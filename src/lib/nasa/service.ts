import { NASA_API_BASE, NASA_API_KEY, NASA_CACHE_TTL_MS, NASA_IMAGE_LIBRARY_BASE, NASA_RETRY_ATTEMPTS, NASA_RETRY_DELAY_MS } from "./config";
import type { ApodResponse, MarsResponse, NasaExplorerData, NasaLibraryItem, NasaLibraryResponse } from "./types";

const cache = new Map<string, { expiresAt: number; data: unknown }>();

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= NASA_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, { ...init, next: { revalidate: 60 } });
      if (response.ok) {
        return response;
      }

      lastError = new Error(`Request failed with ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Request failed");
    }

    if (attempt < NASA_RETRY_ATTEMPTS) {
      await sleep(NASA_RETRY_DELAY_MS * attempt);
    }
  }

  throw lastError ?? new Error("Request failed");
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T) {
  cache.set(key, { expiresAt: Date.now() + NASA_CACHE_TTL_MS, data });
}

function normalizeLibraryResponse(payload: unknown): NasaLibraryResponse {
  const raw = payload as {
    collection?: {
      items?: Array<{
        data?: Array<{ title?: string; description?: string }>;
        links?: Array<{ href: string; rel?: string; render?: string }>;
      }>;
      metadata?: { total_hits?: number };
    };
  };

  const items = (raw.collection?.items ?? []).map((item) => {
    const data = item.data?.[0];
    return {
      title: data?.title ?? "NASA Image",
      href: item.links?.[0]?.href ?? "",
      links: item.links,
      description: data?.description ?? "",
    } satisfies NasaLibraryItem;
  });

  return {
    items,
    metadata: raw.collection?.metadata,
  };
}

export async function getNasaExplorerData(query = "space"): Promise<NasaExplorerData> {
  const apodKey = "nasa:apod";
  const libraryKey = `nasa:library:${query}`;
  const marsKey = "nasa:mars";

  const [cachedApod, cachedLibrary, cachedMars] = [getCached<ApodResponse>(apodKey), getCached<NasaLibraryResponse>(libraryKey), getCached<MarsResponse>(marsKey)];
  if (cachedApod && cachedLibrary && cachedMars) {
    return { apod: cachedApod, library: cachedLibrary, mars: cachedMars };
  }

  const [apodResult, libraryResult, marsResult] = await Promise.all([
    fetchWithRetry(`${NASA_API_BASE}/planetary/apod?api_key=${NASA_API_KEY}`)
      .then((response) => response.json() as Promise<ApodResponse>)
      .catch((error) => {
        console.warn("NASA APOD request failed:", error);
        return null;
      }),
    fetchWithRetry(`${NASA_IMAGE_LIBRARY_BASE}/search?${new URLSearchParams({ q: query || "space", media_type: "image" })}`)
      .then((response) => response.json())
      .catch((error) => {
        console.warn("NASA image library request failed:", error);
        return null;
      }),
    fetchWithRetry(`${NASA_API_BASE}/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${NASA_API_KEY}`)
      .then((response) => response.json() as Promise<MarsResponse>)
      .catch((error) => {
        console.warn("NASA Mars request failed:", error);
        return null;
      }),
  ]);

  const apod = apodResult;
  const libraryPayload = libraryResult;
  const mars = marsResult;
  const library = normalizeLibraryResponse(libraryPayload);
  const result = { apod, library, mars };

  if (apod) setCached(apodKey, apod);
  if (library.items.length > 0 || libraryPayload) setCached(libraryKey, library);
  if (mars) setCached(marsKey, mars);

  return result;
}
