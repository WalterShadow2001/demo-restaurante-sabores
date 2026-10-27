"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { Platillo } from "@/lib/types";

interface AddToCartProps {
  platillo: Platillo;
}

export function AddToCartButton({ platillo }: AddToCartProps) {
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  const setOpen = useCartStore((s) => s.setOpen);

  function handleAdd() {
    if (!platillo.disponible) {
      toast.error("Este platillo no está disponible ahora");
      return;
    }
    add(
      {
        platilloId: platillo.id,
        nombre: platillo.nombre,
        precio: platillo.precio,
        imagen: platillo.imagen,
      },
      qty
    );
    toast.success(`${qty} × ${platillo.nombre} agregado`, {
      description: "Revisa tu pedido en el carrito",
    });
    setQty(1);
    setOpen(true);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3 rounded-full border border-border bg-card p-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 rounded-full"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Disminuir cantidad"
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-8 text-center font-serif text-lg font-bold">{qty}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 rounded-full"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Aumentar cantidad"
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="flex-1"
      >
        <Button
          size="lg"
          className="w-full gap-2 sm:w-auto"
          onClick={handleAdd}
          disabled={!platillo.disponible}
        >
          {platillo.disponible ? (
            <>
              <ShoppingBag className="size-4" /> Agregar al carrito
            </>
          ) : (
            <>
              <Check className="size-4" /> No disponible
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
