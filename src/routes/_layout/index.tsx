import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, FlaskConical, Star, ChevronRight } from "lucide-react";
import { SolarSystem } from "@/components/SolarSystem";
import { mockRecentExperiments } from "@/data/mock-data";
import { STRATEGY_COLORS } from "@/lib/types";
import type { ChunkingStrategy } from "@/lib/types";

export const Route = createFileRoute("/_layout/")({
  component: DashboardPage,
});

function ProgressBar({ value, color }: { value: number; color: string }) {
  const filled = Math.round(value * 10);
  const empty = 10 - filled;
  return (
    <span style={{ color }}>
      {"█".repeat(filled)}
      <span style={{ opacity: 0.2 }}>{"░".repeat(empty)}</span>
    </span>
  );
}

function TypingButton({ cmd, to, icon: Icon }: { cmd: string; to: string; icon: React.ComponentType<{ className?: string }> }) {
  const [displayText, setDisplayText] = useState(cmd);
  const [isTyping, setIsTyping] = useState(false);

  const handleMouseEnter = () => {
    if (isTyping) return;
    setIsTyping(true);
    setDisplayText("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayText(cmd.slice(0, i));
      if (i >= cmd.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40);
  };

  return (
    <Link
      to={to}
      className="group flex items-center gap-3 p-4 border border-border bg-terminal hover:border-neon transition-all duration-200 hover:glow-neon"
      onMouseEnter={handleMouseEnter}
    >
      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-neon transition-colors" />
      <span className="font-mono text-sm text-terminal-foreground flex-1">
        <span className="text-neon">$</span> {displayText}
        <span className="terminal-cursor ml-0.5 group-hover:inline hidden">
          _
        </span>
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-neon transition-colors" />
    </Link>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground font-mono">
        <span className="text-neon">$</span> dashboard_matrix
      </h1>

      {/* Solar System Hero */}
      <div className="glass border border-neon/10 p-4 sm:p-6">
        <SolarSystem />
      </div>

      {/* Terminal Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mission Log */}
        <div className="lg:col-span-2 terminal-block border border-neon/10 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-neon animate-pulse-glow" />
            <span className="font-mono text-xs text-neon uppercase tracking-widest">
              Mission Log — Últimos Experimentos
            </span>
          </div>
          <div className="space-y-2">
            {mockRecentExperiments.map((e) => {
              const color = STRATEGY_COLORS[e.strategy as ChunkingStrategy];
              const isRunning = e.status === "running";
              return (
                <div
                  key={e.name}
                  className="flex items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs"
                >
                  <span className="text-muted-foreground hidden sm:inline">
                    [{e.created_at}]
                  </span>
                  <span style={{ color }}>▸</span>
                  <span className="text-foreground truncate min-w-0 flex-1">
                    {e.name}
                  </span>
                  {isRunning ? (
                    <>
                      <span className="text-muted-foreground">
                        <ProgressBar value={0} color="oklch(0.65 0.02 250)" />
                      </span>
                      <span className="text-muted-foreground">—</span>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full animate-pulse-glow" style={{ backgroundColor: color }} />
                        <span style={{ color }}>running</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        <ProgressBar
                          value={e.avg_answer_correctness ?? 0}
                          color={color}
                        />
                      </span>
                      <span className="text-foreground w-10 text-right">
                        {e.avg_answer_correctness?.toFixed(3)}
                      </span>
                      <span className="text-neon">✓</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Launch */}
        <div className="space-y-3">
          <span className="font-mono text-xs text-neon uppercase tracking-widest">
            Quick Launch
          </span>
          <TypingButton cmd="nova_ingestao" to="/documentos" icon={FileText} />
          <TypingButton cmd="rodar_experimento" to="/experimentos" icon={FlaskConical} />
          <TypingButton cmd="ver_resultados" to="/resultados" icon={Star} />
        </div>
      </div>
    </div>
  );
}
