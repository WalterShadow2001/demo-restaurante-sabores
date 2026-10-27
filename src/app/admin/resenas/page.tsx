"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, Trash2, Loader2, Filter, Clock } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminNav } from "@/components/site/admin-nav";
import { StarRating } from "@/components/site/star-rating";
import { formatDate } from "@/lib/format";
import type { Resena } from "@/lib/types";

type Filtro = "todas" | "pendientes" | "aprobadas";

export default function AdminResenasPage() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/resenas/todas?filtro=${filtro}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se pudieron cargar las reseñas");
      const data = await res.json();
      setResenas(data.resenas as Resena[]);
    } catch (e: any) {
      toast.error("Error al cargar", { description: e.message });
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAprobar(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/resenas/${id}/aprobar`, { method: "PUT" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo aprobar");
      }
      toast.success("Reseña aprobada", {
        description: "Ahora será visible públicamente.",
      });
      await load();
    } catch (e: any) {
      toast.error("No se pudo aprobar", { description: e.message });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusyId(deleteId);
    try {
      const res = await fetch(`/api/resenas/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo eliminar");
      }
      toast.success("Reseña eliminada");
      setDeleteOpen(false);
      setDeleteId(null);
      await load();
    } catch (e: any) {
      toast.error("No se pudo eliminar", { description: e.message });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminNav>
      <div className="space-y-6">
        <header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight">Reseñas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Aprueba las reseñas que verán tus comensales.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <Select value={filtro} onValueChange={(v) => setFiltro(v as Filtro)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="pendientes">Pendientes</SelectItem>
                <SelectItem value="aprobadas">Aprobadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : resenas.length === 0 ? (
          <div className="grid place-items-center rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">
              No hay reseñas {filtro !== "todas" ? `con filtro "${filtro}"` : "todavía"}.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {resenas.map((r, i) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <Card className="p-0">
                    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="grid size-9 place-items-center rounded-full bg-primary/10 font-serif font-bold text-primary">
                              {r.autor.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-serif font-semibold">{r.autor}</p>
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="size-3" />
                                {formatDate(r.creadoEn)}
                              </p>
                            </div>
                          </div>
                          <StarRating value={r.calificacion} size={14} />
                          <Badge
                            variant="outline"
                            className={
                              r.aprobada
                                ? "border-accent/40 text-accent"
                                : "border-secondary/40 text-foreground/70"
                            }
                          >
                            {r.aprobada ? "Aprobada" : "Pendiente"}
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm text-foreground/80 text-pretty">
                          &ldquo;{r.comentario}&rdquo;
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 sm:flex-col">
                        {!r.aprobada && (
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleAprobar(r.id)}
                            disabled={busyId === r.id}
                          >
                            {busyId === r.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Check className="size-4" />
                            )}
                            Aprobar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                          onClick={() => {
                            setDeleteId(r.id);
                            setDeleteOpen(true);
                          }}
                          disabled={busyId === r.id}
                        >
                          <Trash2 className="size-4" /> Eliminar
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta reseña?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La reseña será eliminada
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminNav>
  );
}
