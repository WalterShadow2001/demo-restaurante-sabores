"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Phone, StickyNote, Filter } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminNav } from "@/components/site/admin-nav";
import { formatPrice, formatDate } from "@/lib/format";
import {
  ESTADO_PEDIDO_LABELS,
  ESTADO_PEDIDO_BADGE,
  type EstadoPedido,
  type Pedido,
  type PedidoItem,
} from "@/lib/types";

const ESTADO_OPTIONS: EstadoPedido[] = [
  "recibido",
  "en_preparacion",
  "listo",
  "entregado",
];

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("todos");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        filtro === "todos"
          ? "/api/pedidos"
          : `/api/pedidos?estado=${filtro}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se pudieron cargar los pedidos");
      const data = await res.json();
      setPedidos(data.pedidos as Pedido[]);
    } catch (e: any) {
      toast.error("Error al cargar", { description: e.message });
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleEstadoChange(pedidoId: string, nuevoEstado: EstadoPedido) {
    setUpdatingId(pedidoId);
    try {
      const res = await fetch(`/api/pedidos/${pedidoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo actualizar");
      }
      toast.success("Estado actualizado", {
        description: `Ahora: ${ESTADO_PEDIDO_LABELS[nuevoEstado]}`,
      });
      await load();
    } catch (e: any) {
      toast.error("No se pudo actualizar", { description: e.message });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminNav>
      <div className="space-y-6">
        <header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight">Pedidos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona los pedidos recibidos en la tienda.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <Select value={filtro} onValueChange={setFiltro}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {ESTADO_OPTIONS.map((e) => (
                  <SelectItem key={e} value={e}>
                    {ESTADO_PEDIDO_LABELS[e]}
                  </SelectItem>
                ))}
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
        ) : pedidos.length === 0 ? (
          <div className="grid place-items-center rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">
              No hay pedidos {filtro !== "todos" ? "con este estado" : "todavía"}.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {pedidos.map((p, i) => {
                let items: PedidoItem[] = [];
                try {
                  items = JSON.parse(p.items) as PedidoItem[];
                } catch {
                  items = [];
                }
                const estado = (p.estado ?? "recibido") as EstadoPedido;
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <Card className="p-0">
                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
                        {/* Left: customer + items */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-serif text-lg font-semibold">
                              {p.clienteNombre}
                            </p>
                            <Badge className={ESTADO_PEDIDO_BADGE[estado]}>
                              {ESTADO_PEDIDO_LABELS[estado]}
                            </Badge>
                          </div>
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Phone className="size-3.5" />
                            <a
                              href={`tel:${p.clientePhone}`}
                              className="hover:text-primary"
                            >
                              {p.clientePhone}
                            </a>
                            <span>·</span>
                            <span>{formatDate(p.creadoEn)}</span>
                          </p>

                          <ul className="mt-3 space-y-1">
                            {items.map((it, idx) => (
                              <li
                                key={`${it.platilloId}-${idx}`}
                                className="flex items-center justify-between gap-3 rounded-md bg-muted/30 px-3 py-1.5 text-sm"
                              >
                                <span className="min-w-0 truncate">
                                  <span className="font-semibold">
                                    {it.cantidad}×
                                  </span>{" "}
                                  {it.nombre}
                                </span>
                                <span className="shrink-0 text-muted-foreground">
                                  {formatPrice(it.precio * it.cantidad)}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {p.notas && (
                            <p className="mt-2 flex items-start gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                              <StickyNote className="mt-0.5 size-3.5 shrink-0" />
                              <span>{p.notas}</span>
                            </p>
                          )}
                        </div>

                        {/* Right: total + estado control */}
                        <div className="flex flex-col items-stretch gap-3 sm:min-w-[200px] sm:items-end">
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                              Total
                            </p>
                            <p className="font-serif text-2xl font-bold text-primary">
                              {formatPrice(p.total)}
                            </p>
                          </div>
                          <div className="w-full sm:w-auto">
                            <Select
                              value={estado}
                              onValueChange={(v) =>
                                handleEstadoChange(p.id, v as EstadoPedido)
                              }
                              disabled={updatingId === p.id}
                            >
                              <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ESTADO_OPTIONS.map((e) => (
                                  <SelectItem key={e} value={e}>
                                    {ESTADO_PEDIDO_LABELS[e]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminNav>
  );
}
