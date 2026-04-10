import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { FolderOpen, FileText, FlaskConical, Star } from "lucide-react";
import { STRATEGY_COLORS, STRATEGY_LABELS } from "@/lib/types";
import type { ChunkingStrategy } from "@/lib/types";
import { mockDashboardStats, mockExperiments } from "@/data/mock-data";

interface PlanetData {
  strategy: ChunkingStrategy;
  orbitIndex: number;
  metrics: {
    faithfulness: number;
    answer_relevancy: number;
    context_precision: number;
    context_recall: number;
    answer_correctness: number;
  };
}

const planets: PlanetData[] = [
  {
    strategy: "fixed_size",
    orbitIndex: 1,
    metrics: {
      faithfulness: 0.847,
      answer_relevancy: 0.691,
      context_precision: 0.876,
      context_recall: 0.723,
      answer_correctness: 0.638,
    },
  },
  {
    strategy: "recursive",
    orbitIndex: 2,
    metrics: {
      faithfulness: 0.891,
      answer_relevancy: 0.72,
      context_precision: 0.854,
      context_recall: 0.756,
      answer_correctness: 0.651,
    },
  },
  {
    strategy: "sentence",
    orbitIndex: 3,
    metrics: {
      faithfulness: 0.878,
      answer_relevancy: 0.721,
      context_precision: 0.893,
      context_recall: 0.812,
      answer_correctness: 0.679,
    },
  },
  {
    strategy: "semantic",
    orbitIndex: 4,
    metrics: {
      faithfulness: 0.862,
      answer_relevancy: 0.729,
      context_precision: 0.867,
      context_recall: 0.789,
      answer_correctness: 0.609,
    },
  },
];

const hudStats = [
  { label: "Coleções", value: mockDashboardStats.collections, icon: FolderOpen, position: "top-left" as const },
  { label: "Documentos", value: mockDashboardStats.documents, icon: FileText, position: "top-right" as const },
  { label: "Experimentos", value: mockDashboardStats.experiments_completed, icon: FlaskConical, position: "bottom-left" as const },
  { label: "Golden Questions", value: mockDashboardStats.golden_questions, icon: Star, position: "bottom-right" as const },
];

const positionClasses: Record<string, string> = {
  "top-left": "top-2 left-2 sm:top-4 sm:left-4",
  "top-right": "top-2 right-2 sm:top-4 sm:right-4",
  "bottom-left": "bottom-2 left-2 sm:bottom-4 sm:left-4",
  "bottom-right": "bottom-2 right-2 sm:bottom-4 sm:right-4",
};

export function SolarSystem() {
  const [hoveredPlanet, setHoveredPlanet] = useState<ChunkingStrategy | null>(null);

  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      {/* Orbit rings */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="orbit-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: `${i * 22 + 10}%`,
            height: `${i * 22 + 10}%`,
            border: "1px dashed oklch(0.75 0.2 145 / 0.12)",
          }}
        />
      ))}

      {/* Sun */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="sun-core w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center">
          <span className="font-mono text-[10px] sm:text-xs font-bold text-neon-foreground tracking-wider">
            RAG
          </span>
        </div>
      </div>

      {/* Planets */}
      {planets.map((p) => {
        const color = STRATEGY_COLORS[p.strategy];
        const isHovered = hoveredPlanet === p.strategy;
        const orbitSize = p.orbitIndex * 22 + 10;

        return (
          <div
            key={p.strategy}
            className={`absolute top-1/2 left-1/2 rounded-full orbit-anim-${p.orbitIndex}`}
            style={{
              width: `${orbitSize}%`,
              height: `${orbitSize}%`,
              marginLeft: `-${orbitSize / 2}%`,
              marginTop: `-${orbitSize / 2}%`,
              animationPlayState: isHovered ? "paused" : "running",
            }}
          >
            <Link
              to="/resultados"
              className="absolute -top-3 left-1/2 -translate-x-1/2 cursor-pointer group"
              onMouseEnter={() => setHoveredPlanet(p.strategy)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              {/* Planet body */}
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 flex items-center justify-center ${
                  isHovered ? "scale-[1.5]" : ""
                }`}
                style={{
                  backgroundColor: color,
                  boxShadow: isHovered
                    ? `0 0 20px ${color}80, 0 0 40px ${color}40`
                    : `0 0 8px ${color}40`,
                }}
              >
                <span
                  className={`font-mono font-bold text-[7px] sm:text-[8px] transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-70"
                  }`}
                  style={{ color: p.strategy === "recursive" ? "#1a1a2e" : "#fff" }}
                >
                  {STRATEGY_LABELS[p.strategy].slice(0, 3).toUpperCase()}
                </span>
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-44 p-3 rounded-lg border z-50 pointer-events-none"
                  style={{
                    backgroundColor: "oklch(0.13 0.03 260 / 0.95)",
                    borderColor: `${color}60`,
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 0 20px ${color}20`,
                  }}
                >
                  <p className="font-mono text-xs font-bold mb-2" style={{ color }}>
                    {STRATEGY_LABELS[p.strategy]}
                  </p>
                  {Object.entries(p.metrics).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center mb-1">
                      <span className="text-[9px] text-muted-foreground capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="font-mono text-[10px] text-foreground">
                        {val.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Link>
          </div>
        );
      })}

      {/* HUD Stats */}
      {hudStats.map((s) => (
        <div
          key={s.label}
          className={`absolute ${positionClasses[s.position]} flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md glow-neon`}
          style={{ backgroundColor: "oklch(0.13 0.03 260 / 0.7)" }}
        >
          <s.icon className="h-3 w-3 sm:h-4 sm:w-4 text-neon" />
          <div>
            <p className="font-mono text-sm sm:text-lg font-bold text-foreground leading-none">
              {s.value}
            </p>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
