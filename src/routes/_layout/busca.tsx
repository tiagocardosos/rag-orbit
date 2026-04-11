import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { listCollections } from "@/services/collections";
import { search } from "@/services/search";
import type { Collection, RetrievalStrategy, SearchResult } from "@/lib/types";

export const Route = createFileRoute("/_layout/busca")({
  component: BuscaPage,
});

function BuscaPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionId, setCollectionId] = useState<string>("");
  const [retrievalStrategy, setRetrievalStrategy] = useState<RetrievalStrategy>("semantic");
  const [topK, setTopK] = useState(5);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listCollections()
      .then((cols) => {
        setCollections(cols);
        if (cols.length > 0) setCollectionId(cols[0].id);
      })
      .catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    if (!collectionId) { toast.error("Selecione uma coleção."); return; }
    setLoading(true);
    try {
      const data = await search({ query, collection_id: collectionId, retrieval_strategy: retrievalStrategy, top_k: topK });
      setResults(data.results);
      setSearched(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro na busca.");
    } finally {
      setLoading(false);
    }
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
              <Select value={collectionId} onValueChange={setCollectionId}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {collections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Estratégia</label>
              <Select value={retrievalStrategy} onValueChange={(v) => setRetrievalStrategy(v as RetrievalStrategy)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="semantic">Semantic</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">top_k</label>
              <Input
                type="number"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                min={1}
                max={20}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{results.length} resultados encontrados</p>
          {results.length === 0 ? (
            <Card className="glass border-border p-8 text-center">
              <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
            </Card>
          ) : (
            results.map((r) => (
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
                        {r.metadata.strategy && <Badge variant="outline">{r.metadata.strategy}</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
