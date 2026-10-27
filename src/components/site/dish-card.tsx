"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import type { Platillo } from "@/lib/types";

interface DishCardProps {
  platillo: Platillo;
  href?: string;
  index?: number;
}

export function DishCard({ platillo, href, index = 0 }: DishCardProps) {
  const add = useCartStore((s) => s.add);

  const etiquetas = platillo.etiquetas
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({
      platilloId: platillo.id,
      nombre: platillo.nombre,
      precio: platillo.precio,
      imagen: platillo.imagen,
    });
    toast.success(`${platillo.nombre} agregado al carrito`);
  }

  const linkHref = href ?? `/menu/${platillo.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="group relative overflow-hidden border-border/70 bg-card p-0 transition-all hover:border-primary/40 hover:shadow-lg">
        <Link href={linkHref} className="block">
          {/* Image area: emoji-based */}
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/30 via-background to-accent/15">
            <span className="text-7xl transition-transform duration-300 group-hover:scale-110">
              {platillo.imagen}
            </span>
            {platillo.destacado && (
              <Badge className="absolute left-3 top-3 gap-1 bg-primary text-primary-foreground">
                <Star className="size-3" /> Recomendado
              </Badge>
            )}
            {!platillo.disponible && (
              <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
                <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wide text-background">
                  Agotado
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <Link href={linkHref} className="flex-1">
              <h3 className="font-serif text-base font-semibold leading-tight hover:text-primary transition-colors">
                {platillo.nombre}
              </h3>
            </Link>
            <span className="shrink-0 font-serif text-lg font-bold text-primary">
              {formatPrice(platillo.precio)}
            </span>
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground text-pretty">
            {platillo.descripcion}
          </p>

          {etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {etiquetas.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-secondary/50 text-[10px] uppercase tracking-wide text-foreground/70"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-2 flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Link href={linkHref}>Ver detalles</Link>
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!platillo.disponible}
              className={cn("gap-1")}
              aria-label={`Agregar ${platillo.nombre} al carrito`}
            >
              <Plus className="size-4" /> Agregar
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
