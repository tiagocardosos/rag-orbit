import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Scissors } from "lucide-react";
import { mockChunkingLabStats, mockChunks } from "@/data/mock-data";
import { STRATEGY_LABELS, STRATEGY_COLORS } from "@/lib/types";
import type { ChunkingStrategy } from "@/lib/types";

export const Route = createFileRoute("/_layout/chunking-lab")({
  component: ChunkingLabPage,
});

function ChunkingLabPage() {
  const strategies: ChunkingStrategy[] = ['fixed_size', 'recursive', 'sentence', 'semantic'];
  const [selected, setSelected] = useState<ChunkingStrategy[]>(['fixed_size', 'sentence']);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = (s: ChunkingStrategy) => {
    setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setShowPreview(true); }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Scissors className="h-6 w-6 text-primary" />Chunking Lab</h1>

      <Card className="glass border-border">
        <CardContent className="pt-6 space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Arraste um documento para comparar estratégias</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {strategies.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={selected.includes(s)} onCheckedChange={() => toggle(s)} />
                <span className="text-sm" style={{ color: STRATEGY_COLORS[s] }}>{STRATEGY_LABELS[s]}</span>
              </label>
            ))}
          </div>

          <Button onClick={handleGenerate} disabled={loading || selected.length === 0}>
            {loading ? "Gerando preview..." : "Gerar Preview"}
          </Button>
        </CardContent>
      </Card>

      {showPreview && (
        <>
          <Card className="glass border-border">
            <CardHeader><CardTitle className="text-foreground">Estatísticas Comparativas</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estratégia</TableHead>
                    <TableHead>Total Chunks</TableHead>
                    <TableHead>Média chars</TableHead>
                    <TableHead>Min</TableHead>
                    <TableHead>Max</TableHead>
                    <TableHead>Mediana</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selected.filter((s) => s in mockChunkingLabStats).map((s) => {
                    const stats = mockChunkingLabStats[s as keyof typeof mockChunkingLabStats];
                    return (
                      <TableRow key={s}>
                        <TableCell style={{ color: STRATEGY_COLORS[s] }}>{STRATEGY_LABELS[s]}</TableCell>
                        <TableCell className="text-foreground">{stats.total_chunks}</TableCell>
                        <TableCell className="text-foreground">{stats.avg_size}</TableCell>
                        <TableCell className="text-foreground">{stats.min_size}</TableCell>
                        <TableCell className="text-foreground">{stats.max_size}</TableCell>
                        <TableCell className="text-foreground">{stats.median_size}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selected.slice(0, 2).map((s) => (
              <Card key={s} className="glass border-border">
                <CardHeader>
                  <CardTitle style={{ color: STRATEGY_COLORS[s] }}>{STRATEGY_LABELS[s]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockChunks.map((chunk) => (
                    <div key={chunk.chunk_index} className="terminal-block rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Chunk #{chunk.chunk_index}</div>
                      <pre className="text-xs whitespace-pre-wrap max-h-24 overflow-auto">{chunk.content}</pre>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
