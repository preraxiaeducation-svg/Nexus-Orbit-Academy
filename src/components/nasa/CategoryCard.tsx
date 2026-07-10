interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
}

export function CategoryCard({ title, description, icon }: CategoryCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="text-3xl">{icon}</div>
      <h3 className="orbit-heading mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="body-copy mt-2 text-sm leading-relaxed text-gray-400">{description}</p>
    </div>
  );
}
