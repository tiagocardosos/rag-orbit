import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import { getExperiment } from "@/services/experiments";
import type { ExperimentSummary, ExperimentResultItem } from "@/services/experiments";

export const Route = createFileRoute("/_layout/experimentos/$id")({
  component: ExperimentDetailPage,
});

const METRIC_KEYS: Array<{ key: keyof ExperimentSummary; label: string }> = [
  { key: "avg_faithfulness", label: "Faithfulness" },
  { key: "avg_answer_relevancy", label: "Answer Relevancy" },
  { key: "avg_context_precision", label: "Context Precision" },
  { key: "avg_context_recall", label: "Context Recall" },
  { key: "avg_answer_correctness", label: "Answer Correctness" },
];

const RESULT_METRIC_KEYS: Array<{ key: keyof ExperimentResultItem; label: string }> = [
  { key: "faithfulness", label: "Faith." },
  { key: "answer_relevancy", label: "Ans.Rel." },
  { key: "context_precision", label: "Ctx.Prec." },
  { key: "context_recall", label: "Ctx.Rec." },
  { key: "answer_correctness", label: "Ans.Corr." },
  { key: "mrr", label: "MRR" },
];

function getColor(v: number) {
  if (v >= 0.8) return "oklch(0.75 0.2 145)";
  if (v >= 0.6) return "oklch(0.7 0.15 80)";
  return "oklch(0.6 0.2 25)";
}

function exportCSV(exp: ExperimentSummary) {
  const headers = ["question", "generated_answer", ...RESULT_METRIC_KEYS.map((m) => m.key)].join(",");
  const rows = exp.results.map((r) =>
    [
      JSON.stringify(r.question),
      JSON.stringify(r.generated_answer),
      ...RESULT_METRIC_KEYS.map((m) => r[m.key] ?? ""),
    ].join(","),
  );
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `experimento_${exp.experiment_id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function ExperimentDetailPage() {
  const { id } = Route.useParams();
  const [exp, setExp] = useState<ExperimentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperiment(id)
      .then(setExp)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="icon" asChild><Link to="/experimentos"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <p className="text-muted-foreground">Experimento não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/experimentos"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{exp.name}</h1>
          <StatusBadge status={exp.status} />
        </div>
        <Button variant="outline" onClick={() => exportCSV(exp)}>
          <Download className="mr-2 h-4 w-4" />Exportar CSV
        </Button>
      </div>

      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Informações</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">ID</p>
              <p className="text-sm font-mono text-foreground truncate">{exp.experiment_id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge status={exp.status} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Perguntas</p>
              <p className="text-sm font-medium text-foreground">{exp.total_questions}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Resultados</p>
              <p className="text-sm font-medium text-foreground">{exp.results.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {METRIC_KEYS.map((m) => {
          const val = exp[m.key] as number | null;
          const display = val ?? 0;
          return (
            <Card key={m.key} className="glass border-border text-center">
              <CardContent className="pt-6">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="oklch(0.22 0.02 255)" strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke={getColor(display)} strokeWidth="3"
                      strokeDasharray={`${display * 100}, 100`} strokeLinecap="round"
                    />
                  </svg>
                  <span
                    className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                    style={{ color: getColor(display) }}
                  >
                    {val != null ? val.toFixed(2) : "—"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {exp.results.length > 0 && (
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Resultados por Pergunta</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Pergunta</TableHead>
                  {RESULT_METRIC_KEYS.map((m) => <TableHead key={m.key}>{m.label}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {exp.results.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-foreground">{i + 1}</TableCell>
                    <TableCell className="text-foreground max-w-xs">
                      <div className="truncate" title={r.question}>{r.question}</div>
                      <div className="text-xs text-muted-foreground mt-1 truncate" title={r.generated_answer}>
                        ↳ {r.generated_answer}
                      </div>
                    </TableCell>
                    {RESULT_METRIC_KEYS.map((m) => {
                      const val = r[m.key] as number | null;
                      return (
                        <TableCell key={m.key}>
                          {val != null ? (
                            <span className="font-mono text-xs" style={{ color: getColor(val) }}>
                              {val.toFixed(3)}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
