import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
import { listCollections } from "@/services/collections";
import { ingestDocument, listCollectionDocuments, listDocumentChunks } from "@/services/documents";
import type { Collection, ChunkingStrategy, Chunk } from "@/lib/types";
import { STRATEGY_LABELS } from "@/lib/types";
import type { CollectionDocument } from "@/services/documents";

export const Route = createFileRoute("/_layout/documentos")({
  validateSearch: (search: Record<string, unknown>) => ({
    collection: typeof search.collection === "string" ? search.collection : "",
  }),
  component: DocumentosPage,
});

function DocumentosPage() {
  const { collection: collectionId } = Route.useSearch();
  const navigate = Route.useNavigate();

  const setCollectionId = (id: string) => {
    navigate({ search: { collection: id }, replace: true });
  };

  const [collections, setCollections] = useState<Collection[]>([]);
  const [strategy, setStrategy] = useState<ChunkingStrategy>("fixed_size");
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ingesting, setIngesting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<CollectionDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const [showChunks, setShowChunks] = useState(false);
  const [chunksLoading, setChunksLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<CollectionDocument | null>(null);
  const [chunks, setChunks] = useState<Chunk[]>([]);

  // Carrega coleções; se nenhuma está na URL, define a primeira como padrão
  useEffect(() => {
    listCollections()
      .then((cols) => {
        setCollections(cols);
        if (!collectionId && cols.length > 0) setCollectionId(cols[0].id);
      })
      .catch(() => {});
  }, []);

  // Recarrega documentos sempre que a coleção na URL mudar
  useEffect(() => {
    if (!collectionId) { setDocuments([]); return; }
    setDocsLoading(true);
    listCollectionDocuments(collectionId)
      .then(setDocuments)
      .catch(() => {})
      .finally(() => setDocsLoading(false));
  }, [collectionId]);

  const handleFileSelect = (file: File) => setSelectedFile(file);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleIngest = async () => {
    if (!selectedFile) { toast.error("Selecione um arquivo."); return; }
    if (!collectionId) { toast.error("Selecione uma coleção."); return; }

    setIngesting(true);
    try {
      const result = await ingestDocument({
        file: selectedFile,
        collection_id: collectionId,
        chunking_strategy: strategy,
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
      });
      toast.success(`Documento ingerido: ${result.total_chunks} chunks gerados.`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      const updated = await listCollectionDocuments(collectionId);
      setDocuments(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao ingerir documento.");
    } finally {
      setIngesting(false);
    }
  };

  const handleViewChunks = async (doc: CollectionDocument) => {
    setSelectedDoc(doc);
    setChunks([]);
    setShowChunks(true);
    setChunksLoading(true);
    try {
      const result = await listDocumentChunks(doc.id);
      setChunks(result.chunks);
    } catch {
      toast.error("Erro ao carregar chunks.");
    } finally {
      setChunksLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Documentos</h1>

      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Upload e Ingestão</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            {selectedFile ? (
              <p className="text-sm text-primary font-medium">{selectedFile.name}</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Arraste um arquivo ou clique para selecionar</p>
                <p className="text-xs text-muted-foreground mt-1">.pdf, .xml, .json</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.xml,.json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Select value={strategy} onValueChange={(v) => setStrategy(v as ChunkingStrategy)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(STRATEGY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Chunk Size</label>
              <Input
                type="number"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                min={64}
                max={2048}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Chunk Overlap</label>
              <Input
                type="number"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(Number(e.target.value))}
                min={0}
                max={512}
              />
            </div>
          </div>

          <Button onClick={handleIngest} disabled={ingesting || !selectedFile}>
            {ingesting ? "Processando..." : "Ingerir Documento"}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Documentos Ingeridos</CardTitle></CardHeader>
        <CardContent>
          {docsLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando documentos...</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {collectionId ? "Nenhum documento nesta coleção." : "Selecione uma coleção para ver os documentos."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estratégia</TableHead>
                  <TableHead>Chunks</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono text-sm text-foreground">{doc.filename}</TableCell>
                    <TableCell><Badge variant="secondary">{doc.doc_type.toUpperCase()}</Badge></TableCell>
                    <TableCell><StrategyBadge strategy={doc.chunking_strategy} /></TableCell>
                    <TableCell className="text-foreground">{doc.total_chunks}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.created_at.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewChunks(doc)}>
                        <Eye className="h-4 w-4 mr-1" />Chunks
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showChunks} onOpenChange={setShowChunks}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Chunks de {selectedDoc?.filename}</DialogTitle>
          </DialogHeader>
          {chunksLoading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Carregando chunks...</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {chunks.length} chunks | Estratégia: {selectedDoc?.chunking_strategy}
              </p>
              <div className="space-y-3">
                {chunks.map((chunk) => (
                  <div key={chunk.chunk_index} className="terminal-block rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-2">Chunk #{chunk.chunk_index}</div>
                    <pre className="text-sm whitespace-pre-wrap leading-relaxed max-h-40 overflow-auto">{chunk.content}</pre>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
