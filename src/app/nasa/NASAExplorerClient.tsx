"use client";

import { useEffect, useMemo, useState } from "react";
import { HeroSection } from "@/components/nasa/HeroSection";
import { SearchBar } from "@/components/nasa/SearchBar";
import { CategoryCard } from "@/components/nasa/CategoryCard";
import { ResourceSection } from "@/components/nasa/ResourceSection";
import { NASA_CATEGORIES, type ApodResponse, type MarsResponse, type NasaLibraryResponse, getLibraryPreviewImage } from "@/lib/nasa";

export default function NASAExplorerClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [apod, setApod] = useState<ApodResponse | null>(null);
  const [library, setLibrary] = useState<NasaLibraryResponse | null>(null);
  const [mars, setMars] = useState<MarsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/nasa?q=${encodeURIComponent(query || "space")}`);
      if (!response.ok) {
        throw new Error("Unable to load NASA resources right now.");
      }

      const data = await response.json();
      setApod(data.apod ?? null);
      setLibrary(data.library ?? null);
      setMars(data.mars ?? null);
    } catch {
      setError("We could not load NASA data from the public APIs. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const libraryItems = useMemo(() => (library?.items ?? []).slice(0, 6), [library]);
  const marsPhotos = useMemo(() => (mars?.photos ?? []).slice(0, 6), [mars]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(123,47,247,0.16),transparent_40%)] px-4 pb-20 pt-28 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <HeroSection title="NASA Explorer" subtitle="Discover NASA's public science, imagery, and mission stories through accessible, beautifully presented resources." />

        <SearchBar value={searchTerm} onChange={setSearchTerm} onSubmit={() => void loadData(searchTerm)} loading={loading} />

        <div className="grid gap-4 md:grid-cols-3">
          {NASA_CATEGORIES.map((category) => (
            <CategoryCard key={category.id} title={category.title} description={category.description} icon={category.icon} />
          ))}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-black/20 p-8 text-center text-gray-400">
            Loading NASA resources…
          </div>
        ) : (
          <div className="space-y-6">
            <ResourceSection title="Astronomy Picture of the Day" description="Official daily space image and explanation from NASA.">
              {apod ? (
                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    {apod.media_type === "video" ? (
                      <iframe src={apod.url} className="h-72 w-full" title={apod.title} />
                    ) : (
                      <img src={apod.url} alt={apod.title} className="h-72 w-full object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-400">{apod.date}</div>
                    <h3 className="orbit-heading text-2xl font-semibold text-white">{apod.title}</h3>
                    <p className="body-copy mt-3 text-sm leading-relaxed text-gray-400">{apod.explanation}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No APOD data available.</p>
              )}
            </ResourceSection>

            <ResourceSection title="NASA Image & Video Library" description="Search results from NASA’s public image and video collection.">
              {libraryItems.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {libraryItems.map((item, index) => {
                    const imageSrc = getLibraryPreviewImage(item);
                    return (
                      <div key={`${item.title}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <img src={imageSrc} alt={item.title} className="h-44 w-full object-cover" />
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                          {item.description && <p className="body-copy mt-2 text-xs leading-relaxed text-gray-400">{item.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No image library results found.</p>
              )}
            </ResourceSection>

            <ResourceSection title="Mars Rover Photos" description="Recent public Mars photos from NASA rover missions.">
              {marsPhotos.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {marsPhotos.map((photo) => (
                    <div key={photo.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <img src={photo.img_src} alt={`Mars photo from ${photo.rover.name}`} className="h-44 w-full object-cover" />
                      <div className="p-4">
                        <div className="text-sm font-semibold text-white">{photo.rover.name}</div>
                        <div className="body-copy mt-1 text-xs text-gray-400">{photo.earth_date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No Mars rover photos are available right now.</p>
              )}
            </ResourceSection>
          </div>
        )}

        <footer className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-sm text-gray-500">
          Disclaimer: Nexus Orbit Academy is not affiliated with or endorsed by NASA. This page displays publicly available NASA resources and data.
        </footer>
      </div>
    </div>
  );
}
