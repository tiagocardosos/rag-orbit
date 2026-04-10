import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download } from "lucide-react";
import { StrategyBadge } from "@/components/StrategyBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { mockExperiments } from "@/data/mock-data";

export const Route = createFileRoute("/_layout/experimentos/$id")({
  component: ExperimentDetailPage,
});

function ExperimentDetailPage() {
  const { id } = Route.useParams();
  const exp = mockExperiments.find((e) => e.id === id) || mockExperiments[0];

  const metrics = [
    { label: "Faithfulness", value: exp.avg_faithfulness },
    { label: "Answer Relevancy", value: exp.avg_answer_relevancy },
    { label: "Context Precision", value: exp.avg_context_precision },
    { label: "Context Recall", value: exp.avg_context_recall },
    { label: "Answer Correctness", value: exp.avg_answer_correctness },
    { label: "MRR", value: exp.avg_mrr || 0 },
  ];

  const config = [
    ["Coleção", exp.collection],
    ["Estratégia", exp.strategy],
    ["Chunk Size", "512"],
    ["Chunk Overlap", "50"],
    ["Embedding Model", "text-embedding-3-small"],
    ["Generator Model", "gpt-4o-mini"],
    ["Retrieval Strategy", "semantic"],
    ["top_k", "5"],
    ["Total Questions", String(exp.total_questions)],
    ["Data", exp.created_at],
  ];

  const getColor = (v: number) => {
    if (v >= 0.8) return "oklch(0.75 0.2 145)";
    if (v >= 0.6) return "oklch(0.7 0.15 80)";
    return "oklch(0.6 0.2 25)";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link to="/experimentos"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h1 className="text-2xl font-bold text-foreground">{exp.name}</h1>
          <StatusBadge status={exp.status} />
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exportar CSV</Button>
      </div>

      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Configuração</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {config.map(([label, val]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                {label === "Estratégia" ? <StrategyBadge strategy={exp.strategy} /> : <p className="text-sm font-medium text-foreground">{val}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="glass border-border text-center">
            <CardContent className="pt-6">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="oklch(0.22 0.02 255)" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke={getColor(m.value)} strokeWidth="3"
                    strokeDasharray={`${m.value * 100}, 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: getColor(m.value) }}>
                  {m.value.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Resultados por Pergunta (amostra)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Pergunta</TableHead>
                <TableHead>Faith.</TableHead>
                <TableHead>Ans.Rel.</TableHead>
                <TableHead>Ctx.Prec.</TableHead>
                <TableHead>Ctx.Rec.</TableHead>
                <TableHead>Ans.Corr.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => {
                const vals = [0.95, 0.72, 0.88, 1.0, 0.64].map((v) => v + (Math.random() - 0.5) * 0.2);
                return (
                  <TableRow key={i}>
                    <TableCell className="text-foreground">{i}</TableCell>
                    <TableCell className="text-foreground max-w-xs truncate">Qual é o procedimento para credenciamento de novas unidades?</TableCell>
                    {vals.map((v, j) => (
                      <TableCell key={j}>
                        <span className="font-mono text-xs" style={{ color: getColor(Math.max(0, Math.min(1, v))) }}>
                          {Math.max(0, Math.min(1, v)).toFixed(3)}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
