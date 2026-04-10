import type { ExperimentStatus } from "@/lib/types";
import { STATUS_COLORS } from "@/lib/types";

export function StatusBadge({ status }: { status: ExperimentStatus }) {
  const color = STATUS_COLORS[status];
  const isRunning = status === "running";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isRunning ? 'animate-pulse-glow' : ''}`}
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
