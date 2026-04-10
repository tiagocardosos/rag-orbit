import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, FileText, FlaskConical, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StrategyBadge } from "@/components/StrategyBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { mockDashboardStats, mockRecentExperiments, mockRadarData } from "@/data/mock-data";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";
import { STRATEGY_COLORS } from "@/lib/types";

export const Route = createFileRoute("/_layout/")({
  component: DashboardPage,
});

function DashboardPage() {
  const stats = [
    { label: "Coleções", value: mockDashboardStats.collections, icon: FolderOpen, color: "#0984e3" },
    { label: "Documentos", value: mockDashboardStats.documents, icon: FileText, color: "#00ff41" },
    { label: "Experimentos", value: mockDashboardStats.experiments_completed, icon: FlaskConical, color: "#ffd93d" },
    { label: "Golden Questions", value: mockDashboardStats.golden_questions, icon: Star, color: "#a855f7" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass glow-neon border-border">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg p-3" style={{ backgroundColor: `${s.color}15` }}>
                <s.icon className="h-6 w-6" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-border">
          <CardHeader><CardTitle className="text-foreground">Últimos Experimentos</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Estratégia</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ans. Correctness</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentExperiments.map((e) => (
                  <TableRow key={e.name}>
                    <TableCell className="font-medium text-foreground">{e.name}</TableCell>
                    <TableCell><StrategyBadge strategy={e.strategy} /></TableCell>
                    <TableCell><StatusBadge status={e.status} /></TableCell>
                    <TableCell className="font-mono text-foreground">{e.avg_answer_correctness?.toFixed(3) ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardHeader><CardTitle className="text-foreground">Comparação Rápida</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={mockRadarData}>
                <PolarGrid stroke="oklch(0.3 0.02 255)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 10 }} />
                <Radar name="Fixed-Size" dataKey="fixed_size" stroke={STRATEGY_COLORS.fixed_size} fill={STRATEGY_COLORS.fixed_size} fillOpacity={0.1} />
                <Radar name="Recursive" dataKey="recursive" stroke={STRATEGY_COLORS.recursive} fill={STRATEGY_COLORS.recursive} fillOpacity={0.1} />
                <Radar name="Sentence" dataKey="sentence" stroke={STRATEGY_COLORS.sentence} fill={STRATEGY_COLORS.sentence} fillOpacity={0.1} />
                <Radar name="Semantic" dataKey="semantic" stroke={STRATEGY_COLORS.semantic} fill={STRATEGY_COLORS.semantic} fillOpacity={0.1} />
                <Legend wrapperStyle={{ fontSize: '11px', color: 'oklch(0.65 0.02 250)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Ações Rápidas</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 border-border hover:border-primary hover:glow-neon" asChild>
              <Link to="/documentos"><FileText className="mr-2 h-5 w-5" />Nova Ingestão<ArrowRight className="ml-auto h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 border-border hover:border-primary hover:glow-neon" asChild>
              <Link to="/experimentos"><FlaskConical className="mr-2 h-5 w-5" />Rodar Experimento<ArrowRight className="ml-auto h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 border-border hover:border-primary hover:glow-neon" asChild>
              <Link to="/resultados"><Star className="mr-2 h-5 w-5" />Ver Resultados<ArrowRight className="ml-auto h-4 w-4" /></Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
