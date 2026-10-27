"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore, type CartItem } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total());

  function handleCheckout() {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    onOpenChange(false);
    // Navigate via window.location since this is a client component
    window.location.href = "/carrito";
  }

  function handleClear() {
    clear();
    toast.success("Carrito vaciado");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="flex items-center gap-2 font-serif text-lg">
            <ShoppingBag className="size-5 text-primary" />
            Tu pedido
          </SheetTitle>
          <SheetDescription className="sr-only">
            Lista de platillos en tu carrito de compras
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-serif text-lg font-semibold">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Agrega platillos del menú para empezar tu pedido.
              </p>
            </div>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link href="/menu">Ver el menú</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 scrollbar-thin">
              <ul className="flex flex-col gap-3 p-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartLine
                      key={item.platilloId}
                      item={item}
                      onInc={() =>
                        updateQuantity(item.platilloId, item.cantidad + 1)
                      }
                      onDec={() =>
                        updateQuantity(item.platilloId, item.cantidad - 1)
                      }
                      onRemove={() => {
                        remove(item.platilloId);
                        toast.success(`${item.nombre} eliminado`);
                      }}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </ScrollArea>

            <SheetFooter className="border-t px-5 py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-serif text-2xl font-bold text-primary">
                  {formatPrice(total)}
                </span>
              </div>
              <Separator className="mb-3" />
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Finalizar pedido
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleClear}
                >
                  <X className="size-4" /> Vaciar carrito
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartLine({
  item,
  onInc,
  onDec,
  onRemove,
}: {
  item: CartItem;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className="flex gap-3 rounded-lg border border-border/60 bg-card p-3"
    >
      <div className="grid size-14 shrink-0 place-items-center rounded-md bg-secondary/30 text-3xl">
        {item.imagen}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium leading-tight">
            {item.nombre}
          </p>
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground transition-colors hover:text-destructive"
            aria-label={`Eliminar ${item.nombre} del carrito`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-7"
              onClick={onDec}
              aria-label="Disminuir cantidad"
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-8 text-center text-sm font-semibold">
              {item.cantidad}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-7"
              onClick={onInc}
              aria-label="Aumentar cantidad"
            >
              <Plus className="size-3" />
            </Button>
          </div>
          <span className="text-sm font-semibold text-primary">
            {formatPrice(item.precio * item.cantidad)}
          </span>
        </div>
      </div>
    </motion.li>
  );
}
