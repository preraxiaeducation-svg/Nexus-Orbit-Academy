interface ResourceSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ResourceSection({ title, description, children }: ResourceSectionProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="orbit-heading text-xl font-semibold text-white">{title}</h2>
        {description && <p className="body-copy mt-2 text-sm text-gray-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}
