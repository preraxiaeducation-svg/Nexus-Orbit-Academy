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

export interface NasaExplorerData {
  apod: ApodResponse | null;
  library: NasaLibraryResponse | null;
  mars: MarsResponse | null;
}
