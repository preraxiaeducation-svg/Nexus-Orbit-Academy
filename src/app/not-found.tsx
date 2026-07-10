import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Page Not Found",
  description: "The page you are looking for is not available. Return to the Nexus Orbit Academy homepage.",
  path: "/404",
});

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="glass-card max-w-xl rounded-[28px] border border-white/10 p-10 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">404</p>
        <h1 className="text-3xl font-semibold text-white">Page Not Found</h1>
        <p className="mt-4 text-gray-400">
          The page you requested could not be found. Return to the Nexus Orbit Academy homepage and continue exploring.
        </p>
        <Link href="/" className="btn-primary mt-8 inline-flex px-8 py-3">
          Return Home
        </Link>
      </div>
    </main>
  );
}
