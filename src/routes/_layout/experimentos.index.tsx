import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FlaskConical, Play, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { StrategyBadge } from "@/components/StrategyBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { listCollections } from "@/services/collections";
import { listExperiments, runExperiment } from "@/services/experiments";
import type { Collection, ChunkingStrategy, ExperimentStatus } from "@/lib/types";
import { STRATEGY_LABELS } from "@/lib/types";

export const Route = createFileRoute("/_layout/experimentos/")({
  component: ExperimentosPage,
});

// ⚠️ PONTO DE ATENÇÃO (BACKEND): ExperimentRunResponse não retorna collection_name,
// chunking_strategy nem created_at. Colunas correspondentes ficam vazias na tabela.
interface LocalExperiment {
  experiment_id: string;
  name: string;
  status: ExperimentStatus;
  total_questions: number;
  avg_faithfulness: number | null;
  avg_answer_correctness: number | null;
}

function ExperimentosPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [experiments, setExperiments] = useState<LocalExperiment[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const topKRef = useRef<HTMLInputElement>(null);
  const questionsRef = useRef<HTMLTextAreaElement>(null);
  const [collectionId, setCollectionId] = useState<string>("");
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-3-small");
  const [generatorModel, setGeneratorModel] = useState("gpt-4o-mini");
  const [retrievalStrategy, setRetrievalStrategy] = useState("semantic");
  const [chunkingStrategy, setChunkingStrategy] = useState<ChunkingStrategy>("fixed_size");

  useEffect(() => {
    listCollections()
      .then((cols) => {
        setCollections(cols);
        if (cols.length > 0) setCollectionId(cols[0].id);
      })
      .catch(() => {});

    loadExperiments();
  }, []);

  const loadExperiments = () => {
    setLoadingList(true);
    listExperiments()
      .then((data) =>
        setExperiments(
          data.map((e) => ({
            experiment_id: e.experiment_id,
            name: e.name,
            status: e.status,
            total_questions: e.total_questions,
            avg_faithfulness: e.avg_faithfulness,
            avg_answer_correctness: e.avg_answer_correctness,
          })),
        ),
      )
      .catch(() => {})
      .finally(() => setLoadingList(false));
  };

  const handleStart = async () => {
    const name = nameRef.current?.value.trim();
    const topK = Number(topKRef.current?.value ?? 5);
    const questionsRaw = questionsRef.current?.value.trim();

    if (!name) { toast.error("Informe o nome do experimento."); return; }
    if (!collectionId) { toast.error("Selecione uma coleção."); return; }
    if (!questionsRaw) { toast.error("Cole as golden questions em JSON."); return; }

    let goldenQuestions;
    try {
      goldenQuestions = JSON.parse(questionsRaw);
      if (!Array.isArray(goldenQuestions)) throw new Error("Deve ser um array.");
    } catch (err) {
      toast.error(`JSON inválido: ${err instanceof Error ? err.message : "erro de parse"}`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await runExperiment({
        name,
        collection_id: collectionId,
        chunking_strategy: chunkingStrategy,
        retrieval_strategy: retrievalStrategy as "semantic" | "hybrid",
        top_k: topK,
        embedding_model: embeddingModel,
        generator_model: generatorModel,
        golden_questions: goldenQuestions,
      });

      toast.success(`Experimento "${name}" iniciado (${result.total_questions} perguntas).`);
      loadExperiments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao iniciar experimento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <FlaskConical className="h-6 w-6 text-primary" />Experimentos
      </h1>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="new">Novo Experimento</TabsTrigger>
          <TabsTrigger value="list">Meus Experimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4 mt-4">
          <Card className="glass border-border">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Nome</label>
                  <Input ref={nameRef} placeholder="Nome do experimento" />
                </div>
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
                  <label className="text-sm text-muted-foreground">Estratégia de Chunking</label>
                  <Select value={chunkingStrategy} onValueChange={(v) => setChunkingStrategy(v as ChunkingStrategy)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STRATEGY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Embedding Model</label>
                  <Select value={embeddingModel} onValueChange={setEmbeddingModel}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                      <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Modelo Gerador</label>
                  <Select value={generatorModel} onValueChange={setGeneratorModel}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                      <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Busca</label>
                  <Select value={retrievalStrategy} onValueChange={setRetrievalStrategy}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semantic">Semantic</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">top_k</label>
                  <Input ref={topKRef} type="number" defaultValue={5} min={1} max={20} />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Golden Questions (JSON)</label>
                <Textarea
                  ref={questionsRef}
                  placeholder='[{"question": "...", "expected_answer": "...", "question_type": "factual"}]'
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Array de objetos com os campos: question (obrigatório), expected_answer, question_type
                </p>
              </div>

              <Button onClick={handleStart} disabled={submitting} className="bg-primary text-primary-foreground">
                <Play className="mr-2 h-4 w-4" />{submitting ? "Iniciando..." : "Iniciar Experimento"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card className="glass border-border">
            <CardContent className="pt-6">
              <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={loadExperiments} disabled={loadingList}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${loadingList ? 'animate-spin' : ''}`} />Atualizar
                </Button>
              </div>
              {loadingList ? (
                <p className="text-sm text-muted-foreground text-center py-8">Carregando experimentos...</p>
              ) : experiments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum experimento encontrado.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Perguntas</TableHead>
                      <TableHead>Ans. Correct.</TableHead>
                      <TableHead>Faithfulness</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experiments.map((exp) => (
                      <TableRow key={exp.experiment_id}>
                        <TableCell className="font-medium text-foreground">{exp.name}</TableCell>
                        <TableCell><StatusBadge status={exp.status} /></TableCell>
                        <TableCell className="text-foreground">{exp.total_questions}</TableCell>
                        <TableCell className="font-mono text-foreground">
                          {exp.avg_answer_correctness != null ? exp.avg_answer_correctness.toFixed(3) : "—"}
                        </TableCell>
                        <TableCell className="font-mono text-foreground">
                          {exp.avg_faithfulness != null ? exp.avg_faithfulness.toFixed(3) : "—"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to="/experimentos/$id" params={{ id: exp.experiment_id }}>
                              <Eye className="h-4 w-4 mr-1" />Detalhes
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
