import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ErrorBar } from "recharts";
import { STRATEGY_COLORS, STRATEGY_LABELS, type ChunkingStrategy } from "@/lib/types";

interface BoxPlotData {
  strategy: ChunkingStrategy;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

interface MetricBoxPlotProps {
  title: string;
  data: BoxPlotData[];
}

// Custom shape for box plot rendering
function BoxPlotShape(props: any) {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;

  const { min, q1, median, q3, max, strategy } = payload;
  const color = STRATEGY_COLORS[strategy as ChunkingStrategy] || "#00ff41";
  
  // Scale values to pixel positions (y-axis goes top to bottom)
  const chartBottom = y + height;
  const chartTop = y;
  const range = props.yAxisRange || [0, 1];
  const scale = (val: number) => chartBottom - ((val - range[0]) / (range[1] - range[0])) * height;

  const centerX = x + width / 2;
  const boxWidth = Math.min(width * 0.6, 40);
  const halfBox = boxWidth / 2;

  const yMin = scale(min);
  const yQ1 = scale(q1);
  const yMedian = scale(median);
  const yQ3 = scale(q3);
  const yMax = scale(max);

  return (
    <g>
      {/* Whisker line (min to max) */}
      <line x1={centerX} y1={yMin} x2={centerX} y2={yMax} stroke={color} strokeWidth={1.5} opacity={0.7} />
      {/* Min cap */}
      <line x1={centerX - halfBox / 2} y1={yMin} x2={centerX + halfBox / 2} y2={yMin} stroke={color} strokeWidth={1.5} />
      {/* Max cap */}
      <line x1={centerX - halfBox / 2} y1={yMax} x2={centerX + halfBox / 2} y2={yMax} stroke={color} strokeWidth={1.5} />
      {/* Box (Q1 to Q3) */}
      <rect
        x={centerX - halfBox}
        y={yQ3}
        width={boxWidth}
        height={yQ1 - yQ3}
        fill={`${color}30`}
        stroke={color}
        strokeWidth={1.5}
        rx={2}
      />
      {/* Median line */}
      <line x1={centerX - halfBox} y1={yMedian} x2={centerX + halfBox} y2={yMedian} stroke={color} strokeWidth={2.5} />
    </g>
  );
}

export function MetricBoxPlot({ title, data }: MetricBoxPlotProps) {
  // We draw manually using SVG since Recharts doesn't support box plots natively
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  
  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-2">{title}</h3>
      <div className="w-full" style={{ height: 200 }}>
        <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet">
          {/* Background */}
          <rect width="300" height="200" fill="transparent" />
          
          {/* Grid lines */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => {
            const y = padding.top + (1 - val) * (200 - padding.top - padding.bottom);
            return (
              <g key={val}>
                <line x1={padding.left} y1={y} x2={300 - padding.right} y2={y} stroke="oklch(0.3 0.02 255)" strokeDasharray="3 3" />
                <text x={padding.left - 5} y={y + 4} textAnchor="end" fill="oklch(0.65 0.02 250)" fontSize="9">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Box plots */}
          {data.map((d, i) => {
            const color = STRATEGY_COLORS[d.strategy];
            const totalWidth = 300 - padding.left - padding.right;
            const barWidth = totalWidth / data.length;
            const centerX = padding.left + barWidth * i + barWidth / 2;
            const boxWidth = Math.min(barWidth * 0.5, 35);
            const halfBox = boxWidth / 2;
            
            const chartHeight = 200 - padding.top - padding.bottom;
            const scale = (val: number) => padding.top + (1 - val) * chartHeight;

            const yMin = scale(d.min);
            const yQ1 = scale(d.q1);
            const yMedian = scale(d.median);
            const yQ3 = scale(d.q3);
            const yMax = scale(d.max);

            return (
              <g key={d.strategy}>
                {/* Whisker */}
                <line x1={centerX} y1={yMin} x2={centerX} y2={yMax} stroke={color} strokeWidth={1.5} opacity={0.6} />
                {/* Min cap */}
                <line x1={centerX - halfBox / 2} y1={yMin} x2={centerX + halfBox / 2} y2={yMin} stroke={color} strokeWidth={1.5} />
                {/* Max cap */}
                <line x1={centerX - halfBox / 2} y1={yMax} x2={centerX + halfBox / 2} y2={yMax} stroke={color} strokeWidth={1.5} />
                {/* Box */}
                <rect
                  x={centerX - halfBox}
                  y={yQ3}
                  width={boxWidth}
                  height={yQ1 - yQ3}
                  fill={`${color}25`}
                  stroke={color}
                  strokeWidth={1.5}
                  rx={2}
                />
                {/* Median */}
                <line x1={centerX - halfBox} y1={yMedian} x2={centerX + halfBox} y2={yMedian} stroke={color} strokeWidth={2.5} />
                {/* Label */}
                <text x={centerX} y={200 - padding.bottom + 15} textAnchor="middle" fill={color} fontSize="8" fontWeight="500">
                  {STRATEGY_LABELS[d.strategy].slice(0, 8)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
