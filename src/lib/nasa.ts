export interface ApodResponse {
  title: string;
  date: string;
  explanation: string;
  url: string;
  media_type: string;
  hdurl?: string;
}

export interface NasaLibraryItem {
  title: string;
  href: string;
  links?: Array<{ href: string; rel?: string; render?: string }>;
  description?: string;
}

export interface NasaLibraryResponse {
  items: NasaLibraryItem[];
  metadata?: { total_hits?: number };
}

export interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  rover: { name: string };
}

export interface MarsResponse {
  photos: MarsPhoto[];
}

export const NASA_CATEGORIES = [
  {
    id: "apod",
    title: "Astronomy Picture of the Day",
    description: "A new celestial image and explanation every day from NASA.",
    icon: "🌌",
  },
  {
    id: "library",
    title: "Image & Video Library",
    description: "Explore NASA’s public collections of imagery and video media.",
    icon: "🛰️",
  },
  {
    id: "mars",
    title: "Mars Rover Photos",
    description: "Discover snapshots from Mars missions, captured by rover cameras.",
    icon: "🔴",
  },
] as const;

export function getLibraryPreviewImage(item: NasaLibraryItem) {
  const directImage = item.links?.find((link) => link.render === "image" || link.href?.match(/\.(jpg|jpeg|png|gif)$/i));
  return directImage?.href ?? item.href;
}
