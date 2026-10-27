"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  platilloId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  remove: (platilloId: string) => void;
  updateQuantity: (platilloId: string, cantidad: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (item, cantidad = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.platilloId === item.platilloId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.platilloId === item.platilloId
                ? { ...i, cantidad: i.cantidad + cantidad }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...items, { ...item, cantidad }],
            isOpen: true,
          });
        }
      },
      remove: (platilloId) =>
        set({
          items: get().items.filter((i) => i.platilloId !== platilloId),
        }),
      updateQuantity: (platilloId, cantidad) => {
        if (cantidad <= 0) {
          set({
            items: get().items.filter((i) => i.platilloId !== platilloId),
          });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.platilloId === platilloId ? { ...i, cantidad } : i
          ),
        });
      },
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ isOpen: open }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
      count: () =>
        get().items.reduce((sum, i) => sum + i.cantidad, 0),
    }),
    {
      name: "sabores-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
