import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, Upload } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { mockGoldenQuestions, mockGoldenStats } from "@/data/mock-data";

export const Route = createFileRoute("/_layout/golden-set")({
  component: GoldenSetPage,
});

function GoldenSetPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(0);
  const perPage = 5;

  const filtered = mockGoldenQuestions.filter((q) => {
    if (typeFilter !== "all" && q.type !== typeFilter) return false;
    if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pieData = [
    { name: 'Factual', value: mockGoldenStats.factual },
    { name: 'Inferential', value: mockGoldenStats.inferential },
  ];

  const barDocData = mockGoldenStats.by_document.map((d) => ({
    name: d.document.length > 20 ? d.document.slice(0, 20) + '...' : d.document,
    factual: d.factual,
    inferential: d.inferential,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Star className="h-6 w-6 text-primary" />Golden Set
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{mockGoldenStats.total}</p>
            <p className="text-sm text-muted-foreground">Total de Perguntas</p>
          </CardContent>
        </Card>
        <Card className="glass border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{mockGoldenStats.factual}</p>
            <p className="text-sm text-muted-foreground">Factuais ({Math.round(mockGoldenStats.factual / mockGoldenStats.total * 100)}%)</p>
          </CardContent>
        </Card>
        <Card className="glass border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{mockGoldenStats.inferential}</p>
            <p className="text-sm text-muted-foreground">Inferenciais ({Math.round(mockGoldenStats.inferential / mockGoldenStats.total * 100)}%)</p>
          </CardContent>
        </Card>
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value">
                  <Cell fill="#00ff41" />
                  <Cell fill="#0984e3" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00ff41' }} />Factual</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0984e3' }} />Inferential</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Distribuição por Documento</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barDocData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 255)" />
              <XAxis type="number" tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fill: 'oklch(0.65 0.02 250)', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'oklch(0.17 0.03 255)', border: '1px solid oklch(0.3 0.02 255)', color: 'oklch(0.93 0.01 250)' }} />
              <Bar dataKey="factual" name="Factual" fill="#00ff41" stackId="a" />
              <Bar dataKey="inferential" name="Inferential" fill="#0984e3" stackId="a" />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Perguntas</CardTitle>
          <div className="flex gap-2 mt-2">
            <Input placeholder="Buscar pergunta..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="max-w-sm" />
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="factual">Factual</SelectItem>
                <SelectItem value="inferential">Inferential</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Pergunta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Documento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(page * perPage, (page + 1) * perPage).map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="text-foreground">{q.id}</TableCell>
                  <TableCell className="text-foreground max-w-md">{q.question}</TableCell>
                  <TableCell>
                    <Badge style={{ backgroundColor: q.type === 'factual' ? '#00ff4120' : '#0984e320', color: q.type === 'factual' ? '#00ff41' : '#0984e3', border: `1px solid ${q.type === 'factual' ? '#00ff4140' : '#0984e340'}` }}>
                      {q.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{q.document}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">{filtered.length} perguntas</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</Button>
              <Button variant="outline" size="sm" disabled={(page + 1) * perPage >= filtered.length} onClick={() => setPage(page + 1)}>Próxima</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border">
        <CardHeader><CardTitle className="text-foreground">Upload de Golden Set</CardTitle></CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Arraste um arquivo JSON com golden questions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
