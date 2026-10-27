"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import type { PedidoItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const WHATSAPP_NUMBER = "526394728100"; // Formato internacional sin + ni espacios

export default function CarritoPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total());
  const [mounted, setMounted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHydrated(true);
  }, []);

  function buildWhatsAppMessage(): string {
    const lines: string[] = [];
    lines.push("*Nuevo pedido - Sabores de Delicias*");
    lines.push("");
    items.forEach((item, i) => {
      lines.push(
        `${i + 1}. ${item.nombre} ×${item.cantidad} - ${formatPrice(
          item.precio * item.cantidad
        )}`
      );
    });
    lines.push("");
    lines.push(`*Total: ${formatPrice(total)}*`);
    if (notas) {
      lines.push("");
      lines.push(`*Notas:* ${notas}`);
    }
    lines.push("");
    lines.push(`*Cliente:* ${nombre || "(sin nombre)"}`);
    lines.push(`*Teléfono:* ${telefono || "(sin teléfono)"}`);
    return lines.join("\n");
  }

  async function handleSubmitPedido() {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    if (!nombre.trim()) {
      toast.error("Escribe tu nombre");
      return;
    }
    if (!telefono.trim()) {
      toast.error("Escribe tu teléfono");
      return;
    }

    setSubmitting(true);
    const pedidoItems: PedidoItem[] = items.map((i) => ({
      platilloId: i.platilloId,
      nombre: i.nombre,
      precio: i.precio,
      cantidad: i.cantidad,
    }));

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteNombre: nombre.trim(),
          clientePhone: telefono.trim(),
          items: pedidoItems,
          total,
          notas: notas.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "No se pudo registrar el pedido");
      }

      const msg = encodeURIComponent(buildWhatsAppMessage());
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
      window.open(url, "_blank", "noopener,noreferrer");

      toast.success("¡Pedido enviado! Te redirigimos a WhatsApp.", {
        description: "Nos pondremos en contacto para confirmar.",
      });

      // Clear cart and redirect
      setTimeout(() => {
        clear();
        router.push("/");
      }, 1500);
    } catch (e: any) {
      toast.error("No se pudo enviar el pedido", {
        description: e.message || "Intenta de nuevo en un momento.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <section className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold">Tu carrito</h1>
        <div className="mt-6 grid gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid place-items-center rounded-2xl border border-dashed border-border p-12 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-muted">
            <ShoppingBag className="size-8 text-muted-foreground" />
          </div>
          <h1 className="mt-4 font-serif text-3xl font-bold">Tu carrito está vacío</h1>
          <p className="mt-2 max-w-md text-muted-foreground text-pretty">
            Aún no has agregado platillos. Explora nuestro menú y prepara
            tu pedido.
          </p>
          <Button asChild size="lg" className="mt-6 gap-2">
            <Link href="/menu">
              Ver el menú <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
        Tu carrito
      </h1>
      <p className="mt-2 text-muted-foreground text-pretty">
        Revisa tu pedido, completa tus datos y envíalo por WhatsApp. Te
        confirmaremos en seguida.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div>
          <Card className="p-0">
            <CardHeader className="border-b py-4">
              <CardTitle className="font-serif text-lg">
                {items.length} {items.length === 1 ? "artículo" : "artículos"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.platilloId}
                      layout
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10, height: 0 }}
                      className="flex gap-4 p-4"
                    >
                      <div className="grid size-16 shrink-0 place-items-center rounded-md bg-secondary/25 text-3xl">
                        {item.imagen}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-medium">{item.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.precio)} c/u
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              remove(item.platilloId);
                              toast.success(`${item.nombre} eliminado`);
                            }}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                            aria-label={`Eliminar ${item.nombre}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="size-8"
                              onClick={() =>
                                updateQuantity(item.platilloId, item.cantidad - 1)
                              }
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="size-3.5" />
                            </Button>
                            <span className="w-9 text-center text-sm font-semibold">
                              {item.cantidad}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="size-8"
                              onClick={() =>
                                updateQuantity(item.platilloId, item.cantidad + 1)
                              }
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="size-3.5" />
                            </Button>
                          </div>
                          <span className="font-serif text-base font-bold text-primary">
                            {formatPrice(item.precio * item.cantidad)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </CardContent>
          </Card>

          <div className="mt-4 flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link href="/menu">← Seguir pidiendo</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                clear();
                toast.success("Carrito vaciado");
              }}
            >
              <Trash2 className="size-4" /> Vaciar carrito
            </Button>
          </div>
        </div>

        {/* Resumen + form */}
        <div className="lg:sticky lg:top-24">
          <Card className="flex flex-col gap-4 p-5">
            <div>
              <CardTitle className="font-serif text-lg">Resumen del pedido</CardTitle>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-muted-foreground">Acordar con el cliente</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-serif text-2xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <Label htmlFor="nombre">Tu nombre *</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. María González"
                  autoComplete="name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 6391234567"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                />
              </div>
              <div>
                <Label htmlFor="notas">Notas (opcional)</Label>
                <Textarea
                  id="notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Sin salsa picante, para llevar, etc."
                  rows={3}
                />
              </div>
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleSubmitPedido}
              disabled={submitting || !mounted}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" /> Enviar pedido por WhatsApp
                </>
              )}
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Te redirigirá a WhatsApp con tu pedido listo para enviar.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
