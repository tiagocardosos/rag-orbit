import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search } from "lucide-react";
import { mockSearchResults, mockCollections } from "@/data/mock-data";

export const Route = createFileRoute("/_layout/busca")({
  component: BuscaPage,
});

function BuscaPage() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setShowResults(true); }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Search className="h-6 w-6 text-primary" />Busca Semântica</h1>

      <Card className="glass border-border glow-neon">
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Faça uma pergunta sobre os documentos..."
              className="text-lg h-12"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading} className="h-12 px-6">
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Coleção</label>
              <Select defaultValue="col-003">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockCollections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Estratégia</label>
              <Select defaultValue="semantic">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="semantic">Semantic</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">top_k</label>
              <Input type="number" defaultValue={5} min={1} max={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{mockSearchResults.length} resultados encontrados</p>
          {mockSearchResults.map((r) => (
            <Card key={r.rank} className={`glass border-border ${r.rank === 1 ? 'glow-neon-strong' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${r.rank === 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    #{r.rank}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-primary">{(r.score * 100).toFixed(0)}%</span>
                      <Progress value={r.score * 100} className="h-2 flex-1" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{r.content}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">{r.metadata.document}</Badge>
                      <Badge variant="secondary">Chunk #{r.metadata.chunk_index}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
