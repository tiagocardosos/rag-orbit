import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { Trophy, BarChart3, Loader2 } from "lucide-react";
import { STRATEGY_COLORS, STRATEGY_LABELS, METRIC_LABELS } from "@/lib/types";
import type { ChunkingStrategy } from "@/lib/types";
import { MetricBoxPlot } from "@/components/MetricBoxPlot";
import {
  fetchStrategies, fetchDistributions, fetchStatTests, fetchRankings, fetchTemporal,
} from "@/services/analytics";
import type {
  StrategyStats, StatTestComparison, RankingEntry, TemporalExperiment,
} from "@/services/analytics";
import { fmtDate } from "@/lib/utils";

export const Route = createFileRoute("/_layout/resultados")({
  component: ResultadosPage,
});

const CHART_STYLE = {
  tooltip: { backgroundColor: "oklch(0.17 0.03 255)", border: "1px solid oklch(0.3 0.02 255)", color: "oklch(0.93 0.01 250)" },
  grid: "oklch(0.3 0.02 255)",
  tick: { fill: "oklch(0.65 0.02 250)", fontSize: 10 },
};

const METRICS = Object.keys(METRIC_LABELS) as (keyof typeof METRIC_LABELS)[];

function effectLabel(r: number) {
  if (r < 0.1) return "negligível";
  if (r < 0.3) return "pequeno";
  if (r < 0.5) return "médio";
  return "grande";
}

function getHeatmapBg(val: number) {
  const intensity = Math.round(val * 30);
  return `rgba(0, 255, 65, ${intensity / 100})`;
}

function LoadingCard() {
  return (
    <div className="flex items-center justify-center h-32 text-muted-foreground gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Carregando...</span>
    </div>
  );
}

function ResultadosPage() {
  const [strategies, setStrategies] = useState<StrategyStats[]>([]);
  const [distributions, setDistributions] = useState<Record<string, Record<string, { min: number; q1: number; median: number; q3: number; max: number }>>>({});
  const [statTests, setStatTests] = useState<StatTestComparison[]>([]);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [temporal, setTemporal] = useState<TemporalExperiment[]>([]);
  const [temporalMetric, setTemporalMetric] = useState<string>("avg_faithfulness");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchStrategies(),
      fetchDistributions(),
      fetchStatTests(),
      fetchRankings(),
      fetchTemporal(),
    ]).then(([s, d, st, r, t]) => {
      setStrategies(s.strategies);
      setDistributions(d.metrics);
      setStatTests(st.comparisons);
      setRankings(r.rankings);
      setTemporal(t.experiments.sort((a, b) => a.created_at.localeCompare(b.created_at)));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Radar data — mean per metric per strategy
  const radarData = METRICS.map((m) => {
    const entry: Record<string, number | string> = { metric: METRIC_LABELS[m] };
    strategies.forEach((s) => { entry[s.strategy] = s[m as keyof StrategyStats] ? (s[m as keyof StrategyStats] as { mean: number }).mean : 0; });
    return entry;
  });

  // Bar data — median per metric per strategy
  const barData = METRICS.map((m) => {
    const entry: Record<string, number | string> = { metric: METRIC_LABELS[m] };
    strategies.forEach((s) => { entry[s.strategy] = s[m as keyof StrategyStats] ? (s[m as keyof StrategyStats] as { median: number }).median : 0; });
    return entry;
  });

  // Box plot data — distributions per metric
  const boxPlotData: Record<string, { strategy: ChunkingStrategy; min: number; q1: number; median: number; q3: number; max: number }[]> = {};
  Object.entries(distributions).forEach(([metric, byStrategy]) => {
    boxPlotData[metric] = Object.entries(byStrategy).map(([strategy, stats]) => ({
      strategy: strategy as ChunkingStrategy,
      ...stats,
    }));
  });

  // Temporal chart data
  const temporalData = temporal.map((e) => ({
    name: e.name,
    strategy: e.strategy,
    value: e[temporalMetric as keyof TemporalExperiment] as number ?? 0,
    date: fmtDate(e.created_at),
  }));

  const strategyList = strategies.map((s) => s.strategy);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />Resultados e Análise
      </h1>

      {/* Heatmap — Median por estratégia */}
      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Tabela Resumo — Mediana por Estratégia</CardTitle></CardHeader>
        <CardContent className="overflow-auto">
          {loading ? <LoadingCard /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estratégia</TableHead>
                  {METRICS.map((m) => <TableHead key={m}>{METRIC_LABELS[m]}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {strategies.map((s) => (
                  <TableRow key={s.strategy}>
                    <TableCell style={{ color: STRATEGY_COLORS[s.strategy as ChunkingStrategy] }} className="font-medium">
                      {STRATEGY_LABELS[s.strategy as keyof typeof STRATEGY_LABELS] ?? s.strategy}
                    </TableCell>
                    {METRICS.map((m) => {
                      const stats = s[m as keyof StrategyStats] as { median: number } | undefined;
                      const val = stats?.median ?? 0;
                      return (
                        <TableCell key={m} className="font-mono text-sm text-foreground" style={{ backgroundColor: getHeatmapBg(val) }}>
                          {val.toFixed(3)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <Card className="glass border-border">
          <CardHeader><CardTitle className="text-foreground">Radar — Média por Métrica</CardTitle></CardHeader>
          <CardContent>
            {loading ? <LoadingCard /> : (
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={CHART_STYLE.grid} />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "oklch(0.65 0.02 250)", fontSize: 10 }} />
                  {strategyList.map((s) => (
                    <Radar
                      key={s}
                      name={STRATEGY_LABELS[s as keyof typeof STRATEGY_LABELS] ?? s}
                      dataKey={s}
                      stroke={STRATEGY_COLORS[s as ChunkingStrategy] ?? "#888"}
                      fill={STRATEGY_COLORS[s as ChunkingStrategy] ?? "#888"}
                      fillOpacity={0.1}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Grouped Bar */}
        <Card className="glass border-border">
          <CardHeader><CardTitle className="text-foreground">Barras Agrupadas — Medianas</CardTitle></CardHeader>
          <CardContent>
            {loading ? <LoadingCard /> : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} />
                  <XAxis dataKey="metric" tick={{ fill: "oklch(0.65 0.02 250)", fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis domain={[0, 1]} tick={CHART_STYLE.tick} />
                  <Tooltip contentStyle={CHART_STYLE.tooltip} />
                  {strategyList.map((s) => (
                    <Bar
                      key={s}
                      dataKey={s}
                      name={STRATEGY_LABELS[s as keyof typeof STRATEGY_LABELS] ?? s}
                      fill={STRATEGY_COLORS[s as ChunkingStrategy] ?? "#888"}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Box Plots */}
      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Distribuição por Métrica — Box Plots</CardTitle></CardHeader>
        <CardContent>
          {loading ? <LoadingCard /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(boxPlotData).map(([metric, data]) => (
                <MetricBoxPlot key={metric} title={METRIC_LABELS[metric] ?? metric} data={data} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Temporal */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-foreground">Evolução Temporal dos Experimentos</CardTitle>
            <Select value={temporalMetric} onValueChange={setTemporalMetric}>
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METRICS.map((m) => (
                  <SelectItem key={m} value={`avg_${m}`}>{METRIC_LABELS[m]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingCard /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={temporalData} margin={{ bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "oklch(0.65 0.02 250)", fontSize: 9 }}
                  angle={-30}
                  textAnchor="end"
                  height={70}
                />
                <YAxis domain={[0, 1]} tick={CHART_STYLE.tick} />
                <Tooltip
                  contentStyle={CHART_STYLE.tooltip}
                  formatter={(value: number, _name: string, props: any) => [
                    value.toFixed(3),
                    `${METRIC_LABELS[temporalMetric.replace("avg_", "")] ?? temporalMetric} (${STRATEGY_LABELS[props.payload?.strategy as keyof typeof STRATEGY_LABELS] ?? props.payload?.strategy})`,
                  ]}
                  labelFormatter={(label, payload) => `${label} — ${fmtDate(payload?.[0]?.payload?.date ?? "")}`}
                />
                <Bar dataKey="value" name="Valor" radius={[3, 3, 0, 0]}>
                  {temporalData.map((entry, i) => (
                    <Cell key={i} fill={STRATEGY_COLORS[entry.strategy as ChunkingStrategy] ?? "#888"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          {!loading && (
            <div className="flex flex-wrap gap-3 mt-3 justify-center">
              {strategyList.map((s) => (
                <span key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STRATEGY_COLORS[s as ChunkingStrategy] ?? "#888" }} />
                  {STRATEGY_LABELS[s as keyof typeof STRATEGY_LABELS] ?? s}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistical Tests */}
      <Card className="glass border-border glow-neon">
        <CardHeader><CardTitle className="text-foreground">Comparações Estatísticas — Wilcoxon (p &lt; 0.05, Holm-Bonferroni)</CardTitle></CardHeader>
        <CardContent>
          {loading ? <LoadingCard /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrica</TableHead>
                  <TableHead>Par Comparado</TableHead>
                  <TableHead>n</TableHead>
                  <TableHead>p-value (corrigido)</TableHead>
                  <TableHead>Significativo</TableHead>
                  <TableHead>Vencedor</TableHead>
                  <TableHead>Tamanho de Efeito (r)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statTests.map((c, i) => (
                  <TableRow key={i} className={c.significant ? "border-primary/30" : ""}>
                    <TableCell className="text-foreground font-medium">{METRIC_LABELS[c.metric] ?? c.metric}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {STRATEGY_LABELS[c.strategy_a as keyof typeof STRATEGY_LABELS] ?? c.strategy_a}
                      {" vs "}
                      {STRATEGY_LABELS[c.strategy_b as keyof typeof STRATEGY_LABELS] ?? c.strategy_b}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{c.n_pairs}</TableCell>
                    <TableCell className="font-mono text-foreground">{c.p_corrected.toFixed(4)}</TableCell>
                    <TableCell>
                      {c.significant
                        ? <Badge className="bg-primary/20 text-primary border-primary/30">Sim</Badge>
                        : <Badge variant="secondary">Não</Badge>}
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      {c.winner ? (STRATEGY_LABELS[c.winner as keyof typeof STRATEGY_LABELS] ?? c.winner) : "—"}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-foreground">{c.effect_size_r.toFixed(2)} </span>
                      <Badge className="bg-muted text-muted-foreground border-border">{effectLabel(c.effect_size_r)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Rankings */}
      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" />Ranking de Estratégias</CardTitle></CardHeader>
        <CardContent>
          {loading ? <LoadingCard /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Estratégia</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Vitórias</TableHead>
                  <TableHead>Métricas Ganhas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((r, i) => (
                  <TableRow key={r.strategy} className={i === 0 ? "border-primary/50" : ""}>
                    <TableCell className={`font-bold text-lg ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>
                      {i === 0 ? <Trophy className="inline h-4 w-4 mr-1 text-primary" /> : null}{i + 1}
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      style={{ color: STRATEGY_COLORS[r.strategy as ChunkingStrategy] ?? undefined }}
                    >
                      {STRATEGY_LABELS[r.strategy as keyof typeof STRATEGY_LABELS] ?? r.strategy}
                    </TableCell>
                    <TableCell className="font-mono text-foreground">{r.score.toFixed(4)}</TableCell>
                    <TableCell className={`font-bold ${i === 0 ? "text-primary" : "text-foreground"}`}>{r.wins}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {r.metrics_won.length > 0
                        ? r.metrics_won.map((m) => METRIC_LABELS[m] ?? m).join(", ")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
