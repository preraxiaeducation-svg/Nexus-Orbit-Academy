interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 px-6 py-10 shadow-[0_0_40px_rgba(0,217,255,0.1)] sm:px-8 lg:px-10">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(0,217,255,0.15),transparent_40%)]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Public NASA resources, curated for learners
          </div>
          <h1 className="orbit-heading text-4xl font-bold text-white sm:text-5xl">{title}</h1>
          <p className="body-copy mt-4 text-base leading-relaxed text-gray-400 sm:text-lg">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
          <div className="font-semibold text-white">Live NASA public data</div>
          <div className="mt-1 text-xs text-gray-500">Powered by official NASA APIs and public resources.</div>
        </div>
      </div>
    </section>
  );
}
