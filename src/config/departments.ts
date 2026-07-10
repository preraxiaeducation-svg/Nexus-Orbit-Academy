// =============================================================
// Nexus Orbit Academy — Department & Course Catalog Config
// =============================================================

export const DEPARTMENTS = [
  {
    id: "aerospace",
    name: "Aerospace Engineering",
    icon: "🚀",
    color: "cyan",
    gradient: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30",
    glow: "shadow-[0_0_20px_rgba(0,217,255,0.25)]",
    hoverGlow: "hover:shadow-[0_0_35px_rgba(0,217,255,0.45)]",
    accent: "#00D9FF",
    description:
      "Master the physics of flight, rocket propulsion, and aerospace vehicle design.",
  },
  {
    id: "ai_ml",
    name: "AI & Machine Learning",
    icon: "🧠",
    color: "purple",
    gradient: "from-purple-600/20 to-violet-700/20",
    border: "border-purple-500/30",
    glow: "shadow-[0_0_20px_rgba(123,47,247,0.25)]",
    hoverGlow: "hover:shadow-[0_0_35px_rgba(123,47,247,0.45)]",
    accent: "#7B2FF7",
    description:
      "From ML fundamentals to cutting-edge AI research — build intelligent systems.",
  },
  {
    id: "space_tech",
    name: "Space Technology",
    icon: "🛸",
    color: "amber",
    gradient: "from-amber-500/20 to-orange-600/20",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_20px_rgba(255,184,0,0.25)]",
    hoverGlow: "hover:shadow-[0_0_35px_rgba(255,184,0,0.45)]",
    accent: "#FFB800",
    description:
      "Orbital mechanics, satellite systems, and cutting-edge space mission design.",
  },
  {
    id: "universe",
    name: "Universe Department",
    icon: "🌌",
    color: "violet",
    gradient: "from-violet-600/20 to-indigo-700/20",
    border: "border-violet-500/30",
    glow: "shadow-[0_0_20px_rgba(150,50,250,0.25)]",
    hoverGlow: "hover:shadow-[0_0_35px_rgba(150,50,250,0.45)]",
    accent: "#9632FA",
    description:
      "Dive into astronomy, astrophysics, cosmology, and planetary science.",
  },
] as const;

export type DepartmentId = (typeof DEPARTMENTS)[number]["id"];
