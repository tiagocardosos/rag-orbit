import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Settings } from "lucide-react";
import { mockChatMessages, mockCollections } from "@/data/mock-data";
import type { ChatMessage } from "@/lib/types";

export const Route = createFileRoute("/_layout/chat")({
  component: ChatPage,
});

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Com base nos documentos analisados, posso informar que a EMBRAPII estabelece critérios específicos para esta questão. Os detalhes estão descritos no Manual de Operação, seção relevante ao tema consultado.",
        context: [{ rank: 1, score: 0.91, content: "Trecho relevante do documento recuperado pelo sistema de busca vetorial...", source: "manual_operacao_embrapii_v6.pdf" }],
        latency_ms: 287,
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-7rem)]">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />RAG Chat
          </h1>
          <Button variant="ghost" size="icon" onClick={() => setShowConfig(!showConfig)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <Card className="glass border-border flex-1 flex flex-col overflow-hidden">
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.context && (
                    <Accordion type="single" collapsible className="mt-3">
                      <AccordionItem value="context" className="border-border/50">
                        <AccordionTrigger className="text-xs py-1">
                          Contexto Recuperado ({msg.context.length} chunks)
                        </AccordionTrigger>
                        <AccordionContent>
                          {msg.context.map((ctx, j) => (
                            <div key={j} className="terminal-block rounded p-2 mt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>#{ctx.rank} — {ctx.source}</span>
                                <span>{(ctx.score * 100).toFixed(0)}%</span>
                              </div>
                              <p className="text-xs">{ctx.content}</p>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  {msg.latency_ms && <Badge variant="secondary" className="mt-2 text-xs">{msg.latency_ms}ms</Badge>}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-lg p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Faça uma pergunta..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {showConfig && (
        <Card className="glass border-border w-72 shrink-0">
          <CardHeader><CardTitle className="text-foreground text-sm">Configuração</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Coleção</label>
              <Select defaultValue="col-003">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockCollections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Busca</label>
              <Select defaultValue="semantic">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="semantic">Semantic</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">top_k</label>
              <Input type="number" defaultValue={5} min={1} max={20} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Modelo</label>
              <Select defaultValue="gpt-4o-mini">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                  <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
