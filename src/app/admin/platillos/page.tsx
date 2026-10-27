"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, Star, Search } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { formatPrice } from "@/lib/format";
import { CATEGORIAS, type Platillo } from "@/lib/types";

interface PlatilloForm {
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string;
  imagen: string;
  etiquetas: string;
  destacado: boolean;
  disponible: boolean;
}

const EMPTY_FORM: PlatilloForm = {
  nombre: "",
  descripcion: "",
  precio: "",
  categoria: "Entrada",
  imagen: "🍽️",
  etiquetas: "",
  destacado: false,
  disponible: true,
};

export default function AdminPlatillosPage() {
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlatilloForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");

  const loadPlatillos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/platillos");
      if (!res.ok) throw new Error("No se pudieron cargar los platillos");
      const data = await res.json();
      setPlatillos(data.platillos as Platillo[]);
    } catch (e: any) {
      toast.error("Error al cargar", { description: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlatillos();
  }, [loadPlatillos]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEdit(p: Platillo) {
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: String(p.precio),
      categoria: p.categoria,
      imagen: p.imagen,
      etiquetas: p.etiquetas,
      destacado: p.destacado,
      disponible: p.disponible,
    });
    setEditingId(p.id);
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) {
      toast.error("Escribe el nombre");
      return;
    }
    const precio = parseFloat(form.precio);
    if (!Number.isFinite(precio) || precio < 0) {
      toast.error("Precio inválido");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio,
        categoria: form.categoria,
        imagen: form.imagen.trim() || "🍽️",
        etiquetas: form.etiquetas.trim(),
        destacado: form.destacado,
        disponible: form.disponible,
      };
      const url = editingId ? `/api/platillos/${editingId}` : "/api/platillos";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar");
      toast.success(editingId ? "Platillo actualizado" : "Platillo creado");
      setDialogOpen(false);
      await loadPlatillos();
    } catch (e: any) {
      toast.error("No se pudo guardar", { description: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/platillos/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo eliminar");
      }
      toast.success("Platillo eliminado");
      setDeleteOpen(false);
      setDeleteId(null);
      await loadPlatillos();
    } catch (e: any) {
      toast.error("No se pudo eliminar", { description: e.message });
    }
  }

  const filtered = platillos.filter((p) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(s) ||
      p.categoria.toLowerCase().includes(s) ||
      p.etiquetas.toLowerCase().includes(s)
    );
  });

  return (
    <AdminNav>
      <div className="space-y-6">
        <header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight">Platillos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona la carta del restaurante.
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="size-4" /> Agregar platillo
          </Button>
        </header>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, categoría o etiqueta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="grid gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="grid place-items-center rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">
              {platillos.length === 0
                ? "Aún no hay platillos. Crea el primero."
                : "Ningún platillo coincide con tu búsqueda."}
            </p>
          </div>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Platillo</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center">Dest.</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filtered.map((p) => (
                      <motion.tr
                        key={p.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="grid size-9 place-items-center rounded-md bg-secondary/20 text-xl">
                              {p.imagen}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{p.nombre}</p>
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {p.etiquetas || "—"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{p.categoria}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatPrice(p.precio)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={p.disponible ? "default" : "secondary"}
                            className={p.disponible ? "bg-accent text-accent-foreground" : ""}
                          >
                            {p.disponible ? "Disponible" : "Agotado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {p.destacado && (
                            <Star className="mx-auto size-4 fill-secondary text-secondary" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => openEdit(p)}
                              aria-label={`Editar ${p.nombre}`}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeleteId(p.id);
                                setDeleteOpen(true);
                              }}
                              aria-label={`Eliminar ${p.nombre}`}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Create/Edit dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto scrollbar-thin">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editingId ? "Editar platillo" : "Nuevo platillo"}
              </DialogTitle>
              <DialogDescription className="text-pretty">
                {editingId
                  ? "Modifica los datos del platillo seleccionado."
                  : "Completa los datos del nuevo platillo que se añadirá a la carta."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej. Tacos al pastor"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, descripcion: e.target.value }))
                  }
                  placeholder="Ingredientes, preparación, porción..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="precio">Precio (MXN) *</Label>
                  <Input
                    id="precio"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    value={form.precio}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, precio: e.target.value }))
                    }
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select
                    value={form.categoria}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, categoria: v }))
                    }
                  >
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Elige una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="imagen">Imagen (emoji) *</Label>
                  <div className="flex items-center gap-2">
                    <span className="grid size-10 place-items-center rounded-md border border-border bg-secondary/15 text-2xl">
                      {form.imagen || "🍽️"}
                    </span>
                    <Input
                      id="imagen"
                      value={form.imagen}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, imagen: e.target.value }))
                      }
                      placeholder="🍽️"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="etiquetas">Etiquetas (separadas por comas)</Label>
                  <Input
                    id="etiquetas"
                    value={form.etiquetas}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, etiquetas: e.target.value }))
                    }
                    placeholder="recomendado,picante,veggie"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 rounded-md border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="destacado"
                    checked={form.destacado}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, destacado: v === true }))
                    }
                  />
                  <Label htmlFor="destacado" className="cursor-pointer">
                    Destacado en home
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="disponible"
                    checked={form.disponible}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, disponible: v }))
                    }
                  />
                  <Label htmlFor="disponible" className="cursor-pointer">
                    {form.disponible ? "Disponible" : "Agotado"}
                  </Label>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Guardando...
                    </>
                  ) : (
                    <>{editingId ? "Guardar cambios" : "Crear platillo"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar este platillo?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El platillo desaparecerá
                inmediatamente del menú público.
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
      </div>
    </AdminNav>
  );
}
