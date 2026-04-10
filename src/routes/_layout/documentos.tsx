import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, Eye } from "lucide-react";
import { toast } from "sonner";
import { StrategyBadge } from "@/components/StrategyBadge";
import { mockDocuments, mockChunks, mockCollections } from "@/data/mock-data";
import type { ChunkingStrategy } from "@/lib/types";
import { STRATEGY_LABELS } from "@/lib/types";

export const Route = createFileRoute("/_layout/documentos")({
  component: DocumentosPage,
});

function DocumentosPage() {
  const [strategy, setStrategy] = useState<ChunkingStrategy>("fixed_size");
  const [showChunks, setShowChunks] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleIngest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Documento ingerido com sucesso!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Documentos</h1>

      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Upload e Ingestão</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Arraste um arquivo ou clique para selecionar</p>
            <p className="text-xs text-muted-foreground mt-1">.pdf, .xml, .json</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Coleção</label>
              <Select defaultValue="col-001">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockCollections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Estratégia</label>
              <Select value={strategy} onValueChange={(v) => setStrategy(v as ChunkingStrategy)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(STRATEGY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Chunk Size</label>
              <Input type="number" defaultValue={512} min={64} max={2048} />
            </div>
          </div>

          <Button onClick={handleIngest} disabled={loading}>
            {loading ? "Processando..." : "Ingerir Documento"}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Documentos Ingeridos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arquivo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Coleção</TableHead>
                <TableHead>Estratégia</TableHead>
                <TableHead>Chunks</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-mono text-sm text-foreground">{doc.filename}</TableCell>
                  <TableCell><Badge variant="secondary">{doc.doc_type.toUpperCase()}</Badge></TableCell>
                  <TableCell className="text-foreground">{doc.collection}</TableCell>
                  <TableCell><StrategyBadge strategy={doc.strategy} /></TableCell>
                  <TableCell className="text-foreground">{doc.total_chunks}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.created_at}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedDoc(doc.filename); setShowChunks(true); }}>
                      <Eye className="h-4 w-4 mr-1" />Chunks
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showChunks} onOpenChange={setShowChunks}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader><DialogTitle>Chunks de {selectedDoc}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{mockChunks.length} chunks | Estratégia: fixed_size</p>
          <div className="space-y-3">
            {mockChunks.map((chunk) => (
              <div key={chunk.chunk_index} className="terminal-block rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-2">Chunk #{chunk.chunk_index}</div>
                <pre className="text-sm whitespace-pre-wrap leading-relaxed max-h-40 overflow-auto">{chunk.content}</pre>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
