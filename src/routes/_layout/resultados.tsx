import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Trophy, BarChart3 } from "lucide-react";
import { mockResultsHeatmap, mockWilcoxonResults, mockVictoryRanking, mockRadarData, mockExperiments } from "@/data/mock-data";
import { STRATEGY_COLORS, STRATEGY_LABELS, METRIC_LABELS } from "@/lib/types";

export const Route = createFileRoute("/_layout/resultados")({
  component: ResultadosPage,
});

function ResultadosPage() {
  const barData = Object.keys(METRIC_LABELS).map((m) => ({
    metric: METRIC_LABELS[m],
    fixed_size: mockExperiments.find((e) => e.strategy === 'fixed_size')?.[`avg_${m}` as keyof typeof mockExperiments[0]] as number || 0,
    recursive: mockExperiments.find((e) => e.strategy === 'recursive')?.[`avg_${m}` as keyof typeof mockExperiments[0]] as number || 0,
    sentence: mockExperiments.find((e) => e.strategy === 'sentence')?.[`avg_${m}` as keyof typeof mockExperiments[0]] as number || 0,
    semantic: mockExperiments.find((e) => e.strategy === 'semantic')?.[`avg_${m}` as keyof typeof mockExperiments[0]] as number || 0,
  }));

  const getHeatmapBg = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    const intensity = Math.round(num * 30);
    return `rgba(0, 255, 65, ${intensity / 100})`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />Resultados e Análise
      </h1>

      {/* Heatmap Table */}
      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Tabela Resumo — Mediana (IQR)</CardTitle></CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estratégia</TableHead>
                <TableHead>Faithfulness</TableHead>
                <TableHead>Answer Relevancy</TableHead>
                <TableHead>Context Precision</TableHead>
                <TableHead>Context Recall</TableHead>
                <TableHead>Answer Correctness</TableHead>
                <TableHead>MRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockResultsHeatmap.map((row) => (
                <TableRow key={row.strategy}>
                  <TableCell style={{ color: STRATEGY_COLORS[row.strategy as keyof typeof STRATEGY_COLORS] }} className="font-medium">
                    {STRATEGY_LABELS[row.strategy as keyof typeof STRATEGY_LABELS]}
                  </TableCell>
                  {['faithfulness', 'answer_relevancy', 'context_precision', 'context_recall', 'answer_correctness', 'mrr'].map((m) => {
                    const val = row[m as keyof typeof row] as string;
                    return (
                      <TableCell key={m} className="font-mono text-sm text-foreground" style={{ backgroundColor: getHeatmapBg(val) }}>
                        {val}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <Card className="glass border-border">
          <CardHeader><CardTitle className="text-foreground">Gráfico Radar</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={mockRadarData}>
                <PolarGrid stroke="oklch(0.3 0.02 255)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 10 }} />
                <Radar name="Fixed-Size" dataKey="fixed_size" stroke={STRATEGY_COLORS.fixed_size} fill={STRATEGY_COLORS.fixed_size} fillOpacity={0.1} />
                <Radar name="Recursive" dataKey="recursive" stroke={STRATEGY_COLORS.recursive} fill={STRATEGY_COLORS.recursive} fillOpacity={0.1} />
                <Radar name="Sentence" dataKey="sentence" stroke={STRATEGY_COLORS.sentence} fill={STRATEGY_COLORS.sentence} fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Semantic" dataKey="semantic" stroke={STRATEGY_COLORS.semantic} fill={STRATEGY_COLORS.semantic} fillOpacity={0.1} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grouped Bar */}
        <Card className="glass border-border">
          <CardHeader><CardTitle className="text-foreground">Barras Agrupadas — Medianas</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 255)" />
                <XAxis dataKey="metric" tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                <YAxis domain={[0, 1]} tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.17 0.03 255)', border: '1px solid oklch(0.3 0.02 255)', color: 'oklch(0.93 0.01 250)' }} />
                <Bar dataKey="fixed_size" name="Fixed-Size" fill={STRATEGY_COLORS.fixed_size} />
                <Bar dataKey="recursive" name="Recursive" fill={STRATEGY_COLORS.recursive} />
                <Bar dataKey="sentence" name="Sentence" fill={STRATEGY_COLORS.sentence} />
                <Bar dataKey="semantic" name="Semantic" fill={STRATEGY_COLORS.semantic} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Wilcoxon */}
      <Card className="glass border-border glow-neon">
        <CardHeader><CardTitle className="text-foreground">Comparações Estatísticas — Wilcoxon (p &lt; 0.05, Holm-Bonferroni)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Métrica</TableHead>
                <TableHead>Par Comparado</TableHead>
                <TableHead>p-value (corrigido)</TableHead>
                <TableHead>Vencedor</TableHead>
                <TableHead>Tamanho de Efeito (r)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWilcoxonResults.map((w, i) => (
                <TableRow key={i}>
                  <TableCell className="text-foreground font-medium">{w.metric}</TableCell>
                  <TableCell className="text-foreground">{w.pair}</TableCell>
                  <TableCell className="font-mono text-foreground">{w.p_value.toFixed(4)}</TableCell>
                  <TableCell className="font-bold text-primary">{w.winner}</TableCell>
                  <TableCell>
                    <span className="font-mono text-foreground">{w.effect_size.toFixed(2)} </span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">{w.effect_label}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Victory Ranking */}
      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" />Ranking de Vitórias</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estratégia</TableHead>
                <TableHead>Vitórias</TableHead>
                <TableHead>Métricas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVictoryRanking.map((r, i) => (
                <TableRow key={r.strategy} className={i === 0 ? 'border-primary/50' : ''}>
                  <TableCell className={`font-medium ${i === 0 ? 'text-primary' : 'text-foreground'}`}>
                    {i === 0 && <Trophy className="inline h-4 w-4 mr-1 text-primary" />}
                    {r.strategy}
                  </TableCell>
                  <TableCell className={`font-bold text-lg ${i === 0 ? 'text-primary' : 'text-foreground'}`}>{r.wins}</TableCell>
                  <TableCell className="text-muted-foreground">{r.metrics}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
