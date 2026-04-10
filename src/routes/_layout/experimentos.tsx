import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FlaskConical, Play, Eye } from "lucide-react";
import { toast } from "sonner";
import { StrategyBadge } from "@/components/StrategyBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { mockExperiments, mockCollections } from "@/data/mock-data";

export const Route = createFileRoute("/_layout/experimentos")({
  component: ExperimentosPage,
});

function ExperimentosPage() {
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success("Experimento iniciado!"); }, 2000);
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
                <div><label className="text-sm text-muted-foreground">Nome</label><Input placeholder="Nome do experimento" /></div>
                <div><label className="text-sm text-muted-foreground">Coleção</label>
                  <Select defaultValue="col-003"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{mockCollections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div><label className="text-sm text-muted-foreground">Embedding Model</label>
                  <Select defaultValue="text-embedding-3-small"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem><SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem></SelectContent>
                  </Select></div>
                <div><label className="text-sm text-muted-foreground">Modelo Gerador</label>
                  <Select defaultValue="gpt-4o-mini"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem><SelectItem value="gpt-4o">gpt-4o</SelectItem></SelectContent>
                  </Select></div>
                <div><label className="text-sm text-muted-foreground">Busca</label>
                  <Select defaultValue="semantic"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="semantic">Semantic</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent>
                  </Select></div>
                <div><label className="text-sm text-muted-foreground">top_k</label><Input type="number" defaultValue={5} /></div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Golden Questions (JSON)</label>
                <Textarea placeholder='Cole o JSON das golden questions aqui...' rows={4} />
                <p className="text-xs text-muted-foreground mt-1">231 perguntas carregadas (139 factual, 92 inferential)</p>
              </div>

              <Button onClick={handleStart} disabled={loading} className="bg-primary text-primary-foreground">
                <Play className="mr-2 h-4 w-4" />{loading ? "Iniciando..." : "Iniciar Experimento"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card className="glass border-border">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Coleção</TableHead>
                    <TableHead>Estratégia</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Perguntas</TableHead>
                    <TableHead>Ans. Correct.</TableHead>
                    <TableHead>Faithfulness</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockExperiments.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell className="font-medium text-foreground">{exp.name}</TableCell>
                      <TableCell className="text-foreground">{exp.collection}</TableCell>
                      <TableCell><StrategyBadge strategy={exp.strategy} /></TableCell>
                      <TableCell><StatusBadge status={exp.status} /></TableCell>
                      <TableCell className="text-foreground">{exp.total_questions}</TableCell>
                      <TableCell className="font-mono text-foreground">{exp.avg_answer_correctness.toFixed(3)}</TableCell>
                      <TableCell className="font-mono text-foreground">{exp.avg_faithfulness.toFixed(3)}</TableCell>
                      <TableCell className="text-muted-foreground">{exp.created_at}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/experimentos/$id" params={{ id: exp.id }}><Eye className="h-4 w-4 mr-1" />Detalhes</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
