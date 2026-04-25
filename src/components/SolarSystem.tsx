import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { FolderOpen, FileText, FlaskConical, Star } from "lucide-react";
import { STRATEGY_COLORS, STRATEGY_LABELS } from "@/lib/types";
import type { ChunkingStrategy } from "@/lib/types";
import type { DashboardData, StrategyStats } from "@/services/dashboard";

interface PlanetData {
  strategy: ChunkingStrategy;
  orbitIndex: number;
  chunks: number;
  metrics: {
    faithfulness: number;
    answer_relevancy: number;
    context_precision: number;
    context_recall: number;
    answer_correctness: number;
  };
}

const positionClasses: Record<string, string> = {
  "top-left": "top-2 left-2 sm:top-4 sm:left-4",
  "top-right": "top-2 right-2 sm:top-4 sm:right-4",
  "bottom-left": "bottom-2 left-2 sm:bottom-4 sm:left-4",
  "bottom-right": "bottom-2 right-2 sm:bottom-4 sm:right-4",
};

function generateStars(count: number) {
  const stars: { x: number; y: number; size: number; delay: number; duration: number }[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    });
  }
  return stars;
}

function toPlanet(s: StrategyStats, index: number): PlanetData {
  return {
    strategy: s.strategy as ChunkingStrategy,
    orbitIndex: index + 1,
    chunks: s.total_chunks,
    metrics: {
      faithfulness: s.avg_faithfulness,
      answer_relevancy: s.avg_answer_relevancy,
      context_precision: s.avg_context_precision,
      context_recall: s.avg_context_recall,
      answer_correctness: s.avg_answer_correctness,
    },
  };
}

function getPlanetSize(chunks: number, allChunks: number[]): number {
  const min = Math.min(...allChunks);
  const max = Math.max(...allChunks);
  const ratio = (chunks - min) / (max - min || 1);
  return 24 + ratio * 20;
}

function MiniSparkline({
  metricKey,
  currentStrategy,
  planets,
}: {
  metricKey: string;
  currentStrategy: ChunkingStrategy;
  planets: PlanetData[];
}) {
  const values = planets.map((p) => (p.metrics as Record<string, number>)[metricKey]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 32;
  const h = 12;

  if (planets.length < 2) return null;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  const currentIdx = planets.findIndex((p) => p.strategy === currentStrategy);
  if (currentIdx === -1) return null;
  const cx = (currentIdx / (values.length - 1)) * w;
  const cy = h - ((values[currentIdx] - min) / range) * h;
  const color = STRATEGY_COLORS[currentStrategy] ?? "#888";

  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline points={points} fill="none" stroke="oklch(0.5 0.02 250)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="2" fill={color} />
    </svg>
  );
}

interface SolarSystemProps {
  data: DashboardData;
}

export function SolarSystem({ data }: SolarSystemProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<ChunkingStrategy | null>(null);
  const [hoveredSun, setHoveredSun] = useState(false);
  const stars = useMemo(() => generateStars(80), []);
  const sunParticles = useMemo(() => {
    const particles: { angle: number; dist: number; size: number; duration: number; delay: number }[] = [];
    for (let i = 0; i < 16; i++) {
      particles.push({
        angle: (i / 16) * 360,
        dist: 50 + Math.random() * 30,
        size: Math.random() * 3 + 1.5,
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 2,
      });
    }
    return particles;
  }, []);

  const planets = useMemo(() => data.strategy_stats.map(toPlanet), [data.strategy_stats]);
  const allChunks = planets.map((p) => p.chunks);
  const totalChunks = data.corpus_stats.total_chunks;

  const hudStats = [
    { label: "Coleções", value: data.total_collections, icon: FolderOpen, position: "top-left" as const },
    { label: "Documentos", value: data.total_documents, icon: FileText, position: "top-right" as const },
    { label: "Experimentos", value: data.total_experiments, icon: FlaskConical, position: "bottom-left" as const },
    { label: "Golden Questions", value: data.total_golden_questions, icon: Star, position: "bottom-right" as const },
  ];

  const corpus = data.corpus_stats;
  const corpusRows = [
    { label: "Documentos", value: corpus.total_documents.toLocaleString("pt-BR") },
    { label: "Chunks", value: totalChunks.toLocaleString("pt-BR") },
    { label: "Avg Chunk", value: `${corpus.avg_chunk_size} chars` },
    { label: "Palavras", value: corpus.total_words > 0 ? corpus.total_words.toLocaleString("pt-BR") : "—" },
    { label: "Sentenças", value: corpus.total_sentences > 0 ? corpus.total_sentences.toLocaleString("pt-BR") : "—" },
    { label: "Frases", value: corpus.total_phrases > 0 ? corpus.total_phrases.toLocaleString("pt-BR") : "—" },
    { label: "Páginas", value: corpus.total_pages > 0 ? corpus.total_pages.toLocaleString("pt-BR") : "—" },
    { label: "Caracteres", value: corpus.total_characters > 0 ? corpus.total_characters.toLocaleString("pt-BR") : "—" },
  ];

  return (
    <div className="relative w-full">
      {/* Solar System — centered */}
      <div className="relative aspect-square max-w-[520px] mx-auto overflow-hidden">
        {/* Star field */}
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full star-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: "oklch(0.85 0.02 250)",
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}

        {/* Orbit rings — dinâmicos por estratégia */}
        {planets.map((p) => (
          <div
            key={p.strategy}
            className="orbit-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${p.orbitIndex * 20 + 14}%`,
              height: `${p.orbitIndex * 20 + 14}%`,
              border: "1px dashed oklch(0.75 0.2 145 / 0.1)",
            }}
          />
        ))}

        {/* Sun */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          onMouseEnter={() => setHoveredSun(true)}
          onMouseLeave={() => setHoveredSun(false)}
        >
          <div
            className={`sun-core w-20 h-20 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-default ${
              hoveredSun ? "scale-[1.8]" : ""
            }`}
            style={{
              boxShadow: hoveredSun
                ? "0 0 60px oklch(0.75 0.2 145 / 0.7), 0 0 120px oklch(0.75 0.2 145 / 0.35)"
                : undefined,
            }}
          >
            <span className="font-mono text-sm sm:text-base font-bold text-neon-foreground tracking-wider">RAG</span>
            <span className="font-mono text-[9px] sm:text-[11px] text-neon-foreground/70">
              {totalChunks.toLocaleString("pt-BR")} chunks
            </span>
          </div>

          {/* Floating particles */}
          {sunParticles.map((pt, i) => {
            const rad = (pt.angle * Math.PI) / 180;
            const x = Math.cos(rad) * pt.dist;
            const y = Math.sin(rad) * pt.dist;
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 rounded-full transition-all"
                style={{
                  width: `${pt.size}px`,
                  height: `${pt.size}px`,
                  backgroundColor: "oklch(0.75 0.2 145)",
                  transform: hoveredSun ? `translate(${x}px, ${y}px)` : "translate(0px, 0px)",
                  opacity: hoveredSun ? 0.8 : 0,
                  boxShadow: hoveredSun ? "0 0 6px oklch(0.75 0.2 145 / 0.6)" : "none",
                  transitionDuration: `${pt.duration * 0.3}s`,
                  transitionDelay: `${pt.delay * 0.1}s`,
                  animation: hoveredSun
                    ? `sun-particle ${pt.duration}s ease-in-out ${pt.delay}s infinite alternate`
                    : "none",
                }}
              />
            );
          })}

          {/* Corpus Stats Card */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-72 bg-black/85 backdrop-blur-md border border-neon/20 p-4 z-50 transition-all duration-200 pointer-events-none"
            style={{
              top: hoveredSun ? "calc(100% + 16px)" : "calc(100% + 8px)",
              opacity: hoveredSun ? 1 : 0,
            }}
          >
            <p className="font-mono text-[10px] text-neon uppercase tracking-widest mb-2 text-center">
              Corpus Stats
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {corpusRows.map((s) => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground">{s.label}</span>
                  <span className="font-mono text-[10px] text-neon font-bold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Planets */}
        {planets.map((p) => {
          const color = STRATEGY_COLORS[p.strategy] ?? "#888888";
          const isHovered = hoveredPlanet === p.strategy;
          const orbitSize = p.orbitIndex * 20 + 14;
          const planetSize = getPlanetSize(p.chunks, allChunks);

          return (
            <div
              key={p.strategy}
              className={`absolute top-1/2 left-1/2 rounded-full orbit-anim-${p.orbitIndex} pointer-events-none`}
              style={{
                width: `${orbitSize}%`,
                height: `${orbitSize}%`,
                marginLeft: `-${orbitSize / 2}%`,
                marginTop: `-${orbitSize / 2}%`,
                animationPlayState: isHovered ? "paused" : "running",
              }}
            >
              <div
                className="absolute left-1/2 cursor-pointer pointer-events-auto"
                style={{ top: `-${planetSize / 2}px`, marginLeft: `-${planetSize / 2}px` }}
                onMouseEnter={() => setHoveredPlanet(p.strategy)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                {/* Comet Trail */}
                <div
                  className="planet-trail"
                  style={{
                    "--trail-color": color,
                    width: `${planetSize}px`,
                    height: `${planetSize}px`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: "50%",
                    pointerEvents: "none",
                  } as React.CSSProperties}
                />
                <Link to="/resultados">
                  <div
                    className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                      isHovered ? "scale-[1.4]" : ""
                    }`}
                    style={{
                      width: `${planetSize}px`,
                      height: `${planetSize}px`,
                      backgroundColor: color,
                      boxShadow: isHovered
                        ? `0 0 20px ${color}80, 0 0 40px ${color}40`
                        : `0 0 8px ${color}40`,
                    }}
                  >
                    <span
                      className="font-mono font-bold transition-opacity duration-300"
                      style={{
                        fontSize: `${Math.max(7, planetSize * 0.22)}px`,
                        color: p.strategy === "recursive" ? "#1a1a2e" : "#fff",
                        opacity: isHovered ? 1 : 0.7,
                      }}
                    >
                      {p.chunks}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}

        {/* HUD Stats */}
        {hudStats.map((s) => (
          <div
            key={s.label}
            className={`absolute ${positionClasses[s.position]} flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2 glow-neon`}
            style={{ backgroundColor: "oklch(0.13 0.03 260 / 0.7)" }}
          >
            <s.icon className="h-3 w-3 sm:h-4 sm:w-4 text-neon" />
            <div>
              <p className="font-mono text-sm sm:text-lg font-bold text-foreground leading-none">{s.value}</p>
              <p className="text-[8px] sm:text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right Legend Panel */}
      <div className="hidden lg:block absolute top-0 right-0 w-56 space-y-3">
        <p className="font-mono text-xs text-neon uppercase tracking-widest mb-2">Estratégias</p>
        {planets.map((p) => {
          const color = STRATEGY_COLORS[p.strategy] ?? "#888888";
          const isActive = hoveredPlanet === p.strategy;
          const label = STRATEGY_LABELS[p.strategy] ?? p.strategy;
          return (
            <div
              key={p.strategy}
              className={`border p-3 transition-all duration-300 cursor-pointer ${isActive ? "glow-neon-strong" : ""}`}
              style={{
                backgroundColor: isActive ? "oklch(0.17 0.03 255 / 0.9)" : "oklch(0.13 0.03 260 / 0.5)",
                borderColor: isActive ? `${color}80` : "oklch(0.3 0.02 255)",
              }}
              onMouseEnter={() => setHoveredPlanet(p.strategy)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
                />
                <span className="font-mono text-xs font-bold" style={{ color }}>{label}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {p.chunks.toLocaleString("pt-BR")} chunks
                </span>
              </div>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: isActive ? "200px" : "0", opacity: isActive ? 1 : 0 }}
              >
                <div className="pt-2 space-y-1 border-t" style={{ borderColor: `${color}20` }}>
                  {Object.entries(p.metrics).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center gap-1">
                      <span className="text-[10px] text-muted-foreground capitalize flex-1">
                        {key.replace(/_/g, " ")}
                      </span>
                      <MiniSparkline metricKey={key} currentStrategy={p.strategy} planets={planets} />
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1 overflow-hidden" style={{ backgroundColor: `${color}20` }}>
                          <div className="h-full" style={{ width: `${(val ?? 0) * 100}%`, backgroundColor: color }} />
                        </div>
                        <span className="font-mono text-[10px] text-foreground w-8 text-right">
                          {val != null ? val.toFixed(3) : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
