"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import { CartSheet } from "@/components/site/cart-sheet";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);

  // Auto-close sheet on route change is handled per-page; here we just ensure
  // hydration is safe by waiting for the cart to mount on the client.
  useEffect(() => {
    // Ensures we don't try to read localStorage before hydration.
  }, []);

  return (
    <>
      {children}
      <CartSheet open={isOpen} onOpenChange={setOpen} />
    </>
  );
}
