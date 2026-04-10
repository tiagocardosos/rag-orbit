import type { ChunkingStrategy } from "@/lib/types";
import { STRATEGY_COLORS, STRATEGY_LABELS } from "@/lib/types";

export function StrategyBadge({ strategy }: { strategy: ChunkingStrategy }) {
  const color = STRATEGY_COLORS[strategy];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {STRATEGY_LABELS[strategy]}
    </span>
  );
}
