import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FolderOpen, Plus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { listCollections, createCollection, deleteCollection } from "@/services/collections";
import type { Collection } from "@/lib/types";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/colecoes")({
  component: ColecoesPage,
});

function ColecoesPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listCollections()
      .then(setCollections)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const col = await createCollection(newName.trim(), newDesc.trim() || undefined);
      setCollections((prev) => [...prev, col]);
      setShowModal(false);
      setNewName("");
      setNewDesc("");
      toast.success("Coleção criada com sucesso!");
    } catch {
      toast.error("Erro ao criar coleção.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Coleção "${name}" removida.`);
    } catch {
      toast.error("Erro ao remover coleção.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Coleções</h1>
        <Button onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />Nova Coleção
        </Button>
      </div>

      {loading ? (
        <Card className="glass border-border p-12 text-center">
          <p className="text-muted-foreground">Carregando coleções...</p>
        </Card>
      ) : collections.length === 0 ? (
        <Card className="glass border-border p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma coleção criada ainda.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <Card key={col.id} className="glass border-border glow-neon">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />{col.name}
                </CardTitle>
                <CardDescription>{col.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{col.created_at}</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm" className="border-border" asChild>
                  <Link to="/documentos" search={{ collection: col.id }}><FileText className="mr-1 h-3 w-3" />Ver Docs</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-destructive text-destructive">
                      <Trash2 className="mr-1 h-3 w-3" />Deletar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Deseja realmente excluir "{col.name}"? Esta ação remove todos os documentos e chunks indexados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(col.id, col.name)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Coleção</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Nome *</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome da coleção" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Descrição</label>
              <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Descrição opcional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!newName.trim() || saving}>
              {saving ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
